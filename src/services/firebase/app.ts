/**
 * Firebase 연결 설정.
 * 값은 환경변수(.env.production / .env.local / Netlify 환경변수)에서 읽습니다.
 * 값이 비어 있으면 사이트는 자동으로 데모 모드로 동작합니다. (src/services/index.ts 참고)
 */
import { initializeApp, type FirebaseApp } from 'firebase/app';
import { connectAuthEmulator, getAuth, GoogleAuthProvider, signInWithCredential, type Auth } from 'firebase/auth';
import { connectFirestoreEmulator, getFirestore, type Firestore } from 'firebase/firestore';
import { FirebaseError } from 'firebase/app';

const env = import.meta.env;

export const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY as string | undefined,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN as string | undefined,
  projectId: env.VITE_FIREBASE_PROJECT_ID as string | undefined,
  appId: env.VITE_FIREBASE_APP_ID as string | undefined,
};

/** 관리자(교수님) 구글 계정 이메일 */
export const ADMIN_EMAIL = ((env.VITE_ADMIN_EMAIL as string | undefined) ?? '').trim().toLowerCase();

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
