/**
 * 데이터 처리 계층의 "약속(인터페이스)"입니다.
 *
 * 화면(컴포넌트)은 오직 이 파일에 정의된 함수들만 사용합니다.
 * 데모 모드에서는 브라우저 저장소(localStorage)를 쓰는 mock 구현이,
 * 실제 배포에서는 Firebase 구현이 이 약속을 지킵니다.
 * → 구현을 바꿔도 화면 코드는 고칠 필요가 없습니다.
 */

export type Role = 'pending' | 'member' | 'admin';
export type Category = 'research' | 'course' | 'notice';

export interface AppUser {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: Role;
  createdAt: Date;
}

export interface Post {
  id: string;
  title: string;
  body: string;
  category: Category;
  authorUid: string;
  authorName: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Comment {
  id: string;
  postId: string;
  body: string;
  authorUid: string;
  authorName: string;
  createdAt: Date;
}

export interface DiscussionService {
  listPosts(opts: {
    category?: Category;
    pageSize: number;
    cursor?: string;
  }): Promise<{ posts: Post[]; nextCursor?: string }>;
  getPost(id: string): Promise<Post | null>;
  createPost(input: Pick<Post, 'title' | 'body' | 'category'>): Promise<string>;
  updatePost(id: string, input: Partial<Pick<Post, 'title' | 'body' | 'category'>>): Promise<void>;
  deletePost(id: string): Promise<void>;
  listComments(postId: string): Promise<Comment[]>;
  addComment(postId: string, body: string): Promise<void>;
  deleteComment(postId: string, commentId: string): Promise<void>;
}

export interface UserService {
  listPendingUsers(): Promise<AppUser[]>;
  setRole(uid: string, role: Role): Promise<void>;
  /**
   * (요구사항 외 추가) 가입 거절 — 사용자 정보를 지웁니다.
   * Firebase에서는 Firestore의 users/{uid} 문서를 삭제합니다.
   * 거절된 사람이 다시 로그인하면 다시 '승인 대기' 상태로 신청됩니다.
   */
  removeUser(uid: string): Promise<void>;
}

/**
 * 로그인 처리 약속입니다.
 * - 데모 모드: 역할을 골라 가짜 사용자로 로그인 (services/mock/mockAuth.ts)
 * - Firebase 모드: 구글 로그인 (services/firebase/auth.ts)
 */
export interface DemoAccount {
  role: Role;
  label: string;
  description: string;
}

export interface AuthService {
  /** true이면 화면에 "데모 모드" 배지를 표시하고, 로그인 시 역할 선택 메뉴를 보여 줍니다. */
  readonly isDemo: boolean;
  /** 데모 모드에서 고를 수 있는 계정 목록 (Firebase 구현에서는 빈 배열) */
  readonly demoAccounts: DemoAccount[];
  /**
   * 로그인 상태가 바뀔 때마다 callback을 호출합니다. 반환값은 구독 해제 함수입니다.
   * 로그인 과정에서 문제가 생기면 onError로 화면에 보여 줄 안내 문장을 전달합니다.
   * (문제가 해결되면 onError(null)로 안내를 지웁니다.)
   */
  onAuthStateChanged(callback: (user: AppUser | null) => void, onError?: (message: string | null) => void): () => void;
  /** 로그인. 데모 모드에서는 demoRole로 어떤 가짜 사용자로 로그인할지 고릅니다. */
  signIn(opts?: { demoRole?: Role }): Promise<void>;
  signOut(): Promise<void>;
}

/** 권한이 없을 때 서비스가 던지는 오류 */
export class PermissionError extends Error {
  constructor(message = '권한이 없습니다.') {
    super(message);
    this.name = 'PermissionError';
  }
}
