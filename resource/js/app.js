const DEFAULT_RESPONSE = Assistant.DEFAULT_RESPONSE; // 기본 응답 메시지('죄송해요, 이해하지 못했어요 😢')
const delay = ms => new Promise(resolve => setTimeout(resolve, ms)); // 비동기 지연 함수
let userInput; // 사용자 입력창
let chatBox; // 채팅창

// 사용자 입력 처리
async function submitInput() {
    const inputValue = userInput.value.trim(); // 입력값 앞뒤 공백 제거
    if (!inputValue) return; // 입력값 없으면 리턴
    if (userInput.disabled) return; //로딩 중 입력 제어
    userInput.disabled = true;

    // 사용자 메시지 화면 출력 + 입력창 초기화
    printMsg('user', inputValue);
    userInput.value = '';

    const parts = inputValue.split('/').map(x => x.trim()); // '/' 기준으로 입력 분리
    const command = parts[0];
    let arg = '';
    let arg2 = '';
    let arg3 = '';
    // 계산 명령어는 수식 전체를 하나의 문자열로 다룸
    if (command === '계산') {
        arg = parts.slice(1).join('/');
    } else {
        arg = parts[1] || '';
        arg2 = parts[2] || '';
        arg3 = parts[3] || '';
    }

    // '나가기' 명령어 처리
    if (command === '나가기') {
        return (window.location.href = '../../public/index.html');
    }

    let response = MESSAGE.DEFAULT_RESPONSE;

    // 관리자(Admin) 처리
    if (user === 'ADMIN') {
        adminBot = new AdminAssistant('admin_bot');
        const res = await adminBot.respond(command, arg, arg2);
        if (res !== MESSAGE.DEFAULT_RESPONSE) {
            response = res;
        }

        await delay(200); // 응답 텀 주기
        printMsg('bot', response, 'admin_bot'); // 로딩 메시지 출력
        userInput.disabled = false; // 입력창 활성화
        userInput.focus();
        return;
    }

    // 일반 사용자
    let avatar;
    const loadingEl = printLoadingMsg(); // 로딩 메시지 출력
    await delay(800); // 로딩 시간 확보

    // 비서 응답 탐색
    for (let i = 0; i < assistants.length; i++) {
        const res = await assistants[i].respond(command, arg, arg2, arg3);
        if (res !== MESSAGE.DEFAULT_RESPONSE) {
            response = res;
            avatar = assistants[i].name; // 해당 assistant의 avatar 설정
            break;
        }
    }

    loadingEl.style.visibility = 'hidden'; // 로딩 메시지 숨기기
    loadingEl.style.height = `${loadingEl.offsetHeight}px`; // 로딩 높이 유지
    await delay(300); // 자연스러운 응답 딜레이
    printMsg('bot', response, avatar); // 응답 메시지 출력
    loadingEl.remove(); // 로딩 메시지 제거
    userInput.disabled = false; // 입력창 활성화
    userInput.focus();
}

// 채팅창에 메시지 출력
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

// 로딩 메시지 출력
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
    userInput.focus();

    if (user === 'ADMIN') {
        userInput.placeholder = '등록할 단어를 입력하세요.';
        printMsg('bot', MESSAGE.ADMIN_INIT, 'admin_bot');
    } else {
        userInput.placeholder = '궁금한 걸 물어보세요.';
        printMsg('bot', MESSAGE.INIT, 'default_bot');
    }

    userInput.addEventListener('keydown', e => {
        if (e.key === 'Enter') submitInput();
    });
}

addEventListener('load', init);
