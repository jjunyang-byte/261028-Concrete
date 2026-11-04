/**
 * ★ 어떤 데이터 구현을 쓸지 "이 파일 한 곳에서만" 결정합니다. ★
 *
 * - Firebase 환경변수(VITE_FIREBASE_...)가 있으면 → Firebase 구현 (실제 구글 로그인 + Firestore)
 * - 없으면 → 데모(mock) 구현 (브라우저 저장소, 역할 골라 로그인)
 *
 * 배포(npm run build)할 때는 .env.production 의 값이 쓰여 Firebase 모드가 되고,
 * 내 컴퓨터에서 npm run dev 로 실행하면 데모 모드가 됩니다.
 * (내 컴퓨터에서도 Firebase로 시험하려면 .env.example 을 .env.local 로 복사해 값을 넣으세요.)
 *
 * 화면 컴포넌트는 반드시 이 파일에서만 서비스를 가져다 씁니다.
 *   import { discussionService } from '../services';
 */
import type { AuthService, DiscussionService, UserService } from './types';
import { mockAuthService } from './mock/mockAuth';
import { mockDiscussionService } from './mock/mockDiscussion';
import { mockUserService } from './mock/mockUsers';
import { clearAll } from './mock/storage';
import { isFirebaseConfigured } from './firebase/app';
import { firebaseAuthService } from './firebase/auth';
import { firebaseDiscussionService } from './firebase/discussion';
import { firebaseUserService } from './firebase/users';

const useFirebase = isFirebaseConfigured;

export const authService: AuthService = useFirebase ? firebaseAuthService : mockAuthService;
export const discussionService: DiscussionService = useFirebase ? firebaseDiscussionService : mockDiscussionService;
export const userService: UserService = useFirebase ? firebaseUserService : mockUserService;

/** 데모 데이터 초기화 (데모 모드에서만 존재) */
export const resetDemoData: (() => void) | undefined = useFirebase
  ? undefined
  : () => {
      clearAll();
      window.location.reload();
    };

export * from './types';
export * from './permissions';
