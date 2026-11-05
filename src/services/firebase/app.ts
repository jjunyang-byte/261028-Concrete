/**
 * Firebase 연결 설정.
 * 값은 환경변수(.env.production / .env.local / Netlify 환경변수)에서 읽습니다.
 * - 배포 빌드(npm run build): 환경변수가 없거나 잘못돼도 아래 기본값으로 Firebase 모드
 * - 개발(npm run dev): 환경변수가 없으면 데모 모드 (src/services/index.ts 참고)
 */
import { initializeApp, type FirebaseApp } from 'firebase/app';
import { connectAuthEmulator, getAuth, GoogleAuthProvider, signInWithCredential, type Auth } from 'firebase/auth';
import { connectFirestoreEmulator, getFirestore, type Firestore } from 'firebase/firestore';
import { FirebaseError } from 'firebase/app';

const env = import.meta.env;

/**
 * 이 연구실 사이트의 Firebase 웹 설정 (concrete-7fb71).
 * 비밀번호가 아니라 원래 브라우저에 공개되는 값입니다. 데이터는 firestore.rules가 지킵니다.
 * 배포(production) 빌드에서 환경변수가 비었거나 형식이 잘못되면 이 값을 대신 씁니다.
 * → Netlify 환경변수에 오타가 있어도 사이트가 동작합니다.
 */
const PRODUCTION_DEFAULTS = {
  apiKey: 'AIzaSyAe_7hCUjus3q7w51jRZ3dFyt-V4ojS8hw',
  authDomain: 'concrete-7fb71.firebaseapp.com',
  projectId: 'concrete-7fb71',
  appId: '1:373612679034:web:18ac6d1ba9aca277f490c3',
  adminEmail: 'junrhkd@gmail.com',
};

/** 각 값이 올바른 모양인지 검사하는 규칙 */
const VALID: Record<keyof typeof PRODUCTION_DEFAULTS, RegExp> = {
  apiKey: /^AIza[0-9A-Za-z_-]{35}$/,
  authDomain: /^[a-z0-9.-]+\.[a-z]{2,}$/i,
  projectId: /^[a-z0-9-]{4,40}$/,
  appId: /^\d+:\d+:web:[0-9a-f]+$/,
  adminEmail: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
};

/**
 * 환경변수 값을 정리합니다. Netlify에 붙여넣다 생기는 흔한 실수를 고쳐 줍니다.
 *   - 앞뒤 빈칸, 줄바꿈
 *   - 감싼 따옴표 ("..." 또는 '...')
 *   - 값 칸에 "VITE_FIREBASE_API_KEY=..." 처럼 이름까지 붙여넣은 경우
 */
