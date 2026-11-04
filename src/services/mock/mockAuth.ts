/**
 * [mock] 데모 로그인 구현.
 * 실제 계정 없이, 역할(관리자/학생/대기)을 고르면 해당 가상 사용자로 로그인됩니다.
 * 로그인 상태는 브라우저 저장소에 기억되어 새로고침해도 유지됩니다.
 */
import type { AppUser, AuthService, DemoAccount } from '../types';
import { delay, readJSON, writeJSON } from './storage';
import { DEMO_UIDS, ensureSeedUser, findUser } from './mockUsers';

const SESSION_KEY = 'session-uid';
const listeners = new Set<(user: AppUser | null) => void>();

/** 현재 로그인한 사용자 (mock 서비스 내부에서 권한 확인용으로 사용) */
export function getCurrentUser(): AppUser | null {
  const uid = readJSON<string | null>(SESSION_KEY, null);
  return uid ? findUser(uid) : null;
}

/** 역할 변경 등으로 사용자 정보가 바뀌었을 때 화면에 알립니다. */
export function notifyAuthChanged() {
  const user = getCurrentUser();
  listeners.forEach((cb) => cb(user));
}

const demoAccounts: DemoAccount[] = [
  { role: 'admin', label: '관리자 (교수)', description: '모든 글 관리, 공지 작성, 가입 승인' },
  { role: 'member', label: '승인된 학생', description: '게시판 읽기·쓰기, 본인 글 관리' },
  { role: 'pending', label: '승인 대기 학생', description: '가입했지만 아직 승인 전' },
];

export const mockAuthService: AuthService = {
  isDemo: true,
  demoAccounts,

  onAuthStateChanged(callback) {
    listeners.add(callback);
    // 구독 즉시 현재 상태를 한 번 알려 줍니다 (Firebase와 같은 동작).
    queueMicrotask(() => callback(getCurrentUser()));
    return () => {
      listeners.delete(callback);
    };
  },

  async signIn(opts) {
    await delay(100);
    const role = opts?.demoRole ?? 'member';
    ensureSeedUser(DEMO_UIDS[role]);
    writeJSON(SESSION_KEY, DEMO_UIDS[role]);
    notifyAuthChanged();
  },

  async signOut() {
    await delay(50);
    writeJSON(SESSION_KEY, null);
    notifyAuthChanged();
  },
};
