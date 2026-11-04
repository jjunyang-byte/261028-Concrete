/**
 * 라우트(페이지) 보호 컴포넌트. 모든 권한 확인은 이 컴포넌트로 통일합니다.
 *
 *   <RequireRole roles={['member', 'admin']}> ...게시판... </RequireRole>
 *   <RequireRole roles={['admin']}> ...관리자 페이지... </RequireRole>
 *
 * - 비로그인 → "로그인이 필요합니다" 안내
 * - 승인 대기(pending) → "교수님 승인 대기 중입니다" 안내
 * - 역할이 부족함 → "접근 권한이 없습니다" 안내
 */
import type { ReactNode } from 'react';
import { Clock, Lock, ShieldAlert } from 'lucide-react';
import type { Role } from '../services';
import { useAuth } from './useAuth';
import { LoginButton } from '../components/LoginButton';
import { Spinner } from '../components/ui';

export function RequireRole({ roles, children }: { roles: Role[]; children: ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) return <Spinner />;

  if (!user) {
    return (
      <Notice icon={<Lock className="h-8 w-8" />} title="로그인이 필요합니다">
        <p>이 페이지는 연구실 구성원만 이용할 수 있습니다. 로그인해 주세요.</p>
        <div className="mt-4 flex justify-center">
          <LoginButton />
        </div>
      </Notice>
    );
  }

  if (roles.includes(user.role)) return <>{children}</>;

  if (user.role === 'pending') {
    return (
      <Notice icon={<Clock className="h-8 w-8" />} title="교수님 승인 대기 중입니다">
        <p>가입 신청이 접수되었습니다. 교수님이 승인하시면 게시판을 이용할 수 있습니다.</p>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">({user.email})</p>
      </Notice>
    );
  }

  return (
    <Notice icon={<ShieldAlert className="h-8 w-8" />} title="접근 권한이 없습니다">
      <p>이 페이지는 관리자만 이용할 수 있습니다.</p>
    </Notice>
  );
}

function Notice({ icon, title, children }: { icon: ReactNode; title: string; children: ReactNode }) {
  return (
    <div className="mx-auto max-w-lg rounded-xl border border-slate-200 bg-white p-8 text-center dark:border-slate-700 dark:bg-slate-800">
      <div className="mb-3 flex justify-center text-blue-700 dark:text-blue-400">{icon}</div>
      <h2 className="mb-2 text-xl font-bold">{title}</h2>
      <div className="text-slate-600 dark:text-slate-300">{children}</div>
    </div>
  );
}
