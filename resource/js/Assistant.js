//기본 Assistant 클래스
export class Assistant {
    constructor(name) {
        this.name = name;
    }

    static DEFAULT_RESPONSE = '죄송해요, 이해하지 못했어요 😢';

    respond(command, keyword) {
        return Assistant.DEFAULT_RESPONSE;
    }
}

//날씨 Assistant
class WeatherAssistant extends Assistant {
    respond(command, keyword) {
        if (command == '날씨') {
            if (keyword == '서울') return '☀️ 서울은 맑아요 !';
            if (keyword == '제주') return '🌧️ 제주는 비 와요 !';
            return `${keyword}의 날씨 정보는 아직 없어요.`;
        }

        return super.respond(command);
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

// 외부에서 사용할 수 있게 export
export const assistants = [new WeatherAssistant('날씨봇'), new FoodAssistant('맛집봇')];
