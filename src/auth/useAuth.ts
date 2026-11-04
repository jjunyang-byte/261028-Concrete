import { useContext } from 'react';
import { AuthContext, type AuthContextValue } from './AuthContext';

/** 현재 로그인 정보를 가져오는 훅: const { user, loading, signIn, signOut } = useAuth(); */
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth()는 <AuthProvider> 안에서만 사용할 수 있습니다.');
  return ctx;
}
