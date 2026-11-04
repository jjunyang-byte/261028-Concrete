/**
 * ★ 어떤 데이터 구현을 쓸지 "이 파일 한 곳에서만" 결정합니다. ★
 *
 * Phase 1 (지금): 브라우저 저장소(localStorage)를 쓰는 데모(mock) 구현
 * Phase 2 (다음): Firebase 구현을 src/services/firebase/ 에 만든 뒤,
 *                 아래 import 세 줄만 firebase 쪽으로 바꾸면 됩니다.
 *
 *   예) import { firebaseAuthService as authImpl } from './firebase/auth';
 *
 * 화면 컴포넌트는 반드시 이 파일에서만 서비스를 가져다 씁니다.
 *   import { discussionService } from '../services';
 */
import type { AuthService, DiscussionService, UserService } from './types';
import { mockAuthService as authImpl } from './mock/mockAuth';
import { mockDiscussionService as discussionImpl } from './mock/mockDiscussion';
import { mockUserService as userImpl } from './mock/mockUsers';
import { clearAll } from './mock/storage';

export const authService: AuthService = authImpl;
export const discussionService: DiscussionService = discussionImpl;
export const userService: UserService = userImpl;

/** 데모 데이터 초기화 (데모 모드에서만 의미 있음). Phase 2에서는 undefined로 바꾸세요. */
export const resetDemoData: (() => void) | undefined = () => {
  clearAll();
  window.location.reload();
};

export * from './types';
export * from './permissions';
