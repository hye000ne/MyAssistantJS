//기본 Assistant 클래스
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

//정보 Assistant
class InfoAssistant extends Assistant {
    respond(command, keyword) {
        if (command == '형식') {
            switch (keyword) {
                case '날씨':
                    return `날씨 정보를 보려면 이렇게 입력해 주세요:\n예: 날씨 / 서울, 날씨 / 서울 / 옷차림`;
                case '맛집':
                    return `맛집 정보를 보려면 이렇게 입력해 주세요:\n예: 맛집 / 강남`;
                default:
                    return `형식을 알고 싶은 주제를 알려주세요 😊 (예: 형식 / [날씨 / 맛집 / 번역 / 계산])`;
            }
        }

        return super.respond();
    }
}

//날씨 Assistant (API)
class WeatherAPIAssistant extends Assistant {
    async respond(command, keyword) {
        if (command == '날씨' && !keyword) {
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

            const mapped = cityMap[keyword] || keyword;
            const city = encodeURIComponent(mapped);
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${OPENWEATHER_API_KEY}&units=metric&lang=kr`;

            try {
                const response = await fetch(url);
                const data = await response.json();
                console.log(data);

                if (data.cod === 200) {
                    const weather = data.weather[0].description;
                    const temp = data.main.temp;
                    return `🌤️ ${keyword}의 현재 날씨는 ${weather}, 기온은 ${Math.round(temp)}°C입니다.`;
                } else {
                    return `⚠️ ${keyword}의 날씨 정보를 찾을 수 없어요. 영어로 검색해주세요.`;
                }
            } catch (e) {
                return '😵 날씨 정보를 가져오는 데 문제가 발생했어요.';
            }
        }

        return super.respond();
    }
}

//맛집 Assistant
class FoodAssistant extends Assistant {
    respond(command, keyword) {
        if (command == '맛집') {
            if (keyword == '강남') return "🍖 강남에 삼겹살 맛집 '돈돈'이 있어요 !";
            if (keyword == '홍대') return "🍣 홍대에 초밥 맛집 '스시야미'이 있어요 !";
            return `${keyword}의 맛집 정보는 아직 없어요.`;
        }

        return super.respond(command);
    }
}

// 전역 배열로 비서들 등록
const assistants = [new InfoAssistant('안내봇'), new WeatherAPIAssistant('날씨봇'), new FoodAssistant('맛집봇')];
