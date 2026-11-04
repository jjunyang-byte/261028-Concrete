# 구조·지반 연구실 웹사이트

토목공학과 연구실 홈페이지입니다. 연구·수업 자료를 공개하고, 대학원생과 연구 결과를 토론하는 게시판이 있습니다.

> **두 가지 모드로 동작합니다.**
> - **배포된 사이트(Netlify)**: Firebase 모드 — 실제 구글 로그인, 게시글이 모든 구성원에게 공유됩니다.
> - **내 컴퓨터에서 `npm run dev`**: 데모 모드 — 역할을 골라 로그인해 보는 체험용. 데이터는 그 브라우저에만 저장됩니다.
>
> Firebase를 처음 연결할 때는 아래 **"Firebase 설정 (처음 한 번만)"** 단계를 꼭 마쳐 주세요.

---

## 1. 사이트 내용 고치기 (코드 몰라도 됩니다)

교수 소개, 논문, 수업 자료 등은 모두 `src/data/` 폴더의 파일에 있습니다.
각 파일 맨 위에 **수정 방법**이 한국어로 적혀 있으니 그대로 따라 하시면 됩니다.

| 파일 | 내용 | 표시되는 곳 |
|---|---|---|
| `src/data/site.ts` | 연구실 이름, 소속, 주소, 연락처 | 상단 제목, 하단 푸터 |
| `src/data/professor.ts` | 교수 소개, 사진, 연구 관심사 | 홈 |
| `src/data/news.ts` | 최근 소식 | 홈 (최신 3개) |
| `src/data/research.ts` | 연구 분야 카드 | 연구 |
| `src/data/publications.ts` | 논문 목록 | 연구 (연도별 자동 정리) |
| `src/data/courses.ts` | 과목, 주차별 자료 링크 | 수업 자료 |
| `src/data/members.ts` | 구성원 (교수/박사/석사/졸업생) | 구성원 |

**GitHub 웹사이트에서 바로 고치는 법**

1. GitHub 저장소에서 고칠 파일을 엽니다 (예: `src/data/news.ts`).
2. 오른쪽 위 연필 아이콘(✏️ Edit)을 누릅니다.
3. 작은따옴표 `' '` 안의 글자만 바꿉니다. **따옴표와 쉼표(,)는 지우지 마세요.**
4. 아래 **Commit changes** 버튼을 누르면 1~2분 뒤 Netlify가 자동으로 사이트를 다시 만듭니다.

> 실수로 형식이 깨지면 Netlify 배포가 실패하고, **기존 사이트는 그대로 유지**됩니다.
> Netlify의 Deploys 화면에서 빨간 실패 표시를 보면, 방금 고친 부분의 따옴표·쉼표를 확인해 주세요.

**자료 파일(PDF, PPT 등)은?**
이 사이트에는 파일을 직접 올리지 않습니다 (무료 요금제 제약).
Google Drive에 올린 뒤 공유 설정을 **"링크가 있는 모든 사용자"** 로 바꾸고, 그 링크 주소를 `courses.ts`에 붙여 넣으세요.

**교수님 사진 넣기**: 사진 파일을 `public/professor.jpg`로 올리고, `professor.ts`에서 `photo: '/professor.jpg'`로 적습니다.

---

## 2. Firebase 설정 (처음 한 번만)

