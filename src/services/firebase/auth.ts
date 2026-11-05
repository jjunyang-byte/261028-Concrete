/**
 * [Firebase] 구글 로그인 + 사용자 정보(users 컬렉션) 관리.
 *
 * 처음 로그인하면 users/{uid} 문서가 '승인 대기(pending)' 상태로 만들어집니다.
 * 관리자 이메일(VITE_ADMIN_EMAIL)로 로그인하면 자동으로 'admin'이 됩니다.
 * 교수님이 승인하면 역할이 바뀌고, 화면에 바로 반영됩니다(실시간 구독).
 */
import {
  GoogleAuthProvider,
  onAuthStateChanged as fbOnAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
  signOut as fbSignOut,
  type User,
} from 'firebase/auth';
import { doc, getDoc, onSnapshot, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { FirebaseError } from 'firebase/app';
import type { AppUser, AuthService } from '../types';
import { ADMIN_EMAIL, fb } from './app';
import { toAppUser } from './convert';

/** 지금 로그인한 사용자 (다른 서비스에서 작성자 이름 등을 채울 때 사용) */
let current: AppUser | null = null;
export function getCurrentAppUser(): AppUser | null {
  return current;
}

/** Firestore에서 사용자 정보를 읽고 쓰다 실패했을 때의 안내 문장 */
function userDocErrorMessage(e: unknown): string {
  const code = e instanceof FirebaseError ? e.code : '';
  if (code === 'permission-denied')
    return '구글 로그인은 되었지만, 데이터베이스가 사용자 정보 저장을 거부했습니다. Firebase 콘솔 → Firestore Database → 규칙 탭에 firestore.rules 내용을 붙여넣고 [게시]했는지 확인해 주세요.';
  if (code === 'not-found' || code === 'failed-precondition')
    return '구글 로그인은 되었지만, Firestore 데이터베이스를 찾을 수 없습니다. Firebase 콘솔 → Firestore Database에서 데이터베이스를 만들어 주세요.';
  if (code === 'unavailable')
    return '구글 로그인은 되었지만, 데이터베이스 서버에 연결할 수 없습니다. 인터넷 연결을 확인한 뒤 새로고침해 주세요.';
  return `구글 로그인은 되었지만, 사용자 정보를 불러오지 못했습니다. (${code || (e instanceof Error ? e.message : '알 수 없는 오류')})`;
}

function isAdminEmail(u: User): boolean {
  return Boolean(ADMIN_EMAIL) && u.emailVerified && (u.email ?? '').toLowerCase() === ADMIN_EMAIL;
}

/** users/{uid} 문서가 없으면 만들고, 관리자 이메일이면 역할을 admin으로 맞춥니다. */
async function ensureUserDoc(u: User): Promise<void> {
  const { db } = fb();
  const ref = doc(db, 'users', u.uid);
  const snap = await getDoc(ref);
  const admin = isAdminEmail(u);
  if (!snap.exists()) {
    await setDoc(ref, {
      uid: u.uid,
      email: u.email ?? '',
      displayName: (u.displayName || (u.email ?? '').split('@')[0] || '이름 없음').slice(0, 50),
      ...(u.photoURL ? { photoURL: u.photoURL } : {}),
      role: admin ? 'admin' : 'pending',
      createdAt: serverTimestamp(),
    });
  } else if (admin && snap.data().role !== 'admin') {
    await updateDoc(ref, { role: 'admin' });
  }
}

export const firebaseAuthService: AuthService = {
  isDemo: false,
  demoAccounts: [],

  onAuthStateChanged(callback, onError) {
    const { auth, db } = fb();
    const reportError = (e: unknown) => {
      console.error('[로그인] 사용자 정보 처리 실패', e);
      onError?.(userDocErrorMessage(e));
    };
    let unsubDoc: (() => void) | undefined;

    const unsubAuth = fbOnAuthStateChanged(auth, async (fbUser) => {
      unsubDoc?.();
      unsubDoc = undefined;
      if (!fbUser) {
        current = null;
        callback(null);
        return;
      }
      try {
        await ensureUserDoc(fbUser);
      } catch (e) {
        // 실패해도 아래 구독에서 다시 확인합니다. (원인을 화면에 알립니다)
        reportError(e);
      }
      // 역할이 바뀌면(승인 등) 바로 화면에 반영되도록 실시간 구독
      unsubDoc = onSnapshot(
        doc(db, 'users', fbUser.uid),
        (snap) => {
          if (!snap.exists()) {
            // 가입이 거절(삭제)된 경우: 로그아웃시킵니다. 다시 로그인하면 새로 신청됩니다.
            current = null;
            callback(null);
            void fbSignOut(auth);
            return;
          }
          current = toAppUser(snap);
          onError?.(null);
          callback(current);
        },
        (err) => {
          reportError(err);
          current = null;
          callback(null);
        },
      );
    });

    return () => {
      unsubAuth();
      unsubDoc?.();
    };
  },

  async signIn() {
    const { auth } = fb();
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    try {
      await signInWithPopup(auth, provider);
    } catch (e) {
      if (e instanceof FirebaseError) {
        // 사용자가 창을 닫은 경우는 오류로 보지 않습니다.
        if (e.code === 'auth/popup-closed-by-user' || e.code === 'auth/cancelled-popup-request') return;
        // 팝업이 차단되면 페이지 이동 방식으로 다시 시도합니다.
        if (e.code === 'auth/popup-blocked') return signInWithRedirect(auth, provider);
        if (e.code === 'auth/unauthorized-domain')
          throw new Error(
            `이 주소(${window.location.hostname})는 Firebase 승인된 도메인에 등록되어 있지 않습니다.\nFirebase 콘솔 → Authentication → 설정 → 승인된 도메인에 이 주소를 추가해 주세요.`,
          );
        if (e.code === 'auth/operation-not-allowed')
          throw new Error('Firebase에서 구글 로그인이 사용 설정되어 있지 않습니다. (Authentication → 로그인 방법 → Google 사용 설정)');
        if (e.code === 'auth/network-request-failed')
          throw new Error('네트워크 오류로 로그인하지 못했습니다. 인터넷 연결을 확인해 주세요.');
        if (e.code === 'auth/invalid-api-key' || e.code === 'auth/api-key-not-valid.-please-pass-a-valid-api-key.')
          throw new Error('Firebase API 키가 올바르지 않습니다. Netlify의 Site configuration → Environment variables에서 VITE_FIREBASE_로 시작하는 변수를 모두 지운 뒤 다시 배포해 주세요.');
      }
      console.error('[로그인] 구글 로그인 실패', e);
      throw new Error(`로그인하지 못했습니다. (${e instanceof FirebaseError ? e.code : '알 수 없는 오류'})`);
    }
  },

  async signOut() {
    await fbSignOut(fb().auth);
  },
};
