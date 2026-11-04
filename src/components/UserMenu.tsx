/** 상단 우측: 로그인 전에는 로그인 버튼, 로그인 후에는 사용자 이름 + 로그아웃 */
import { LogOut } from 'lucide-react';
import { useAuth } from '../auth/useAuth';
import { LoginButton } from './LoginButton';

const roleLabels = { admin: '관리자', member: '구성원', pending: '승인 대기' } as const;

export function UserMenu({ onAction }: { onAction?: () => void }) {
  const { user, loading, signOut, isDemo } = useAuth();

  return (
    <div className="flex flex-wrap items-center gap-2">
      {isDemo && (
        <span
          className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-800 dark:bg-amber-900/60 dark:text-amber-300"
          title="실제 로그인이 아닌 체험용 모드입니다. 데이터는 이 브라우저에만 저장됩니다."
        >
          데모 모드
        </span>
      )}
      {loading ? null : user ? (
        <>
          <span className="text-sm">
            <span className="font-medium">{user.displayName}</span>
            <span className="ml-1 text-xs text-slate-500 dark:text-slate-400">({roleLabels[user.role]})</span>
          </span>
          <button
            onClick={() => {
              void signOut();
              onAction?.();
            }}
            className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-sm text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            <LogOut className="h-4 w-4" /> 로그아웃
          </button>
        </>
      ) : (
        <LoginButton onDone={onAction} />
      )}
    </div>
  );
}
