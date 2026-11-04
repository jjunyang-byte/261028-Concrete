/** [Firebase] UserService 구현 — 가입 승인/거절 (관리자 전용, 보안 규칙으로도 막혀 있음) */
import { collection, deleteDoc, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import type { UserService } from '../types';
import { fb, wrap } from './app';
import { toAppUser } from './convert';

export const firebaseUserService: UserService = {
  async listPendingUsers() {
    const { db } = fb();
    const snap = await wrap(getDocs(query(collection(db, 'users'), where('role', '==', 'pending'))));
    return snap.docs.map(toAppUser).sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  },

  async setRole(uid, role) {
    await wrap(updateDoc(doc(fb().db, 'users', uid), { role }));
  },

  async removeUser(uid) {
    await wrap(deleteDoc(doc(fb().db, 'users', uid)));
  },
};
