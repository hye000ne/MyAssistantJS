# 🧑‍💻 나만의 비서 챗봇 (MyAssistantJS)

> **HTML5, CSS3, Vanilla JS 기반의 생활형 챗봇**

날씨, 번역, 계산, MBTI, 랜덤 선택 기능을 통합한 개인 비서형 챗봇입니다.  
간단한 명령어 입력으로 다양한 기능을 제공하며, 사용자 경험(UX)과 유지보수성, 확장성을 고려해 설계되었습니다.

<br/>

---

## 🚀 주요 기능
- **날씨 조회**  
  도시명을 입력하면 현재 날씨와 기온을 안내하고, 추가로 옷차림까지 추천합니다.
- **번역**  
  다양한 언어로 텍스트를 간편하게 번역합니다.
- **계산**  
  사칙연산 및 간단한 수식을 계산합니다.
- **랜덤 선택**  
  여러 항목 중 하나를 무작위로 추천해줍니다.
- **MBTI 안내**  
  입력된 MBTI 성향에 따른 설명과 잘 맞는/안 맞는 유형을 안내합니다.
- **명령어 관리 (Admin 모드)**  
  사용자가 직접 명령어를 추가, 수정, 삭제할 수 있습니다.


## 🛠️ 사용 기술
- **HTML5**: 구조화된 마크업
- **CSS3**: Flexbox, Grid Layout 활용한 반응형 UI
- **Vanilla JavaScript (ES6+)**
- **SessionStorage / LocalStorage**: 데이터 저장
- **OpenWeatherMap API**: 실시간 날씨 데이터 호출
- **Google Translate API**: 다국어 번역 기능

<br/>

## ⚙️ 개발 환경
- **IDE**: Visual Studio Code
- **버전 관리**: Git
- **테스트 환경**: 로컬 브라우저
- **외부 API**:
  - [OpenWeatherMap](https://openweathermap.org/)
  - [Google Translate API](https://cloud.google.com/translate)

<br/>

## 📁 폴더 구조
```bash
MYASSISTANTJS/
├── docs/
│ ├── 나만의 비서 챗봇.pptx # 발표자료
│ └── 테스트 케이스.xlsx # 테스트 케이스 문서
├── public/
│ ├── index.html # 인트로 페이지
│ └── main.html # 메인 페이지
├── resource/
│ ├── assets/ # 아바타 이미지 리소스
│ ├── css/
│ │ └── style.css # CSS 스타일 파일
│ └── js/
│ ├── app.js # 앱 실행 및 메인 흐름
│ ├── Assistant.js # 기능별 Assistant 클래스 정의
│ ├── config.js # 환경변수 및 키 설정
│ └── data.js # 메시지/명령어 상수 데이터
```

<br/>


## 💡 특징
- **비동기 처리**: API 요청 시 `async/await`로 비동기 데이터 흐름 관리
- **로딩 메시지 구현**: 자연스러운 대화 UX 제공
- **유지보수성 강화**: 메시지/데이터 상수화
- **관리자 기능**: 직접 명령어 추가/수정/삭제 가능

<br/>

## 💻 실행 방법

1. 코드를 클론하거나 다운로드합니다.
2. 브라우저에서 `public/index.html` 파일을 실행합니다.
3. 이름 입력 후 챗봇 메인 페이지로 이동합니다.
4. 명령어를 `/` 기반으로 입력하면 다양한 기능을 사용할 수 있습니다.

<br/>

## ⚠️ 주의 사항
- 날씨 및 번역 기능은 외부 API 호출이 필요하므로, API KEY를 `config.js`에 설정해야 정상 동작합니다.
- 무료 API 사용량 제한에 주의하세요.

<br/>

---
