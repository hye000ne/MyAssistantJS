const userInput = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');

// Assistant 배열
const assistants = [new WeatherAssistant('날씨봇'), new FoodAssistant('맛집봇')];

// 사용자 입력 처리
function submitInput() {
    const inputValue = userInput.value.trim();
    if (!inputValue) return;

    // 사용자 메시지 화면 출력
    printMessage('user', inputValue);
    userInput.value = ''; // 초기화

    // 비서들에게 명령어 전달
    let response = new Assistant().respond(); // 모든 비서가 이해 못 할 경우 응답
    for (let i = 0; i < assistants.length; i++) {
        const res = assistants[i].respond(inputValue);
        console.log(`[${assistants[i].name} 응답]: ${res}`);

        if (res !== new Assistant().respond()) {
            response = res;
            break;
        }
    }

    // 응답 출력
    setTimeout(() => {
        printMessage('bot', response);
    }, 300);
}

// 화면 채팅창에 메시지 출력
function printMessage(type, message) {
    const msg = document.createElement('div');
    msg.className = type; // [user, bot]
    msg.innerText = (type == 'user' ? '👤' : '🤖') + message; // 말머리

    chatBox.appendChild(msg);

    // 최신 메시지가 보이도록 스크롤 아래로 이동
    chatBox.scrollTop = chatBox.scrollHeight;
}
