/**
 * 권한 규칙을 한 곳에 모아 둔 파일입니다.
 * 화면(버튼 표시 여부)과 mock 서비스(실제 저장 허용 여부)가 같은 규칙을 씁니다.
 * Phase 2에서는 같은 규칙을 Firestore 보안 규칙(firestore.rules)으로도 옮겨 적어야 합니다.
 */
import type { AppUser, Category, Comment, Post } from './types';

/** 게시판을 읽고 쓸 수 있는가? (승인된 학생 또는 관리자) */
export function canUseBoard(user: AppUser | null): boolean {
  return user?.role === 'member' || user?.role === 'admin';
}

export function isAdmin(user: AppUser | null): boolean {
  return user?.role === 'admin';
}

/** 해당 카테고리에 글을 쓸 수 있는가? (공지는 관리자만) */
export function canWriteCategory(user: AppUser | null, category: Category): boolean {
  if (!canUseBoard(user)) return false;
  return category === 'notice' ? isAdmin(user) : true;
}

/** 글/댓글 수정·삭제: 본인 또는 관리자 */
export function canModify(user: AppUser | null, item: Pick<Post | Comment, 'authorUid'>): boolean {
  if (!canUseBoard(user)) return false;
  return isAdmin(user) || user!.uid === item.authorUid;
}
