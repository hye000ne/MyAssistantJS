// 기본 Assistant 클래스
class Assistant {
    constructor(name) {
        this.name = name;
    }

    static INIT_MSG = `안녕하세요! 궁금한 게 있으시면 말해보세요 😊\n 처음이라면 아래처럼 입력해보세요: \n 형식 / [날씨 / 맛집 / 번역 / 계산]`;
    static DEFAULT_RESPONSE = '죄송해요, 이해하지 못했어요 😢';

    respond() {
        return Assistant.DEFAULT_RESPONSE;
    }
}

// 정보 Assistant
class InfoAssistant extends Assistant {
    respond(command, arg) {
        if (command !== '형식') return super.respond();

        switch (arg) {
            case '날씨':
                return `날씨 정보를 보려면 이렇게 입력해 주세요:\n예: 날씨 / 서울, 날씨 / 서울 / 옷차림`;
            case '맛집':
                return `맛집 정보를 보려면 이렇게 입력해 주세요:\n예: 맛집 / 강남`;
            default:
                return `형식을 알고 싶은 주제를 알려주세요 😊 (예: 형식 / [날씨 / 맛집 / 번역 / 계산])`;
        }
    }
}

// 날씨 Assistant (API)
class WeatherAPIAssistant extends Assistant {
    async respond(command, arg, arg2) {
        if (command !== '날씨') return super.respond();

        const mapped = CITY_MAP[arg] || arg;
        const city = encodeURIComponent(mapped);
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${OPENWEATHER_API_KEY}&units=metric&lang=kr`;

        try {
            const response = await fetch(url);
            const data = await response.json();
            console.log(data);

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
            } else if (data.cod == 404) {
                return `⚠️ ${arg} 날씨 정보를 찾을 수 없어요. 영문이나 다른 도시명을 시도해 보세요.`;
            } else {
                return '😵 서버 오류로 날씨 데이터를 가져오지 못했어요. 잠시 후 다시 시도해 주세요.';
            }
        } catch (e) {
            return '😵 날씨 정보를 가져오는 데 문제가 발생했어요.';
        }
    }
}

// 번역 Assistant (API)
class TranslateAssistant extends Assistant {
    async respond(command, arg) {
        if (command !== '번역') return super.respond();
    }
}

// 계산 Assistant
class CalcAssistant extends Assistant {
    respond(command, arg) {
        if (command !== '계산') return super.respond();
        const expr = arg.trim();
        if (!expr) return `계산할 수식을 입력해 주세요. 예: 계산 / 3+4`;

        const isValid = /^[0-9+\-*/().\s]+$/.test(expr);
        if (!isValid) return `❌ 허용되지 않은 문자가 있어요. 숫자와 사칙연산 기호만 써주세요.`;

        try {
            let result = new Function('return ' + expr)();
            if (!isFinite(result)) return `❌ 0으로는 나눌 수 없어요.`;

            result = Number(result.toFixed(4)); // 소숫점 4자리
            return `🧮 계산 결과: ${expr} = ${result}`;
        } catch (e) {
            return `⚠️ 수식을 계산할 수 없어요. 괄호나 연산자를 확인해 보세요.`;
        }
    }
}

// 맛집 Assistant
class FoodAssistant extends Assistant {
    respond(command, arg) {
        if (command == '맛집') {
            if (arg == '강남') return "🍖 강남에 삼겹살 맛집 '돈돈'이 있어요 !";
            if (arg == '홍대') return "🍣 홍대에 초밥 맛집 '스시야미'이 있어요 !";
            return `${arg}의 맛집 정보는 아직 없어요.`;
        }

        return super.respond(command);
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

const CITY_MAP = {
    서울: 'Seoul',
    부산: 'Busan',
    인천: 'Incheon',
    대구: 'Daegu',
    대전: 'Daejeon',
    광주: 'Gwangju',
    울산: 'Ulsan',
    제주: 'Jeju',
    강릉: 'Gangneung',
    강진: 'Gangjin',
    여수: 'Yeosu',
    청주: 'Cheongju',
    천안: 'Cheonan',
    포항: 'Pohang',
    창원: 'Changwon'
};

// 전역 배열로 비서들 등록
const assistants = [
    new InfoAssistant('안내봇'),
    new WeatherAPIAssistant('날씨봇'),
    new FoodAssistant('맛집봇'),
    new CalcAssistant('계산봇')
];
