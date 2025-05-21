const INIT_MSG = Assistant.INIT_MSG; // 초기 인사 메시지
const DEFAULT_RESPONSE = Assistant.DEFAULT_RESPONSE; // 기본 응답 메시지('죄송해요, 이해하지 못했어요 😢')

let userInput;
let chatBox;

// 사용자 입력 처리
async function submitInput() {
    const inputValue = userInput.value.trim();
    if (!inputValue) return;

    // 사용자 메시지 화면 출력 후 입력box 초기화
    printMsg('user', inputValue);
    userInput.value = '';

    const command = inputValue.split('/')[0].trim();
    const keyword = (inputValue.split('/')[1] || '').trim();

    // 비서들에게 명령어 전달
    let response = DEFAULT_RESPONSE; // 모든 비서가 이해 못 할 경우 응답

    for (let i = 0; i < assistants.length; i++) {
        const res = await assistants[i].respond(command, keyword);
        console.log(`[${assistants[i].name} 응답]: ${res}`);

        if (res !== DEFAULT_RESPONSE) {
            response = res;
            break;
        }
    }

    // 응답 출력
    setTimeout(() => {
        printMsg('bot', response);
    }, 300);
}

// 화면 채팅창에 메시지 출력
function printMsg(type, message) {
    const msg = document.createElement('div');
    msg.className = type; // [user, bot]
    msg.innerText = (type == 'user' ? '👤' : '🤖') + message;

    chatBox.appendChild(msg);

    // 최신 메시지가 보이도록 스크롤 아래로 이동
    chatBox.scrollTop = chatBox.scrollHeight;
}

function init() {
    userInput = document.getElementById('user-input');
    chatBox = document.getElementById('chat-box');

    printMsg('bot', INIT_MSG);
    userInput.addEventListener('keydown', e => {
        if (e.key == 'Enter') submitInput();
    });
}

addEventListener('load', init);
