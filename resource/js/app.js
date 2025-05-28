const INIT_MSG = Assistant.INIT_MSG; // 초기 인사 메시지
const ADMIN_INIT_MSG = Assistant.ADMIN_INIT_MSG; // 초기 인사 메시지
const DEFAULT_RESPONSE = Assistant.DEFAULT_RESPONSE; // 기본 응답 메시지('죄송해요, 이해하지 못했어요 😢')

let userInput;
let chatBox;

// 사용자 입력 처리
async function submitInput() {
    const inputValue = userInput.value.trim();
    if (!inputValue) return;
    if (userInput.disabled) return; //로딩 중 입력 제어어
    userInput.disabled = true;

    // 사용자 메시지 화면 출력 후 입력box 초기화
    printMsg('user', inputValue);
    userInput.value = '';

    const parts = inputValue.split('/').map(x => x.trim());
    const command = parts[0];
    const arg = parts[1] || '';
    const arg2 = parts[2] || '';
    const arg3 = parts[3] || '';

    if (command === '나가기') {
        return (window.location.href = '../../public/index.html');
    }

    let response = DEFAULT_RESPONSE;
    // 관리자
    if (user === 'ADMIN') {
        adminBot = new AdminAssistant('admin_bot');
        const res = await adminBot.respond(command, arg, arg2);
        if (res !== DEFAULT_RESPONSE) {
            response = res;
        }

        await delay(200);
        printMsg('bot', response, 'admin_bot');
        return;
    }

    // 일반 사용자
    let avatar;
    const loadingEl = printLoadingMsg(); // 비서 대답이 오기 전까지 로딩메시지 출력
    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
    await delay(800); // 로딩 보여주는 시간 확보

    // 비서 응답 탐색
    for (let i = 0; i < assistants.length; i++) {
        const res = await assistants[i].respond(command, arg, arg2, arg3);
        if (res !== DEFAULT_RESPONSE) {
            response = res;
            avatar = assistants[i].name;
            break;
        }
    }

    loadingEl.style.visibility = 'hidden';
    loadingEl.style.height = `${loadingEl.offsetHeight}px`; // 공간 유지

    await delay(300); // 약간 텀 준 후

    printMsg('bot', response, avatar); // 응답 출력

    // 응답 출력 후 완전 제거
    loadingEl.remove();
    userInput.disabled = false;
    userInput.focus();
}

// 화면 채팅창에 메시지 출력
function printMsg(type, message, avatar = 'default_bot') {
    let msg;
    if (type === 'bot') {
        // 비서(봇) 메시지 출력
        msg = document.createElement('div');
        const img = document.createElement('img');
        const bubble = document.createElement('div');
        msg.className = 'msg-row';
        img.className = 'avatar';
        img.src = `../../assets/${avatar}.png`;
        bubble.className = 'bubble';

        bubble.innerText = message;
        msg.appendChild(img);
        msg.appendChild(bubble);
    } else {
        // 사용자 메시지 출력
        msg = document.createElement('div');
        const bubble = document.createElement('div');

        msg.className = 'msg-row user';
        bubble.className = 'user-bubble';

        bubble.innerText = message;
        msg.appendChild(bubble);
    }

    chatBox.appendChild(msg);

    // 최신 메시지가 보이도록 스크롤 아래로 이동
    chatBox.scrollTop = chatBox.scrollHeight;
}

// 화면 채팅창에 로딩 메시지(...) 출력
function printLoadingMsg() {
    let msg = document.createElement('div');
    const img = document.createElement('img');
    const bubble = document.createElement('div');
    msg.className = 'msg-row';
    img.className = 'avatar';
    img.src = `../../assets/loading_bot.png`;
    bubble.className = 'bubble';

    // 초기엔 빈 말풍선으로 시작
    bubble.innerText = '';

    msg.appendChild(img);
    msg.appendChild(bubble);
    chatBox.appendChild(msg);
    chatBox.scrollTop = chatBox.scrollHeight;

    // 약간 딜레이 후 자연스럽게 텍스트 출력
    setTimeout(() => {
        bubble.innerText = '음... 잠시만요 🤔';
    }, 100);

    return msg;
}

function init() {
    userInput = document.getElementById('user-input');
    chatBox = document.getElementById('chat-box');

    if (user === 'ADMIN') {
        userInput.placeholder = '등록할 단어를 입력하세요.';
        printMsg('bot', ADMIN_INIT_MSG, 'admin_bot');
    } else {
        userInput.placeholder = '궁금한 걸 물어보세요.';
        printMsg('bot', INIT_MSG, 'default_bot');
    }

    userInput.addEventListener('keydown', e => {
        if (e.key === 'Enter') submitInput();
    });
}

addEventListener('load', init);
