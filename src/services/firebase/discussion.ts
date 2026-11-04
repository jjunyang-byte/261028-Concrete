/**
 * [Firebase] DiscussionService 구현 — Cloud Firestore 사용.
 *
 * 저장 구조
 *   posts/{postId}                     게시글
 *   posts/{postId}/comments/{commentId} 댓글
 *
 * 권한 확인은 firestore.rules(보안 규칙)가 서버에서 합니다.
 * 여기서의 확인은 친절한 안내 문구를 위한 것입니다.
 */
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  startAfter,
  updateDoc,
  where,
  writeBatch,
  type QueryConstraint,
} from 'firebase/firestore';
import { PermissionError, type DiscussionService } from '../types';
import { canUseBoard } from '../permissions';
import { fb, wrap } from './app';
import { getCurrentAppUser } from './auth';
import { toComment, toPost } from './convert';

function requireBoardUser() {
  const user = getCurrentAppUser();
  if (!canUseBoard(user)) throw new PermissionError('승인된 구성원만 이용할 수 있습니다.');
  return user!;
}

function checkText(value: string | undefined, field: string, max: number) {
  if (value === undefined) return;
  const v = value.trim();
  if (!v) throw new Error(`${field}을(를) 입력해 주세요.`);
  if (value.length > max) throw new Error(`${field}은(는) ${max}자 이하로 입력해 주세요.`);
}

const postsCol = () => collection(fb().db, 'posts');
const commentsCol = (postId: string) => collection(fb().db, 'posts', postId, 'comments');

export const firebaseDiscussionService: DiscussionService = {
  async listPosts({ category, pageSize, cursor }) {
    const constraints: QueryConstraint[] = [];
    if (category) constraints.push(where('category', '==', category));
    constraints.push(orderBy('createdAt', 'desc'));
    if (cursor) {
      const cursorSnap = await wrap(getDoc(doc(postsCol(), cursor)));
      if (cursorSnap.exists()) constraints.push(startAfter(cursorSnap));
    }
    // 한 개 더 가져와서 "더 보기"가 필요한지 판단합니다.
    constraints.push(limit(pageSize + 1));
    const snap = await wrap(getDocs(query(postsCol(), ...constraints)));
    const posts = snap.docs.slice(0, pageSize).map(toPost);
    const hasMore = snap.docs.length > pageSize;
    return { posts, nextCursor: hasMore ? posts[posts.length - 1]?.id : undefined };
  },

  async getPost(id) {
    const snap = await wrap(getDoc(doc(postsCol(), id)));
    return snap.exists() ? toPost(snap) : null;
  },

  async createPost(input) {
    const user = requireBoardUser();
    if (input.category === 'notice' && user.role !== 'admin')
      throw new PermissionError('공지는 관리자만 작성할 수 있습니다.');
    checkText(input.title, '제목', 200);
    checkText(input.body, '본문', 20000);
    const ref = await wrap(
      addDoc(postsCol(), {
        title: input.title.trim(),
        body: input.body,
        category: input.category,
        authorUid: user.uid,
        authorName: user.displayName,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      }),
    );
    return ref.id;
  },

  async updatePost(id, input) {
    requireBoardUser();
    checkText(input.title, '제목', 200);
    checkText(input.body, '본문', 20000);
    const data: Record<string, unknown> = { updatedAt: serverTimestamp() };
    if (input.title !== undefined) data.title = input.title.trim();
    if (input.body !== undefined) data.body = input.body;
    if (input.category !== undefined) data.category = input.category;
    await wrap(updateDoc(doc(postsCol(), id), data));
  },

  async deletePost(id) {
    requireBoardUser();
    // Cloud Functions 없이 지우므로, 댓글을 먼저 지운 뒤 글을 지웁니다.
    const comments = await wrap(getDocs(commentsCol(id)));
    const { db } = fb();
    for (let i = 0; i < comments.docs.length; i += 400) {
      const batch = writeBatch(db);
      comments.docs.slice(i, i + 400).forEach((c) => batch.delete(c.ref));
      await wrap(batch.commit());
    }
    await wrap(deleteDoc(doc(postsCol(), id)));
  },

  async listComments(postId) {
    const snap = await wrap(getDocs(query(commentsCol(postId), orderBy('createdAt', 'asc'))));
    return snap.docs.map(toComment);
  },

  async addComment(postId, body) {
    const user = requireBoardUser();
    checkText(body, '댓글', 5000);
    await wrap(
      addDoc(commentsCol(postId), {
        postId,
        body,
        authorUid: user.uid,
        authorName: user.displayName,
        createdAt: serverTimestamp(),
      }),
    );
  },

  async deleteComment(postId, commentId) {
    requireBoardUser();
    await wrap(deleteDoc(doc(commentsCol(postId), commentId)));
  },
};
