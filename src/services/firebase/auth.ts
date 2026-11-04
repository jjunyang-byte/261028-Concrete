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
import { ADMIN_EMAIL, fb, toKoreanError } from './app';
import { toAppUser } from './convert';

/** 지금 로그인한 사용자 (다른 서비스에서 작성자 이름 등을 채울 때 사용) */
let current: AppUser | null = null;
export function getCurrentAppUser(): AppUser | null {
  return current;
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

  onAuthStateChanged(callback) {
    const { auth, db } = fb();
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
        console.error('사용자 정보를 만들지 못했습니다.', e);
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
          callback(current);
        },
        (err) => {
          console.error(err);
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
          throw new Error('이 주소는 Firebase 승인된 도메인에 등록되어 있지 않습니다. (Authentication > 설정 > 승인된 도메인)');
      }
      throw toKoreanError(e);
    }
  },

  async signOut() {
    await fbSignOut(fb().auth);
  },
};
