# 남하빈 포트폴리오

React + Vite + Tailwind CSS로 만든 개인 포트폴리오 사이트입니다. 프로젝트 콘텐츠는 Notion을 원본으로 하며, Google Apps Script 웹앱을 통해 매 요청마다 실시간으로 불러옵니다.

![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?logo=tailwindcss&logoColor=white)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)

**Demo:** `https://<username>.github.io/<repo-name>/` (배포 후 채울 예정)

## 아키텍처

콘텐츠는 이 레포지토리 안에 존재하지 않습니다. 실제 데이터는 Notion 두 개의 DB에 있고, Apps Script 웹앱이 요청 시점에 Notion API를 호출해 JSON으로 변환한 뒤, 프론트엔드가 그 JSON을 fetch해서 렌더링합니다.

```
┌───────────────┐   Notion API    ┌─────────────────────┐   fetch (JSON)   ┌───────────────┐
│    Notion     │ ───────────────▶│  Apps Script 웹앱     │─────────────────▶│  React (Vite)  │
│               │                 │  (apps-script/       │                  │                │
│ 포트폴리오     │◀─────────────── │   Code.gs)           │◀──────────────── │  src/App.jsx   │
│ 발행본 DB      │  query results  │                       │  ?c=slug (선택)  │                │
│ 지원회사별     │                 │  - 10분 스크립트 캐시  │                  │                │
│ 설정 DB        │                 │  - slug -> 프로젝트   │                  │                │
│               │                 │    조합 필터링         │                  │                │
└───────────────┘                 └─────────────────────┘                  └───────────────┘
```

1. `apps-script/Code.gs`는 이 레포지토리와 별개로 Google Apps Script 콘솔에 배포되는 백엔드 코드입니다. 레포에는 전체 파이프라인이 보이도록 참고용으로만 포함되어 있으며, 여기 있는 파일을 수정해도 실제 배포본에는 반영되지 않습니다. 실제 반영하려면 Apps Script 콘솔에서 직접 코드를 수정하고 새로 배포해야 합니다.
2. URL 파라미터 없이 접속하면 "포트폴리오 발행본" DB의 전체 프로젝트(마스터 버전)를 표시순서대로 반환합니다.
3. `?c=슬러그` 파라미터가 있으면 "지원회사별 설정" DB에서 해당 슬러그에 매칭되는 행을 찾아, 그 회사에 맞는 프로젝트 조합과 포지셔닝 문장을 반환합니다. 매칭되는 슬러그가 없으면 마스터 버전으로 자동 폴백합니다.

## 기술 스택

- **Frontend:** React 18, Vite 5, Tailwind CSS 3, lucide-react
- **Backend:** Google Apps Script (Notion API 프록시 겸 응답 캐시)
- **Data source:** Notion (Internal Integration을 통한 API 접근)
- **Hosting / CI:** GitHub Pages, GitHub Actions (`.github/workflows/deploy.yml`)

## 로컬에서 실행하기

```bash
npm install
cp .env.example .env
```

`.env`를 열어 `VITE_API_URL`에 본인이 배포한 Apps Script 웹앱의 `/exec` URL을 입력합니다.

```bash
npm run dev
```

`http://localhost:5173`에서 확인할 수 있습니다. `VITE_API_URL`이 비어 있으면 프로젝트 목록 영역에 에러 상태가 표시됩니다.

## 폴더 구조

```
.
├── apps-script/
│   └── Code.gs              # 참고용 백엔드 코드. 실제로는 Apps Script 콘솔에 별도 배포됨
├── public/
│   └── favicon.svg
├── src/
│   ├── api/
│   │   └── usePortfolioData.js   # Apps Script fetch + ?c= 슬러그 처리 훅
│   ├── components/
│   │   ├── About.jsx
│   │   ├── Contact.jsx
│   │   ├── Footer.jsx
│   │   ├── Header.jsx
│   │   ├── Hero.jsx
│   │   ├── ProjectCard.jsx
│   │   ├── ProjectDetailModal.jsx
│   │   ├── Projects.jsx
│   │   └── Skills.jsx
│   ├── data/
│   │   ├── nav.js           # 헤더 내비게이션 항목
│   │   └── skills.js        # Skills 섹션 정적 데이터
│   ├── theme.js             # dark 여부로부터 Tailwind 클래스 토큰을 파생
│   ├── App.jsx               # 상태를 소유하고 섹션 컴포넌트들을 조립
│   ├── main.jsx
│   └── index.css
├── .env.example
├── LICENSE
└── vite.config.js
```

## 회사별 맞춤 링크 (`?c=` 파라미터)

Notion의 "지원회사별 설정" DB에 slug를 등록하면, URL에 해당 슬러그를 붙여 그 회사에 맞춘 프로젝트 조합과 포지셔닝 문장만 노출할 수 있습니다.

```
https://<username>.github.io/<repo-name>/?c=회사슬러그
```

파라미터 없이 접속하면 전체 프로젝트(마스터 버전)가 보입니다. 등록되지 않은 슬러그로 접속해도 에러 없이 마스터 버전으로 표시됩니다.

## 설계 노트

프로젝트 콘텐츠(카드 문구, 문제 상황, 의사결정, 성과 등)를 코드나 정적 파일이 아니라 Notion에 둔 이유는, 콘텐츠를 갱신할 때마다 사이트를 다시 빌드하고 배포할 필요가 없게 하기 위해서입니다. Notion의 "포트폴리오 발행본" DB만 수정하면, 프론트엔드는 다음 요청부터 (Apps Script의 10분 캐시가 만료된 뒤) 바뀐 내용을 그대로 보여줍니다. 회사별 맞춤 버전도 마찬가지로, 코드 변경이나 재배포 없이 Notion에서 slug와 노출 프로젝트 조합을 관리하는 것만으로 처리됩니다.

## License

이 프로젝트는 [MIT License](./LICENSE)를 따릅니다.
