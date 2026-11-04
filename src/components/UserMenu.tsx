/** 상단 우측: 로그인 전에는 로그인 버튼, 로그인 후에는 사용자 이름 + 로그아웃 */
import { LogOut } from 'lucide-react';
import { useAuth } from '../auth/useAuth';
import { LoginButton } from './LoginButton';
import { Avatar } from './ui';

const roleLabels = { admin: '관리자', member: '구성원', pending: '승인 대기' } as const;

export function UserMenu({ onAction }: { onAction?: () => void }) {
  const { user, loading, signOut, isDemo } = useAuth();

  return (
    <div className="flex flex-wrap items-center gap-2">
      {isDemo && (
        <span
          className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800 ring-1 ring-amber-600/20 ring-inset dark:bg-amber-950 dark:text-amber-300 dark:ring-amber-400/20"
          title="실제 로그인이 아닌 체험용 모드입니다. 데이터는 이 브라우저에만 저장됩니다."
        >
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-500" aria-hidden />
          데모 모드
        </span>
      )}
      {loading ? null : user ? (
        <>
          <span className="flex items-center gap-2 rounded-full py-1 pr-3 pl-1 text-sm ring-1 ring-slate-200 dark:ring-slate-800">
            <Avatar name={user.displayName} size="sm" />
            <span className="flex flex-col leading-tight">
              <span className="max-w-[10rem] truncate font-medium">{user.displayName}</span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">{roleLabels[user.role]}</span>
            </span>
          </span>
          <button
            onClick={() => {
              void signOut();
              onAction?.();
            }}
            className="inline-flex items-center gap-1 rounded-xl px-2.5 py-2 text-sm font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
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
