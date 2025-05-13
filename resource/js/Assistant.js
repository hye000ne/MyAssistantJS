//기본 Assistant 클래스
class Assistant {
    constructor(name) {
        this.name = name;
    }

    respond(command) {
        return '죄송해요, 이해하지 못했어요 😢';
    }
}

//날씨 Assistant
class WeatherAssistant extends Assistant {
    respond(command) {
        if (command.includes('날씨')) {
            return '☀️ 오늘은 맑은 날씨네요 !';
        }

        return super.respond(command);
    }
}

//맛집 Assistant
class FoodAssistant extends Assistant {
    respond(command) {
        if (command.includes('맛집')) {
            return '🍖 근처에 삼겹살 맛집이 있어요 !';
        }

        return super.respond(command);
    }
}
