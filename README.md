# 구조·지반 연구실 웹사이트 (Phase 1)

토목공학과 연구실 홈페이지입니다. 연구·수업 자료를 공개하고, 대학원생과 연구 결과를 토론하는 게시판이 있습니다.

> **지금은 Phase 1(데모 단계)입니다.**
> 로그인과 게시판은 "데모 모드"로 동작합니다. 글과 댓글은 **보고 있는 브라우저에만** 저장되어
> 다른 사람과 공유되지 않습니다. 실제 구글 로그인과 공유 게시판은 Phase 2(Firebase 연동)에서 붙입니다.

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

## 2. 데모 모드 사용법

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

## 3. 내 컴퓨터에서 실행해 보기 (선택)

[Node.js](https://nodejs.org/) 20.19 이상(LTS 버전 권장)을 설치한 뒤, 이 폴더에서 아래 명령을 차례로 실행합니다.

```bash
npm install
```

```bash
npm run dev
```

화면에 나오는 주소(보통 http://localhost:5173)를 브라우저로 열면 됩니다.
배포용 파일을 만들어 확인하려면 `npm run build` 후 `npm run preview`를 실행합니다.

---

## 4. Netlify 배포 (처음 한 번만)

1. [Netlify](https://app.netlify.com/)에 GitHub 계정으로 로그인합니다.
2. **Add new site → Import an existing project → GitHub**를 누르고 이 저장소를 고릅니다.
3. 설정 값은 `netlify.toml` 파일에 이미 들어 있으므로 **그대로 Deploy** 버튼을 누르면 됩니다.
   - Build command: `npm run build`
   - Publish directory: `dist`
4. 이후에는 GitHub에 변경이 올라갈 때마다 자동으로 다시 배포됩니다.

`netlify.toml`에는 `/research` 같은 주소로 바로 들어가거나 새로고침해도 404가 나지 않도록 하는 설정도 들어 있습니다.

---

## 5. 폴더 구조

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
│   └── mock/          Phase 1 데모 구현 (브라우저 저장소 사용)
├── hooks/           페이지 제목 설정 등
└── theme/           다크 모드
```

---

## 6. Phase 2 (Firebase 연동) 준비 메모 — 개발 담당자용

- 화면 컴포넌트는 `src/services/index.ts`에서 내보내는 `authService`, `discussionService`, `userService`만 사용합니다.
  저장소(localStorage/Firestore)를 직접 부르지 않습니다.
- Firebase 구현을 `src/services/firebase/`에 만들고, `src/services/index.ts`의 import 세 줄만 바꾸면 됩니다.
  `resetDemoData`는 `undefined`로 바꾸면 초기화 버튼이 사라집니다.
- `AuthService.isDemo`를 `false`로 하면 로그인 버튼이 "구글 로그인" 한 번 클릭 방식으로 바뀝니다.
- `UserService`에는 요구사항 인터페이스 외에 가입 거절용 `removeUser(uid)`를 추가했습니다 (Firestore `users/{uid}` 삭제).
- 권한 규칙은 `src/services/permissions.ts`에 있습니다. 같은 규칙을 `firestore.rules`에도 반드시 적어야 합니다
  (화면에서 버튼을 숨기는 것만으로는 보안이 되지 않습니다).
- 게시판 페이지 나누기는 `cursor` 문자열(마지막 글 id)로 합니다. Firestore에서는 `startAfter(문서 스냅샷)`로 바꾸면 됩니다.
- 환경변수 이름은 `.env.example`에 있습니다. 실제 값은 `.env.local`(GitHub에 올라가지 않음)과 Netlify 환경변수에 넣습니다.
- Node.js 버전: Netlify는 `netlify.toml`에서 22로 고정했습니다. React Router는 Node 20을 지원하는 7.x를 씁니다.
