/**
 * 로그인 상태를 앱 전체에 공유하는 Context입니다.
 * 화면에서는 useAuth() 훅으로 { user, loading, signIn, signOut } 을 꺼내 씁니다.
 * 실제 로그인 처리는 services의 authService가 담당하므로,
 * 데모/Firebase 어느 쪽이든 이 파일은 그대로 씁니다.
 */
import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { authService, type AppUser, type Role } from '../services';

export interface AuthContextValue {
  user: AppUser | null;
  loading: boolean;
  /** 데모 모드에서는 demoRole로 역할을 고릅니다. Firebase 모드에서는 인자 없이 호출합니다. */
  signIn: (demoRole?: Role) => Promise<void>;
  signOut: () => Promise<void>;
  isDemo: boolean;
  /** 로그인 과정의 문제 안내 (없으면 null) */
  authError: string | null;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    return authService.onAuthStateChanged(
      (u) => {
        setUser(u);
        setLoading(false);
      },
      (message) => {
        setAuthError(message);
        setLoading(false);
      },
    );
  }, []);

  const signIn = useCallback((demoRole?: Role) => authService.signIn({ demoRole }), []);
  const signOut = useCallback(async () => {
    setAuthError(null);
    await authService.signOut();
  }, []);

  const value = useMemo(
    () => ({ user, loading, signIn, signOut, isDemo: authService.isDemo, authError }),
    [user, loading, signIn, signOut, authError],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
