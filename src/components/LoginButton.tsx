/**
 * 로그인 버튼.
 * - 데모 모드: 누르면 역할(관리자/학생/대기)을 고르는 작은 메뉴가 뜹니다.
 * - Firebase 모드(Phase 2): 누르면 바로 구글 로그인 창이 뜹니다.
 */
import { useEffect, useRef, useState } from 'react';
import { ChevronDown, LogIn } from 'lucide-react';
import { useAuth } from '../auth/useAuth';
import { authService } from '../services';
import { buttonClass } from './ui';

export function LoginButton({ onDone }: { onDone?: () => void }) {
  const { signIn } = useAuth();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', close);
    document.addEventListener('keydown', esc);
    return () => {
      document.removeEventListener('mousedown', close);
      document.removeEventListener('keydown', esc);
    };
  }, [open]);

  const doSignIn = async (role?: Parameters<typeof signIn>[0]) => {
    setBusy(true);
    try {
      await signIn(role);
      setOpen(false);
      onDone?.();
    } finally {
      setBusy(false);
    }
  };

  if (!authService.isDemo) {
    return (
      <button className={buttonClass.primary} onClick={() => doSignIn()} disabled={busy}>
        <LogIn className="h-4 w-4" /> 구글 로그인
      </button>
    );
  }

  return (
    <div className="relative inline-block text-left" ref={ref}>
      <button
        className={buttonClass.primary}
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        disabled={busy}
      >
        <LogIn className="h-4 w-4" /> 데모 로그인 <ChevronDown className="h-4 w-4" />
      </button>
      {open && (
        <div
          role="menu"
          className="animate-fade-up absolute left-0 z-50 mt-2 w-72 overflow-hidden rounded-2xl border border-slate-200 bg-white p-1.5 text-left shadow-xl shadow-slate-900/10 lg:right-0 lg:left-auto dark:border-slate-700 dark:bg-slate-900"
        >
          <p className="px-3 pt-2 pb-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
            어떤 역할로 둘러볼까요?
          </p>
          {authService.demoAccounts.map((a) => (
            <button
              key={a.role}
              role="menuitem"
              onClick={() => doSignIn(a.role)}
              className="block w-full rounded-xl px-3 py-2.5 text-left transition hover:bg-brand-50 dark:hover:bg-slate-800"
            >
              <span className="block text-sm font-semibold">{a.label}</span>
              <span className="block text-xs text-slate-500 dark:text-slate-400">{a.description}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
