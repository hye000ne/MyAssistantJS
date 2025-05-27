const rawUser = localStorage.getItem('username');
const user = rawUser ? rawUser.toUpperCase() : '사용자';

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

const LANG_MAP = {
    한글: 'ko',
    한국어: 'ko',
    영어: 'en',
    미국: 'en',
    일본어: 'ja',
    일본: 'ja',
    중국어: 'zh',
    중국: 'zh',
    프랑스어: 'fr',
    프랑스: 'fr',
    독일어: 'de',
    독일: 'de',
    스페인어: 'es',
    스페인: 'es',
    러시아어: 'ru',
    러시아: 'ru',
    베트남어: 'vi',
    베트남: 'vi'
};

const MBTI_DATA = {
    INFP: {
        description: '이상주의적이고 감성적이며 배려심이 깊다.',
        goodMatch: ['ENFJ', 'INFJ'],
        badMatch: ['ESTP', 'ENTP']
    },
    INFJ: {
        description: '통찰력 있고 조용하며 깊은 인간관계를 선호한다.',
        goodMatch: ['ENFP', 'INFP'],
        badMatch: ['ESTP', 'ESFP']
    },
    ENFP: {
        description: '창의적이고 열정적이며 사람들과 어울리는 것을 좋아한다.',
        goodMatch: ['INFJ', 'INTJ'],
        badMatch: ['ISTJ', 'ISFJ']
    },
    ENFJ: {
        description: '리더십이 있고 타인의 감정을 잘 이해하며 조화로운 관계를 중시한다.',
        goodMatch: ['INFP', 'ISFP'],
        badMatch: ['ISTP', 'INTP']
    },
    INTP: {
        description: '논리적이고 호기심이 많으며 독립적인 사고를 선호한다.',
        goodMatch: ['ENTP', 'INTJ'],
        badMatch: ['ESFJ', 'ENFJ']
    },
    INTJ: {
        description: '계획적이고 전략적인 사고를 하며 자기주도적인 성향이 강하다.',
        goodMatch: ['ENFP', 'ENTP'],
        badMatch: ['ESFP', 'ESTP']
    },
    ENTP: {
        description: '창의적이고 논쟁을 즐기며 새로운 아이디어를 탐구한다.',
        goodMatch: ['INFJ', 'INTJ'],
        badMatch: ['ISFJ', 'ISTJ']
    },
    ENTJ: {
        description: '결단력 있고 목표 지향적이며 리더십이 뛰어나다.',
        goodMatch: ['INTP', 'INFP'],
        badMatch: ['ISFP', 'ISFJ']
    },
    ISFP: {
        description: '감성적이고 조용하며 타인을 잘 배려한다.',
        goodMatch: ['ESFP', 'ENFP'],
        badMatch: ['ENTJ', 'ESTJ']
    },
    ISFJ: {
        description: '성실하고 책임감이 강하며 타인을 돕는 데 기쁨을 느낀다.',
        goodMatch: ['ESFP', 'ESTP'],
        badMatch: ['ENTP', 'ENFP']
    },
    ESFP: {
        description: '사교적이고 긍정적이며 현재를 즐긴다.',
        goodMatch: ['ISFJ', 'ESFJ'],
        badMatch: ['INTJ', 'INFJ']
    },
    ESFJ: {
        description: '다정하고 협조적이며 타인과의 조화를 중요시한다.',
        goodMatch: ['ISFP', 'ISTP'],
        badMatch: ['INTP', 'ENTP']
    },
    ISTP: {
        description: '논리적이고 현실적이며 문제 해결에 강하다.',
        goodMatch: ['ESTP', 'ISFP'],
        badMatch: ['ENFJ', 'ESFJ']
    },
    ISTJ: {
        description: '신중하고 책임감이 강하며 원칙을 중시한다.',
        goodMatch: ['ISFJ', 'ESTJ'],
        badMatch: ['ENFP', 'ENTP']
    },
    ESTP: {
        description: '현실적이고 활동적이며 즉흥적인 행동을 즐긴다.',
        goodMatch: ['ISTP', 'ESFP'],
        badMatch: ['INFJ', 'INFP']
    },
    ESTJ: {
        description: '실용적이고 조직적이며 리더십이 강하다.',
        goodMatch: ['ISTJ', 'ISFJ'],
        badMatch: ['INFP', 'ISFP']
    }
};