Firebase 프로젝트(`concrete-7fb71`), 구글 로그인 사용 설정, 승인된 도메인 추가는 이미 마치셨습니다.
남은 단계는 아래 3가지입니다. 모두 [Firebase 콘솔](https://console.firebase.google.com/project/concrete-7fb71)에서 합니다.

### ① Firestore 데이터베이스 만들기
1. 왼쪽 메뉴 **빌드 → Firestore Database → 데이터베이스 만들기**
2. 위치: **asia-northeast3 (서울)** 추천 (나중에 바꿀 수 없습니다)
3. **프로덕션 모드로 시작** 선택 → 만들기

### ② 보안 규칙 붙여넣기 (가장 중요)
1. Firestore Database 화면의 **규칙(Rules)** 탭을 엽니다.
2. 기존 내용을 모두 지우고, 이 저장소의 **`firestore.rules` 파일 내용을 통째로 복사해 붙여넣습니다.**
3. **게시(Publish)** 버튼을 누릅니다.

> 이 규칙이 "승인된 구성원만 게시판 읽기·쓰기", "본인 글만 수정·삭제", "공지는 관리자만",
> "가입 승인은 관리자만" 같은 권한을 서버에서 지켜 줍니다.

### ③ 색인(index) 만들기 — 게시판 카테고리 필터용
1. Firestore Database 화면의 **색인(Indexes)** 탭 → **복합(Composite)** → **색인 만들기**
2. 다음과 같이 입력 후 만들기 (완성까지 몇 분 걸립니다)
   - 컬렉션 ID: `posts`
   - 필드 1: `category` — 오름차순
   - 필드 2: `createdAt` — 내림차순
   - 쿼리 범위: 컬렉션

> 이 단계를 건너뛰면 "전체"는 보이지만 "연구토론/수업질문/공지" 필터를 누를 때
> "색인이 아직 준비되지 않았습니다" 안내가 나옵니다.

### ④ 처음 로그인 (관리자)
- 사이트에서 **구글 로그인**을 누르고 관리자 계정(**junrhkd@gmail.com**)으로 로그인하면 자동으로 **관리자**가 됩니다.
- 학생이 로그인하면 **승인 대기** 상태가 되고, 상단 메뉴의 **관리자** 페이지에서 승인/거절할 수 있습니다.
- 거절하면 그 학생의 신청 정보가 지워집니다. 다시 로그인하면 다시 승인 대기로 신청됩니다.

**관리자 이메일을 바꾸려면** 두 곳을 같이 고쳐야 합니다.
`firestore.rules`의 `adminEmail()` 안 주소(고친 뒤 ②처럼 다시 게시)와 `.env.production`의 `VITE_ADMIN_EMAIL`.

**Netlify 주소를 바꾸거나 직접 산 도메인을 연결하면**, Firebase 콘솔 → Authentication → 설정 → **승인된 도메인**에 그 주소도 추가해야 로그인이 됩니다.

---

## 3. 데모 모드 사용법 (내 컴퓨터에서 `npm run dev` 할 때)

오른쪽 위 **데모 로그인** 버튼을 누르면 역할을 고를 수 있습니다.

| 역할 | 할 수 있는 것 |
|---|---|
| 로그인 안 함 | 홈·연구·수업 자료·구성원 보기. 게시판은 "로그인이 필요합니다" 안내 |
| 승인 대기 학생 | "교수님 승인 대기 중입니다" 안내만 보임 |
| 승인된 학생 | 게시판 읽기·쓰기, **본인** 글·댓글 수정·삭제 |
| 관리자 (교수) | 모든 글·댓글 수정·삭제, **공지** 작성, `/admin`에서 가입 승인·거절 |

- 화면 하단 **데모 데이터 초기화**를 누르면 게시판과 사용자 목록이 처음 상태로 돌아갑니다.
- 예시 글·예시 인물·예시 논문은 모두 가상의 내용입니다.

---

## 4. 내 컴퓨터에서 실행해 보기 (선택)

[Node.js](https://nodejs.org/) 20.19 이상(LTS 버전 권장)을 설치한 뒤, 이 폴더에서 아래 명령을 차례로 실행합니다.

```bash
npm install
```

```bash
npm run dev
```

화면에 나오는 주소(보통 http://localhost:5173)를 브라우저로 열면 **데모 모드**로 열립니다.
배포와 똑같이 **Firebase 모드**로 확인하려면 `npm run build` 후 `npm run preview`를 실행합니다.

---

## 5. Netlify 배포 (처음 한 번만)

1. [Netlify](https://app.netlify.com/)에 GitHub 계정으로 로그인합니다.
2. **Add new site → Import an existing project → GitHub**를 누르고 이 저장소를 고릅니다.
3. 설정 값은 `netlify.toml` 파일에 이미 들어 있으므로 **그대로 Deploy** 버튼을 누르면 됩니다.
   - Build command: `npm run build`
   - Publish directory: `dist`
4. 이후에는 GitHub에 변경이 올라갈 때마다 자동으로 다시 배포됩니다.

Firebase 설정 값은 `.env.production` 파일에 들어 있어서 **Netlify에 환경변수를 따로 넣지 않아도 됩니다.**
(이 값들은 비밀번호가 아니라 원래 브라우저에 공개되는 값입니다. 데이터는 보안 규칙이 지킵니다.)
다만 Netlify에서 값을 관리하고 싶다면 아래 방법으로 넣을 수 있고, **Netlify에 넣은 값이 `.env.production`보다 우선**합니다.

### Netlify 환경변수 설정 방법 (선택)

**넣을 값 (5개)**

| 이름 (Key) | 값 (Value) |
|---|---|
| `VITE_FIREBASE_API_KEY` | `AIzaSyAe_7hCUjus3q7w51jRZ3dFyt-V4ojS8hw` |
| `VITE_FIREBASE_AUTH_DOMAIN` | `concrete-7fb71.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | `concrete-7fb71` |
| `VITE_FIREBASE_APP_ID` | `1:373612679034:web:18ac6d1ba9aca277f490c3` |
| `VITE_ADMIN_EMAIL` | `junrhkd@gmail.com` |

> 값은 Firebase 콘솔 → ⚙️ 프로젝트 설정 → 일반 → **내 앱**의 `firebaseConfig`에서도 확인할 수 있습니다.
> (`apiKey`, `authDomain`, `projectId`, `appId` 항목. `storageBucket`, `messagingSenderId`, `measurementId`는 필요 없습니다.)

**한 개씩 넣기**

1. [app.netlify.com](https://app.netlify.com/)에 로그인 → 이 사이트를 클릭합니다.
2. 왼쪽 메뉴 **Site configuration** → **Environment variables**를 엽니다.
3. **Add a variable** → **Add a single variable**을 누릅니다.
4. **Key**에 이름(예: `VITE_FIREBASE_API_KEY`), **Values**에 값을 붙여넣습니다.
   - 앞뒤에 빈칸이나 따옴표(`"`)가 들어가지 않게 주의하세요.
   - **Scopes**는 기본값(All scopes) 그대로 두거나, 최소한 **Builds**가 선택되어 있어야 합니다.
   - **Values**는 "Same value for all deploy contexts"(모든 배포에 같은 값) 그대로 둡니다.
   - ⚠️ **"Contains secret values"(비밀 값) 체크는 하지 마세요.** 이 값들은 사이트 파일에 그대로 들어가는 것이 정상이라,
     비밀 값으로 표시하면 Netlify의 비밀 값 검사가 배포를 실패시킵니다.
5. **Create variable**을 누릅니다. 나머지 4개도 같은 방법으로 추가합니다.

**한 번에 넣기 (더 빠름)**

3번에서 **Add a variable → Import from a .env file**을 고르고, 아래 내용을 통째로 붙여넣은 뒤 **Import variables**를 누릅니다.

```
VITE_FIREBASE_API_KEY=AIzaSyAe_7hCUjus3q7w51jRZ3dFyt-V4ojS8hw
VITE_FIREBASE_AUTH_DOMAIN=concrete-7fb71.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=concrete-7fb71
VITE_FIREBASE_APP_ID=1:373612679034:web:18ac6d1ba9aca277f490c3
VITE_ADMIN_EMAIL=junrhkd@gmail.com
```

**넣은 뒤 꼭 다시 배포하기**

환경변수는 사이트를 **만들 때(빌드)** 들어가므로, 값을 넣거나 바꾼 뒤에는 다시 배포해야 반영됩니다.
왼쪽 메뉴 **Deploys** → 오른쪽 **Trigger deploy** → **Deploy site**를 누르세요.

**잘 됐는지 확인**

배포된 사이트 오른쪽 위가 **"구글 로그인"** 버튼이고, 눌렀을 때 구글 계정 선택 창이 뜨면 정상입니다.
로그인 창에서 오류(예: `api-key-not-valid`, `invalid-api-key`)가 나면 Netlify에 넣은 **값**에 오타나 빈칸이 있는 것이니 다시 확인하세요.
(이름(Key)을 틀리게 적으면 그 변수는 무시되고 `.env.production`의 값이 대신 쓰입니다.)

`netlify.toml`에는 `/research` 같은 주소로 바로 들어가거나 새로고침해도 404가 나지 않도록 하는 설정도 들어 있습니다.

---

## 6. 폴더 구조

```
src/
├── data/            ← ✏️ 사이트 내용 (교수님이 직접 고치는 곳)
├── pages/           화면(페이지)들
│   └── discussion/  게시판 목록·글쓰기·상세·수정
├── components/      공통 화면 조각 (상단 메뉴, 푸터, 로그인 버튼 등)
├── auth/            로그인 상태(AuthContext, useAuth), 권한 보호(RequireRole)
├── services/        데이터 처리 계층
│   ├── types.ts       데이터 형식과 서비스 "약속"(인터페이스)
│   ├── permissions.ts 권한 규칙 (누가 무엇을 할 수 있는지)
│   ├── index.ts       ★ 어떤 구현을 쓸지 정하는 단 한 곳
│   ├── firebase/      Firebase 구현 (구글 로그인 + Firestore)
│   └── mock/          데모 구현 (브라우저 저장소 사용)
├── hooks/           페이지 제목 설정 등
└── theme/           다크 모드
firestore.rules          Firestore 보안 규칙 (콘솔에 붙여넣는 내용)
firestore.indexes.json   필요한 색인 목록 (Firebase CLI용)
.env.production          배포용 Firebase 설정
```

---

## 7. 개발 담당자용 메모

- 화면 컴포넌트는 `src/services/index.ts`에서 내보내는 `authService`, `discussionService`, `userService`만 사용합니다.
  Firebase 환경변수가 있으면 `services/firebase/`, 없으면 `services/mock/` 구현이 선택됩니다.
- 사용자 문서: `users/{uid}` (role: pending/member/admin). 게시글: `posts/{id}`, 댓글: `posts/{id}/comments/{id}`.
- Cloud Functions가 없으므로 글 삭제 시 댓글을 클라이언트에서 먼저 일괄 삭제합니다
  (보안 규칙이 글 작성자에게 자기 글의 댓글 삭제를 허용).
- 역할 변경은 `users/{uid}` 문서를 실시간 구독하므로 승인 즉시 화면에 반영됩니다.
- `UserService`에는 가입 거절용 `removeUser(uid)`를 추가했습니다.
- 권한 규칙은 `src/services/permissions.ts`(화면)와 `firestore.rules`(서버) 두 곳에 있습니다. 바꿀 땐 둘 다 고치세요.
- Firebase CLI가 있다면 `firebase deploy --only firestore`로 규칙과 색인을 한 번에 배포할 수도 있습니다.
- Node.js 버전: Netlify는 `netlify.toml`에서 22로 고정했습니다. React Router는 Node 20을 지원하는 7.x를 씁니다.
