const rawUser = localStorage.getItem("username");
const user = rawUser ? rawUser.toUpperCase() : "사용자";

const MESSAGE = {
    INIT:
        `👋 ${user}님, 반가워요! 궁금한 게 있으시면 편하게 입력해보세요 😊\n` +
        `💡 명령어만 입력하면 형식을 알려드려요!\n` +
        `📌 사용 가능한 명령어: 날씨 / 번역 / 계산 / MBTI / 선택\n` +
        `📎 '나가기'를 입력하면 메인화면으로 돌아가요!`,
    ADMIN_INIT:
        `👋 관리자님, 반가워요! 새로운 단어나 응답을 추가해보세요.\n` +
        `💡 예시: 등록 / 안녕 / 네 안녕하세요! \n` +
        `📌  명령어: 목록 / 등록 / 수정 / 삭제  \n` +
        `📄 '나가기'를 입력하면 메인화면으로 돌아가요!`,
    DEFAULT_RESPONSE: `앗, 무슨 말인지 잘 모르겠어요 🤔 다시 한 번 입력해볼까요?`,
    ERRORS: {
        INVALID_INPUT: "음… 뭔가 빠졌거나 잘못된 것 같아요! 다시 한 번 확인해 볼까요?",
        SERVER_ERROR: "지금 서버랑 연결이 안 되고 있어요. 잠시 후 다시 시도해 주세요!",
        UNKNOWN: "이런… 예상 못 한 문제가 생겼어요! 다른 걸 시도해볼까요?",
        CITY_NAME_UNKNOWN: "아, 헷갈려요! 도시명을 영어로 입력해주시면 알 수 있을지도 몰라요!",
        DIVIDE_BY_ZERO: `0으로는 나눌 수 없어요.`,
        INVALID_EXPRESSION_FORMAT: "수식에 숫자나 기호가 잘못된 것 같아요!",
        INVALID_EXPRESSION: `수식이 잘못된 것 같아요!\n` + `연산자가 빠졌거나 숫자가 부족한 건 아닐까요?`,
        ONLY_ONE_OPTION: `하나만 고르면 제가 고를 수가 없어요!\n` + `최소 2개 이상 입력해 주세요.`,
        INVALID_MBTI: `MBTI는 4자리 영어로 구성돼 있어요!\n` + `예: ISFJ, ENTP 등 정확히 입력해 주세요.`,
    },
    HELP_TEXTS: {
        날씨: `${user}님, 도시명을 함께 입력해 주세요 😊\n` + `예) 날씨 / 서울\n` + `※ 옷차림 추천은 '날씨 / 서울 / 옷차림'으로 입력해보세요.`,
        번역: `${user}님, 번역할 문장을 입력해 주세요 😊\n` + `예) 번역 / 안녕하세요 / 영어\n` + `※ 원문 언어는 지정하지 않아도 자동 감지돼요.\n` + `※ 번역 언어를 생략하면 영어로 번역돼요.`,
        계산: `${user}님, 계산할 수식을 입력해 주세요 😊\n` + `예) 계산 / 3+4\n` + `※ 사칙연산(+, -, *, /)만 가능해요.`,
        선택: `${user}님, 항목들을 쉼표(,)로 구분해 입력해 주세요 😊\n` + `예) 선택 / 치킨, 피자, 햄버거`,
        MBTI: `${user}님, MBTI 유형을 입력해 주세요 😊\n` + `예) MBTI / ISFJ`,
    },
    RESPONSES: {
        날씨: {
            RESULT: (city, weather, temp) => `🌤️ ${city}의 현재 날씨는 ${weather}, 기온은 ${Math.round(temp)}°C입니다.`,
            CLOTHES: (city, weather, temp, clothes) => `🌤️ ${city} 현재 ${weather} / ${Math.round(temp)}°C\n👕 오늘 추천 옷차림\n→ ${clothes}`,
        },
        번역: {
            RESULT: (translation) => `🌐 번역 결과!\n${translation}`,
        },
        계산: {
            RESULT: (arg, result) => `🧮 계산해보니...\n→ ${arg} = ${result}`,
            DIVIDE_BY_ZERO: `❌ 0으로는 나눌 수 없어요 😵 다른 수식으로 다시 시도해볼까요?`,
        },
        선택: {
            RESULT: (item) => `🧐 제 선택은 바로 ${item} 입니다!`,
        },
        MBTI: {
            RESULT: (mbti, desc, good, bad) => `${user}님은 '${mbti}' 유형이에요.\n특징: ${desc}\n😍 잘 맞는 유형 : ${good.join(", ")}\n😒 잘 안맞는 유형 : ${bad.join(", ")}`,
        },
    },
};

