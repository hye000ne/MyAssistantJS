// 기본 Assistant 클래스
class Assistant {
    constructor(name) {
        this.name = name;
    }

    static INIT_MSG = `안녕하세요! 궁금한 게 있으시면 말해보세요 😊\n처음이라면 이렇게 입력해보세요:\n예) 날씨 / 서울\n[날씨 / 번역 / 계산 / 선택]`;
    static DEFAULT_RESPONSE = `앗, 무슨 말인지 잘 모르겠어요 🤔 다시 말해볼까요?`;

    respond() {
        return Assistant.DEFAULT_RESPONSE;
    }
}

// 날씨 Assistant (API)
class WeatherAPIAssistant extends Assistant {
    async respond(command, arg, arg2) {
        if (command !== "날씨") return super.respond();
        if (!arg) return `도시명을 같이 적어주세요.\n예: 날씨 / 서울\n옵션) 날씨 / 서울 / 옷차림`;
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
                let clothes = "";

                if (arg2 === "옷차림") {
                    clothes = getClothesForTemp(temp);
                    return `🌤️ ${arg} 현재 ${weather} / ${Math.round(temp)}°C\n👕 오늘 추천 옷차림\n→ ${clothes}`;
                } else {
                    return `🌤️ ${arg}의 현재 날씨는 ${weather}, 기온은 ${Math.round(temp)}°C입니다.`;
                }
            } else if (data.cod == 404) {
                return `⚠️ ${arg} 날씨 정보를 찾을 수 없어요. 영문이나 다른 도시명을 시도해 보세요.`;
            } else {
                return `😵 서버 오류로 날씨 데이터를 가져오지 못했어요. 잠시 후 다시 시도해 주세요.`;
            }
        } catch (e) {
            return `😵 날씨 정보를 가져오는 데 문제가 발생했어요.`;
        }
    }
}

// 번역 Assistant (API)
class TranslateAssistant extends Assistant {
    async respond(command, arg, arg2, arg3) {
        if (command !== "번역") return super.respond();
        if (!arg)
            return `번역할 문장을 입력해 주세요. 언어를 함께 지정하면 더 정확해요! 😊\n예: 번역 / 안녕하세요 / 한국어 / 일본어\n※ 원문 언어를 생략하면 자동 감지돼요.\n※ 번역될 언어를 생략하면 영어로 번역돼요.`;
        const from = LANG_MAP[arg2] || "auto";
        const to = LANG_MAP[arg3] || "en";
        const txt = encodeURIComponent(arg);

        const url = `https://lingva.ml/api/v1/${from}/${to}/${txt}`;

        try {
            const response = await fetch(url);
            const data = await response.json();
            // console.log(data);

            if (data.error) return `⚠️ 오류가 발생했어요 (${data.error})`;

            return `🌐 번역 결과!\n${data.translation}`;
        } catch (e) {
            return `😵 번역 정보를 가져오는 데 문제가 발생했어요.`;
        }
    }
}

// 계산 Assistant (=더치페이)
class CalcAssistant extends Assistant {
    respond(command, arg) {
        if (command !== "계산") return super.respond();
        if (!arg) return `계산할 수식을 입력해 주세요.\n예: 계산 / 3+4\n※ 사칙연산만 가능해요.\n`;

        const isValid = /^[0-9+\-*/().\s]+$/.test(arg);
        if (!isValid) return `❌ 허용되지 않은 문자가 있어요. 숫자와 사칙연산 기호만 써주세요.`;

        try {
            let result = new Function("return " + arg)();
            if (!isFinite(result)) return `❌ 0으로는 나눌 수 없어요.`;

            result = Number(result.toFixed(4)); // 소숫점 4자리
            return `🧮 계산 결과: ${arg} = ${result}`;
        } catch (e) {
            return `⚠️ 수식을 계산할 수 없어요. 괄호나 연산자를 확인해 보세요.`;
        }
    }
}

// 선택 Assistant
class PickAssistant extends Assistant {
    respond(command, arg) {
        if (command !== "선택") return super.respond();
        if (!arg) return `항목들을 쉼표로 나눠서 적어주세요. 대신 골라드릴게요! 예: 선택 / 치킨, 피자, 햄버거`;

        let items = arg
            .split(",")
            .map((x) => x.trim())
            .filter((x) => x);
        if (items.length === 0) return `⚠️ 입력된 항목이 비어있어요. 다시 한 번 확인해 주세요!`;
        if (items.length === 1) return `😵 항목이 하나뿐이에요. 두 개 이상 입력해 주세요.`;
        let idx = Math.floor(Math.random() * items.length);

        return `🧐 제 선택은 바로 ${items[idx]} 입니다!`;
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
    서울: "Seoul",
    부산: "Busan",
    인천: "Incheon",
    대구: "Daegu",
    대전: "Daejeon",
    광주: "Gwangju",
    울산: "Ulsan",
    제주: "Jeju",
    강릉: "Gangneung",
    강진: "Gangjin",
    여수: "Yeosu",
    청주: "Cheongju",
    천안: "Cheonan",
    포항: "Pohang",
    창원: "Changwon",
};

const LANG_MAP = {
    한글: "ko",
    한국어: "ko",
    영어: "en",
    미국: "en",
    일본어: "ja",
    일본: "ja",
    중국어: "zh",
    중국: "zh",
    프랑스어: "fr",
    프랑스: "fr",
    독일어: "de",
    독일: "de",
    스페인어: "es",
    스페인: "es",
    러시아어: "ru",
    러시아: "ru",
    베트남어: "vi",
    베트남: "vi",
};

// 전역 배열로 비서들 등록
const assistants = [new WeatherAPIAssistant("날씨봇"), new CalcAssistant("계산봇"), new TranslateAssistant("번역봇"), new PickAssistant("선택봇")];
