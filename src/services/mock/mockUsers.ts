/**
 * [mock] 사용자 목록 저장소 + UserService 구현.
 * 데모용 가상 사용자들이 미리 들어 있습니다. (모두 예시이며 실존 인물이 아닙니다.)
 */
import { PermissionError, type AppUser, type Role, type UserService } from '../types';
import { delay, readJSON, writeJSON } from './storage';
import { getCurrentUser, notifyAuthChanged } from './mockAuth';

const KEY = 'users';

export const DEMO_UIDS: Record<Role, string> = {
  admin: 'demo-admin',
  member: 'demo-member',
  pending: 'demo-pending',
};

const SEED_USERS: AppUser[] = [
  { uid: DEMO_UIDS.admin, email: 'professor@example.ac.kr', displayName: '김교수 (데모 관리자)', role: 'admin', createdAt: new Date('2024-03-01') },
  { uid: DEMO_UIDS.member, email: 'student1@example.ac.kr', displayName: '이학생 (데모 학생)', role: 'member', createdAt: new Date('2024-03-05') },
  { uid: DEMO_UIDS.pending, email: 'newbie@example.ac.kr', displayName: '박신입 (데모 대기)', role: 'pending', createdAt: new Date('2026-10-28') },
  { uid: 'seed-pending-2', email: 'applicant2@example.ac.kr', displayName: '최지원', role: 'pending', createdAt: new Date('2026-10-30') },
  { uid: 'seed-pending-3', email: 'applicant3@example.ac.kr', displayName: '정예린', role: 'pending', createdAt: new Date('2026-11-01') },
  { uid: 'seed-member-2', email: 'student2@example.ac.kr', displayName: '한도윤', role: 'member', createdAt: new Date('2024-09-01') },
];

export function loadUsers(): AppUser[] {
  const users = readJSON<AppUser[] | null>(KEY, null);
  if (users) return users;
  writeJSON(KEY, SEED_USERS);
  return SEED_USERS.map((u) => ({ ...u }));
}

function saveUsers(users: AppUser[]) {
  writeJSON(KEY, users);
}

/** 데모 계정이 (거절 등으로) 지워졌다면, 처음 가입한 것처럼 다시 만들어 줍니다. */
export function ensureSeedUser(uid: string): void {
  const users = loadUsers();
  if (users.some((u) => u.uid === uid)) return;
  const seed = SEED_USERS.find((u) => u.uid === uid);
  if (seed) saveUsers([...users, { ...seed, createdAt: new Date() }]);
}

export function findUser(uid: string): AppUser | null {
  return loadUsers().find((u) => u.uid === uid) ?? null;
}

export const mockUserService: UserService = {
  async listPendingUsers() {
    await delay();
    if (getCurrentUser()?.role !== 'admin') throw new PermissionError('관리자만 볼 수 있습니다.');
    return loadUsers()
      .filter((u) => u.role === 'pending')
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  },

  async setRole(uid, role) {
    await delay();
    if (getCurrentUser()?.role !== 'admin') throw new PermissionError('관리자만 변경할 수 있습니다.');
    const users = loadUsers();
    const target = users.find((u) => u.uid === uid);
    if (!target) throw new Error('사용자를 찾을 수 없습니다.');
    target.role = role;
    saveUsers(users);
    notifyAuthChanged();
  },

  async removeUser(uid) {
    await delay();
    if (getCurrentUser()?.role !== 'admin') throw new PermissionError('관리자만 거절할 수 있습니다.');
    if (uid === getCurrentUser()?.uid) throw new Error('본인 계정은 거절할 수 없습니다.');
    saveUsers(loadUsers().filter((u) => u.uid !== uid));
    notifyAuthChanged();
  },
};
