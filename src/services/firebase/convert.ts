/** Firestore 문서 ↔ 앱 데이터 형식 변환 */
import { Timestamp, type DocumentData, type DocumentSnapshot } from 'firebase/firestore';
import type { AppUser, Comment, Post } from '../types';

/** Firestore 시간 → Date. 서버 시간이 아직 확정되지 않았으면(방금 쓴 글) 현재 시각을 씁니다. */
export function toDate(v: unknown): Date {
  return v instanceof Timestamp ? v.toDate() : new Date();
}

export function toAppUser(snap: DocumentSnapshot<DocumentData>): AppUser {
  const d = snap.data()!;
  return {
    uid: snap.id,
    email: d.email ?? '',
    displayName: d.displayName ?? '',
    photoURL: d.photoURL ?? undefined,
    role: d.role,
    createdAt: toDate(d.createdAt),
  };
}

export function toPost(snap: DocumentSnapshot<DocumentData>): Post {
  const d = snap.data()!;
  return {
    id: snap.id,
    title: d.title,
    body: d.body,
    category: d.category,
    authorUid: d.authorUid,
    authorName: d.authorName,
    createdAt: toDate(d.createdAt),
    updatedAt: toDate(d.updatedAt),
  };
}

export function toComment(snap: DocumentSnapshot<DocumentData>): Comment {
  const d = snap.data()!;
  return {
    id: snap.id,
    postId: d.postId,
    body: d.body,
    authorUid: d.authorUid,
    authorName: d.authorName,
    createdAt: toDate(d.createdAt),
  };
}
