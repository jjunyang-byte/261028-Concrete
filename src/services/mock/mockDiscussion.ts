/**
 * [mock] DiscussionService 구현 — 게시글과 댓글을 브라우저 저장소에 저장합니다.
 * 권한 확인도 여기서 합니다. (Phase 2에서는 Firestore 보안 규칙이 이 역할을 합니다.)
 */
import { PermissionError, type Comment, type DiscussionService, type Post } from '../types';
import { canModify, canUseBoard, canWriteCategory } from '../permissions';
import { delay, newId, readJSON, writeJSON } from './storage';
import { getCurrentUser } from './mockAuth';
import { buildSeed } from './seedPosts';

const POSTS = 'posts';
const COMMENTS = 'comments';

function ensureSeeded() {
  if (readJSON<Post[] | null>(POSTS, null) === null) {
    const { posts, comments } = buildSeed();
    writeJSON(POSTS, posts);
    writeJSON(COMMENTS, comments);
  }
}

function loadPosts(): Post[] {
  ensureSeeded();
  return readJSON<Post[]>(POSTS, []);
}
function loadComments(): Comment[] {
  ensureSeeded();
  return readJSON<Comment[]>(COMMENTS, []);
}

function requireBoardUser() {
  const user = getCurrentUser();
  if (!canUseBoard(user)) throw new PermissionError('승인된 구성원만 이용할 수 있습니다.');
  return user!;
}

function validateText(value: string | undefined, field: string, max: number) {
  if (value === undefined) return;
  const v = value.trim();
  if (!v) throw new Error(`${field}을(를) 입력해 주세요.`);
  if (v.length > max) throw new Error(`${field}은(는) ${max}자 이하로 입력해 주세요.`);
}

export const mockDiscussionService: DiscussionService = {
  async listPosts({ category, pageSize, cursor }) {
    await delay();
    requireBoardUser();
    const all = loadPosts()
      .filter((p) => !category || p.category === category)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    // cursor = 이전 페이지 마지막 글의 id
    const start = cursor ? all.findIndex((p) => p.id === cursor) + 1 : 0;
    const posts = all.slice(start, start + pageSize);
    const hasMore = start + pageSize < all.length;
    return { posts, nextCursor: hasMore ? posts[posts.length - 1]?.id : undefined };
  },

  async getPost(id) {
    await delay();
    requireBoardUser();
    return loadPosts().find((p) => p.id === id) ?? null;
  },

  async createPost(input) {
    await delay();
    const user = requireBoardUser();
    if (!canWriteCategory(user, input.category)) throw new PermissionError('공지는 관리자만 작성할 수 있습니다.');
    validateText(input.title, '제목', 200);
    validateText(input.body, '본문', 20000);
    const now = new Date();
    const post: Post = {
      id: newId(),
      title: input.title.trim(),
      body: input.body,
      category: input.category,
      authorUid: user.uid,
      authorName: user.displayName,
      createdAt: now,
      updatedAt: now,
    };
    writeJSON(POSTS, [post, ...loadPosts()]);
    return post.id;
  },

  async updatePost(id, input) {
    await delay();
    const user = requireBoardUser();
    const posts = loadPosts();
    const post = posts.find((p) => p.id === id);
    if (!post) throw new Error('글을 찾을 수 없습니다.');
    if (!canModify(user, post)) throw new PermissionError('본인 글만 수정할 수 있습니다.');
    if (input.category && !canWriteCategory(user, input.category))
      throw new PermissionError('공지는 관리자만 작성할 수 있습니다.');
    validateText(input.title, '제목', 200);
    validateText(input.body, '본문', 20000);
    Object.assign(post, input, { updatedAt: new Date() });
    if (input.title) post.title = input.title.trim();
    writeJSON(POSTS, posts);
  },

  async deletePost(id) {
    await delay();
    const user = requireBoardUser();
    const posts = loadPosts();
    const post = posts.find((p) => p.id === id);
    if (!post) return;
    if (!canModify(user, post)) throw new PermissionError('본인 글만 삭제할 수 있습니다.');
    writeJSON(POSTS, posts.filter((p) => p.id !== id));
    writeJSON(COMMENTS, loadComments().filter((c) => c.postId !== id));
  },

  async listComments(postId) {
    await delay();
    requireBoardUser();
    return loadComments()
      .filter((c) => c.postId === postId)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  },

  async addComment(postId, body) {
    await delay();
    const user = requireBoardUser();
    validateText(body, '댓글', 5000);
    if (!loadPosts().some((p) => p.id === postId)) throw new Error('글을 찾을 수 없습니다.');
    const comment: Comment = {
      id: newId(),
      postId,
      body,
      authorUid: user.uid,
      authorName: user.displayName,
      createdAt: new Date(),
    };
    writeJSON(COMMENTS, [...loadComments(), comment]);
  },

  async deleteComment(postId, commentId) {
    await delay();
    const user = requireBoardUser();
    const comments = loadComments();
    const c = comments.find((x) => x.id === commentId && x.postId === postId);
    if (!c) return;
    if (!canModify(user, c)) throw new PermissionError('본인 댓글만 삭제할 수 있습니다.');
    writeJSON(COMMENTS, comments.filter((x) => x.id !== commentId));
  },
};
