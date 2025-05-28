// 기본 Assistant 클래스
class Assistant {
    constructor(name = 'default_bot') {
        this.name = name;
    }

    static INIT_MSG = `👋 ${user}님, 반가워요! 궁금한 게 있으면 자유롭게 물어보세요 😊\n💡 명령어만 입력하면 형식을 안내해드려요!\n명령어 목록 :날씨/ 번역 / 계산 / MBTI / 선택\n📄 팁: '나가기'를 입력하면 메인화면으로 돌아가요!`;
    static ADMIN_INIT_MSG = `👋 관리자님, 반가워요! 등록할 단어랑 대답을 입력해주세요 😊\n💡 [목록 / 등록 / 수정 / 삭제] / 등록어 / 대답 😊!\n📄 팁: '나가기'를 입력하면 메인화면으로 돌아가요!`;
    static DEFAULT_RESPONSE = `앗, 무슨 말인지 잘 모르겠어요 🤔 다시 말해볼까요?`;

    static ERRORS = {
        INVALID_INPUT: '⚠️ 입력이 부족하거나 형식이 맞지 않아요. 다시 확인해 주세요.',
        INVALID_VALUE: '❌ 유효하지 않은 항목입니다. 다시 확인해 주세요.',
        SERVER_ERROR: '🔌 서버 연결에 문제가 있어요. 잠시 후 다시 시도해 주세요.',
        UNKNOWN: '😵 알 수 없는 오류가 발생했어요.'
    };

    static HELP_TEXTS = {
        날씨: `날씨 / 도시명 [옵션: 옷차림]`,
        번역: `번역 / 문장 / 언어1 / 언어2`,
        계산: `계산 / 수식 (예: 3 + 5)`,
        MBTI: `MBTI / 유형 (예: INFP)`,
        선택: `선택 / 항목1, 항목2, 항목3`
    };

    static getHelp(command) {
        return Assistant.HELP_TEXTS[command] || null;
    }

    respond(command) {
        const result = sessionStorage.getItem(command);
        return result || Assistant.DEFAULT_RESPONSE;
    }
}

// 관리자 Assistant
class AdminAssistant extends Assistant {
    respond(command, arg, arg2) {
        if (!command || !arg) return Assistant.ERRORS.INVALID_INPUT;
        if (command === '등록' || command === '수정') {
            sessionStorage.setItem(arg, arg2);
            return `😎 네! ${command}했습니다.\n이제 ${arg}(이)라고 입력하면 ${arg2}(이)라고 대답할 거에요!`;
        }
        if (command === '삭제') {
            sessionStorage.removeItem(arg);
            return `😎 네! ${command}했습니다.`;
        }

        return super.respond();
    }
}

// 날씨 Assistant (API)
class WeatherAPIAssistant extends Assistant {
    async respond(command, arg, arg2) {
        if (command !== '날씨') return super.respond();
        if (!arg)
            return `${user}님, 도시명을 함께 입력해 주세요 😊\n예: 날씨 / 서울\n※ 옷차림도 알고 싶다면 '날씨 / 서울 / 옷차림'으로 입력해 보세요.`;
        const mapped = CITY_MAP[arg] || arg;
        const city = encodeURIComponent(mapped);
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${OPENWEATHER_API_KEY}&units=metric&lang=kr`;

        try {
            const response = await fetch(url);
            const data = await response.json();
            // console.log(data);

            if (data.cod === 200) {
                const weather = data.weather[0].description;
                const temp = data.main.temp;
                let clothes = '';

                if (arg2 === '옷차림') {
                    clothes = getClothesForTemp(temp);
                    return `🌤️ ${arg} 현재 ${weather} / ${Math.round(temp)}°C\n👕 오늘 추천 옷차림\n→ ${clothes}`;
                } else {
                    return `🌤️ ${arg}의 현재 날씨는 ${weather}, 기온은 ${Math.round(temp)}°C입니다.`;
                }
            }
            if (data.cod === 404) {
                return Assistant.ERRORS.INVALID_VALUE;
            }

            return Assistant.ERRORS.SERVER_ERROR;
        } catch (e) {
            return Assistant.ERRORS.UNKNOWN;
        }
    }
}

// 번역 Assistant (API)
class TranslateAssistant extends Assistant {
    async respond(command, arg, arg2, arg3) {
        if (command !== '번역') return super.respond();
        if (!arg)
            return `${user}님, 번역할 문장을 입력해 주세요 😊\n예: 번역 / 안녕하세요 / 한국어 / 일본어\n※ 원문 언어를 생략하면 자동 감지돼요.\n※ 번역될 언어를 생략하면 영어로 번역돼요.`;
        const from = LANG_MAP[arg2] || 'auto';
        const to = LANG_MAP[arg3] || 'en';
        const txt = encodeURIComponent(arg);

        const url = `https://lingva.ml/api/v1/${from}/${to}/${txt}`;

        try {
            const response = await fetch(url);
            const data = await response.json();
            if (!response.ok) return Assistant.ERRORS.SERVER_ERROR;

            return `🌐 번역 결과!\n${data.translation}`;
        } catch (e) {
            return Assistant.ERRORS.UNKNOWN;
        }
    }
}