function clean(v: unknown): string {
  let s = typeof v === 'string' ? v.trim() : '';
  s = s.replace(/^[A-Z0-9_]+\s*=\s*/, '');
  s = s.replace(/^["'`]+|["'`]+$/g, '').trim();
  return s;
}

const isProductionBuild = env.MODE === 'production';

function pick(name: string, raw: unknown, key: keyof typeof PRODUCTION_DEFAULTS): string | undefined {
  const value = clean(raw);
  if (!isProductionBuild) return value || undefined; // 데모·에뮬레이터 빌드는 환경변수 그대로
  if (value && VALID[key].test(value)) return value;
  if (value) console.warn(`[Firebase 설정] ${name} 값의 형식이 올바르지 않아 기본값을 사용합니다. Netlify 환경변수를 확인하거나 지워 주세요.`);
  return PRODUCTION_DEFAULTS[key];
}

/**
 * 배포 빌드에서 환경변수의 프로젝트 ID가 비었거나 기본 프로젝트(concrete-7fb71)와 같으면,
 * 나머지 값도 검증된 기본값을 그대로 씁니다. (Netlify 값에 오타가 있어도 영향 없음)
 * 다른 Firebase 프로젝트로 옮길 때만 환경변수 값이 쓰입니다.
 */
const envProjectId = clean(env.VITE_FIREBASE_PROJECT_ID);
const useBuiltIn = isProductionBuild && (!envProjectId || envProjectId === PRODUCTION_DEFAULTS.projectId);

export const firebaseConfig = useBuiltIn
  ? {
      apiKey: PRODUCTION_DEFAULTS.apiKey,
      authDomain: PRODUCTION_DEFAULTS.authDomain,
      projectId: PRODUCTION_DEFAULTS.projectId,
      appId: PRODUCTION_DEFAULTS.appId,
    }
  : {
      apiKey: pick('VITE_FIREBASE_API_KEY', env.VITE_FIREBASE_API_KEY, 'apiKey'),
      authDomain: pick('VITE_FIREBASE_AUTH_DOMAIN', env.VITE_FIREBASE_AUTH_DOMAIN, 'authDomain'),
      projectId: pick('VITE_FIREBASE_PROJECT_ID', env.VITE_FIREBASE_PROJECT_ID, 'projectId'),
      appId: pick('VITE_FIREBASE_APP_ID', env.VITE_FIREBASE_APP_ID, 'appId'),
    };

/** 관리자(교수님) 구글 계정 이메일 */
export const ADMIN_EMAIL = (pick('VITE_ADMIN_EMAIL', env.VITE_ADMIN_EMAIL, 'adminEmail') ?? '').toLowerCase();

/** 필요한 값이 모두 있으면 true → Firebase 모드 */
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.authDomain && firebaseConfig.projectId && firebaseConfig.appId,
);

let cached: { app: FirebaseApp; auth: Auth; db: Firestore } | null = null;

/** 처음 쓸 때 한 번만 Firebase를 초기화합니다. */
export function fb() {
  if (!cached) {
    const app = initializeApp(firebaseConfig);
    cached = { app, auth: getAuth(app), db: getFirestore(app) };
    // 개발자용: VITE_FIREBASE_EMULATOR=true 이면 내 컴퓨터의 Firebase 에뮬레이터에 연결합니다.
    if (import.meta.env.VITE_FIREBASE_EMULATOR === 'true') {
      connectAuthEmulator(cached.auth, 'http://127.0.0.1:9099', { disableWarnings: true });
      connectFirestoreEmulator(cached.db, '127.0.0.1', 8080);
      // 자동 테스트용: 에뮬레이터에서만 가짜 구글 계정으로 바로 로그인
      const auth = cached.auth;
      (window as unknown as Record<string, unknown>).__emulatorSignIn = (email: string, name: string) =>
        signInWithCredential(
          auth,
          GoogleAuthProvider.credential(JSON.stringify({ sub: email, email, email_verified: true, name })),
        );
    }
  }
  return cached;
}

/** Firebase 오류를 사용자에게 보여 줄 한국어 문장으로 바꿉니다. */
export function toKoreanError(e: unknown): Error {
  if (e instanceof FirebaseError) {
    console.error(e); // 개발자 도구(F12) 콘솔에 원래 오류와 해결 링크가 보입니다.
    switch (e.code) {
      case 'permission-denied':
        return new Error('권한이 없습니다. 승인된 구성원인지 확인해 주세요.');
      case 'unauthenticated':
        return new Error('로그인이 필요합니다.');
      case 'failed-precondition':
        return new Error('데이터베이스 색인(index)이 아직 준비되지 않았습니다. README의 "색인 만들기"를 참고해 주세요.');
      case 'unavailable':
        return new Error('서버에 연결할 수 없습니다. 인터넷 연결을 확인해 주세요.');
      case 'not-found':
        return new Error('데이터를 찾을 수 없습니다.');
      default:
        return new Error(`오류가 발생했습니다. (${e.code})`);
    }
  }
  return e instanceof Error ? e : new Error('알 수 없는 오류가 발생했습니다.');
}

/** Promise 실패 시 한국어 오류로 바꿔 던집니다. */
export async function wrap<T>(p: Promise<T>): Promise<T> {
  try {
    return await p;
  } catch (e) {
    throw toKoreanError(e);
  }
}
