// 기본 Assistant 클래스
class Assistant {
    constructor(name = 'default_bot') {
        this.name = name;
    }

    respond(command) {
        const result = sessionStorage.getItem(command);
        return result || MESSAGE.DEFAULT_RESPONSE;
    }
}

// 관리자 Assistant
class AdminAssistant extends Assistant {
    respond(command, arg, arg2) {
        if (command === '목록') {
            if (sessionStorage.length === 1) return `등록된 명령어가 없습니다. 등록 먼저 해주세요.`;
            let str = `지금까지 저장된 명령어 목록입니다!\n`;
            for (let idx = 0; idx < sessionStorage.length; idx++) {
                const key = sessionStorage.key(idx);
                const value = sessionStorage.getItem(key);
                if (key === 'IsThisFirstTime_Log_From_LiveServer') continue;
                str += `${key} : ${value}\n`;
            }
            return str.trim();
        }

        if (!command || !arg) return MESSAGE.ERRORS.INVALID_INPUT;
        if (command === '등록' || command === '수정') {
            if (!arg2) return MESSAGE.ERRORS.INVALID_INPUT;
            if (command === '수정' && sessionStorage.getItem(arg) === null) return `앗! ${arg}는(은) 등록돼있지 않아요.`;

            sessionStorage.setItem(arg, arg2);
            return `네! ${command}했습니다.\n이제 ${arg}(이)라고 입력하면 ${arg2}(이)라고 대답할 거에요!`;
        }
        if (command === '삭제') {
            if (sessionStorage.getItem(arg) === null) return `앗! ${arg}는(은) 등록돼있지 않아요.`;

            sessionStorage.removeItem(arg);
            return `네! ${arg}는(은) ${command}했습니다.`;
        }

        return super.respond();
    }
}

// 날씨 Assistant (API)
class WeatherAPIAssistant extends Assistant {
    async respond(command, arg, arg2) {
        if (command !== '날씨') return super.respond();
        if (!arg) return MESSAGE.HELP_TEXTS[command];
        const mapped = CITY_MAP[arg] || arg;
        const city = encodeURIComponent(mapped);

        try {
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${OPENWEATHER_API_KEY}&units=metric&lang=kr`;
            const response = await fetch(url);
            const data = await response.json();

            if (data.cod === 200) {
                const weather = data.weather[0].description;
                const temp = data.main.temp;
                let clothes = '';

                if (arg2 === '옷차림') {
                    clothes = getClothesForTemp(temp);
                    return MESSAGE.RESPONSES[command].CLOTHES(arg, weather, temp, clothes);
                } else {
                    return MESSAGE.RESPONSES[command].RESULT(arg, weather, temp);
                }
            }

            //에러 코드는 반환될 때 string값으로 옴
            if (data.cod === '404') return MESSAGE.ERRORS.CITY_NAME_UNKNOWN;

            return MESSAGE.ERRORS.SERVER_ERROR;
        } catch (e) {
            return MESSAGE.ERRORS.SERVER_ERROR;
        }
    }
}

// 번역 Assistant (API)
class TranslateAssistant extends Assistant {
    async respond(command, arg, arg2) {
        if (command !== '번역') return super.respond();
        if (!arg) return MESSAGE.HELP_TEXTS[command];
        const to = LANG_MAP[arg2] || 'en';

        try {
            const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${to}&dt=t&q=${encodeURIComponent(arg)}`;
            const response = await fetch(url);
            if (!response.ok) return MESSAGE.ERRORS.SERVER_ERROR;

            const data = await response.json();
            const translation = data[0].map(item => item[0]).join('');

            return MESSAGE.RESPONSES[command].RESULT(translation);
        } catch (e) {
            return MESSAGE.ERRORS.SERVER_ERROR;
        }
    }
}

// 계산 Assistant
class CalcAssistant extends Assistant {
    respond(command, arg) {
        if (command !== '계산') return super.respond();
        if (!arg) return MESSAGE.HELP_TEXTS[command];

        const isValid = /^[0-9+\-*/().\s]+$/.test(arg);
        if (!isValid) return MESSAGE.ERRORS.INVALID_EXPRESSION_FORMAT;

        try {
            let result = new Function('return ' + arg)();
            if (!isFinite(result)) return MESSAGE.ERRORS.DIVIDE_BY_ZERO;

            result = Number(result.toFixed(4)); // 소숫점 4자리
            return MESSAGE.RESPONSES[command].RESULT(arg, result);
        } catch (e) {
            return MESSAGE.ERRORS.INVALID_EXPRESSION;
        }
    }
}

// 선택 Assistant
class PickAssistant extends Assistant {
    respond(command, arg) {
        if (command !== '선택') return super.respond();
        if (!arg) return MESSAGE.HELP_TEXTS[command];

        let items = arg
            .split(',')
            .map(x => x.trim())
            .filter(x => x);
        if (items.length === 0) return MESSAGE.ERRORS.INVALID_INPUT;
        if (items.length === 1) return MESSAGE.ERRORS.ONLY_ONE_OPTION;
        let idx = Math.floor(Math.random() * items.length);
        return MESSAGE.RESPONSES[command].RESULT(items[idx]);
    }
}

// MBTI Assistant
class MBTIAssistant extends Assistant {
    respond(command, arg) {
        command = command.toUpperCase();
        if (command !== 'MBTI') return super.respond();
        if (!arg) return MESSAGE.HELP_TEXTS[command];
        const mbti = arg.toUpperCase();
        const data = MBTI_DATA[mbti];
        if (!data) return MESSAGE.ERRORS.INVALID_MBTI;

        const desc = data.description;
        const good = data.goodMatch;
        const bad = data.badMatch;
        return MESSAGE.RESPONSES[command].RESULT(mbti, desc, good, bad);
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