// 계산 Assistant
class CalcAssistant extends Assistant {
    respond(command, arg) {
        if (command !== '계산') return super.respond();
        if (!arg) return `${user}님, 계산할 수식을 입력해 주세요 😊\n예: 계산 / 3+4\n※ 사칙연산만 가능해요.`;

        const isValid = /^[0-9+\-*/().\s]+$/.test(arg);
        if (!isValid) return Assistant.ERRORS.INVALID_VALUE;

        try {
            let result = new Function('return ' + arg)();
            if (!isFinite(result)) return `❌ 0으로는 나눌 수 없어요.`;

            result = Number(result.toFixed(4)); // 소숫점 4자리
            return `🧮 계산 결과: ${arg} = ${result}`;
        } catch (e) {
            return Assistant.ERRORS.UNKNOWN;
        }
    }
}

// 선택 Assistant
class PickAssistant extends Assistant {
    respond(command, arg) {
        if (command !== '선택') return super.respond();
        if (!arg) return `${user}님, 항목들을 쉼표(,)로 구분해 입력해 주세요 😊\n예: 선택 / 치킨, 피자, 햄버거`;

        let items = arg
            .split(',')
            .map(x => x.trim())
            .filter(x => x);
        if (items.length === 0) return Assistant.ERRORS.INVALID_INPUT;
        if (items.length === 1) return Assistant.ERRORS.INVALID_VALUE;
        let idx = Math.floor(Math.random() * items.length);

        return `🧐 제 선택은 바로 ${items[idx]} 입니다!`;
    }
}

// MBTI Assistant
class MBTIAssistant extends Assistant {
    respond(command, arg) {
        if (command.toUpperCase() !== 'MBTI') return super.respond();
        if (!arg) return `${user}님, MBTI 유형을 입력해 주세요 😊\n예: MBTI / ISFJ`;
        const mbti = arg.toUpperCase();
        const data = MBTI_DATA[mbti];
        if (!data) return Assistant.ERRORS.INVALID_VALUE;

        const desc = data.description;
        const good = data.goodMatch;
        const bad = data.badMatch;

        return `${user}님은 '${mbti}' 유형이에요.\n특징: ${desc}\n😍 잘 맞는 유형 : ${good}\n😒 잘 안맞는 유형 : ${bad}`;
    }
}

function getClothesForTemp(temp) {
    if (temp >= 28) return `민소매, 반팔, 반바지, 린넨 옷`;
    else if (temp > 22 && temp < 28) return `반팔, 얇은 셔츠, 반바지, 면바지`;
    else if (temp > 19 && temp < 23) return `블라우스, 긴팔티, 면바지, 슬랙스`;
    else if (temp > 16 && temp < 20) return `얇은 가디건이나 니트, 맨투맨, 후드, 긴바지`;
    else if (temp > 11 && temp < 17) return `자켓, 가디건, 청자켓, 니트, 스타킹, 청바지`;
    else if (temp > 8 && temp < 12) return `트렌치 코트, 야상, 점퍼, 기모바지`;
    else if (temp > 4 && temp < 9) return `울 코트, 히트텍, 가죽옷, 기모`;
    else if (temp <= 4) return `패딩, 두꺼운 코드, 누빔 옷, 기모, 목도리`;
}

// 전역 배열로 비서들 등록
const assistants = [
    new Assistant('default_bot'),
    new WeatherAPIAssistant('weather_bot'),
    new CalcAssistant('calc_bot'),
    new TranslateAssistant('translate_bot'),
    new PickAssistant('pick_bot'),
    new MBTIAssistant('mbti_bot')
];