const COMMAND_MAP = ["날씨", "번역", "계산", "MBTI", "선택"];

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

const MBTI_DATA = {
    INFP: {
        description: "이상주의적이고 감성적이며 배려심이 깊다.",
        goodMatch: ["ENFJ", "INFJ"],
        badMatch: ["ESTP", "ENTP"],
    },
    INFJ: {
        description: "통찰력 있고 조용하며 깊은 인간관계를 선호한다.",
        goodMatch: ["ENFP", "INFP"],
        badMatch: ["ESTP", "ESFP"],
    },
    ENFP: {
        description: "창의적이고 열정적이며 사람들과 어울리는 것을 좋아한다.",
        goodMatch: ["INFJ", "INTJ"],
        badMatch: ["ISTJ", "ISFJ"],
    },
    ENFJ: {
        description: "리더십이 있고 타인의 감정을 잘 이해하며 조화로운 관계를 중시한다.",
        goodMatch: ["INFP", "ISFP"],
        badMatch: ["ISTP", "INTP"],
    },
    INTP: {
        description: "논리적이고 호기심이 많으며 독립적인 사고를 선호한다.",
        goodMatch: ["ENTP", "INTJ"],
        badMatch: ["ESFJ", "ENFJ"],
    },
    INTJ: {
        description: "계획적이고 전략적인 사고를 하며 자기주도적인 성향이 강하다.",
        goodMatch: ["ENFP", "ENTP"],
        badMatch: ["ESFP", "ESTP"],
    },
    ENTP: {
        description: "창의적이고 논쟁을 즐기며 새로운 아이디어를 탐구한다.",
        goodMatch: ["INFJ", "INTJ"],
        badMatch: ["ISFJ", "ISTJ"],
    },
    ENTJ: {
        description: "결단력 있고 목표 지향적이며 리더십이 뛰어나다.",
        goodMatch: ["INTP", "INFP"],
        badMatch: ["ISFP", "ISFJ"],
    },
    ISFP: {
        description: "감성적이고 조용하며 타인을 잘 배려한다.",
        goodMatch: ["ESFP", "ENFP"],
        badMatch: ["ENTJ", "ESTJ"],
    },
    ISFJ: {
        description: "성실하고 책임감이 강하며 타인을 돕는 데 기쁨을 느낀다.",
        goodMatch: ["ESFP", "ESTP"],
        badMatch: ["ENTP", "ENFP"],
    },
    ESFP: {
        description: "사교적이고 긍정적이며 현재를 즐긴다.",
        goodMatch: ["ISFJ", "ESFJ"],
        badMatch: ["INTJ", "INFJ"],
    },
    ESFJ: {
        description: "다정하고 협조적이며 타인과의 조화를 중요시한다.",
        goodMatch: ["ISFP", "ISTP"],
        badMatch: ["INTP", "ENTP"],
    },
    ISTP: {
        description: "논리적이고 현실적이며 문제 해결에 강하다.",
        goodMatch: ["ESTP", "ISFP"],
        badMatch: ["ENFJ", "ESFJ"],
    },
    ISTJ: {
        description: "신중하고 책임감이 강하며 원칙을 중시한다.",
        goodMatch: ["ISFJ", "ESTJ"],
        badMatch: ["ENFP", "ENTP"],
    },
    ESTP: {
        description: "현실적이고 활동적이며 즉흥적인 행동을 즐긴다.",
        goodMatch: ["ISTP", "ESFP"],
        badMatch: ["INFJ", "INFP"],
    },
    ESTJ: {
        description: "실용적이고 조직적이며 리더십이 강하다.",
        goodMatch: ["ISTJ", "ISFJ"],
        badMatch: ["INFP", "ISFP"],
    },
};
