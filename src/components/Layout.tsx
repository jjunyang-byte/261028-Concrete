/** 모든 페이지의 공통 틀: 상단 내비게이션 + 본문 + 하단 푸터 */
import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router';
import { Building2, Menu, Moon, Sun, X } from 'lucide-react';
import { site } from '../data/site';
import { useAuth } from '../auth/useAuth';
import { useTheme } from '../theme/useTheme';
import { UserMenu } from './UserMenu';
import { resetDemoData } from '../services';

const navItems = [
  { to: '/', label: '홈', end: true },
  { to: '/research', label: '연구' },
  { to: '/courses', label: '수업 자료' },
  { to: '/members', label: '구성원' },
  { to: '/discussion', label: '토론 게시판' },
];

function navClass({ isActive }: { isActive: boolean }) {
  return `rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
    isActive
      ? 'bg-blue-50 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300'
      : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
  }`;
}

export function Layout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, isDemo } = useAuth();
  const { theme, toggle } = useTheme();
  const location = useLocation();

  // 페이지가 바뀌면 모바일 메뉴를 닫고 맨 위로 스크롤
  useEffect(() => {
    setMenuOpen(false);
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const items = user?.role === 'admin' ? [...navItems, { to: '/admin', label: '관리자' }] : navItems;

  const themeButton = (
    <button
      onClick={toggle}
      className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
      aria-label={theme === 'dark' ? '밝은 화면으로 전환' : '어두운 화면으로 전환'}
      title={theme === 'dark' ? '밝은 화면' : '어두운 화면'}
    >
      {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </button>
  );

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-900/90">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <Link to="/" className="flex shrink-0 items-center gap-2 font-bold text-blue-800 dark:text-blue-300">
            <Building2 className="h-6 w-6" />
            <span>{site.labName}</span>
          </Link>

          {/* 넓은 화면용 메뉴 */}
          <nav className="hidden items-center gap-1 lg:flex" aria-label="주 메뉴">
            {items.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.end} className={navClass}>
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="hidden items-center gap-2 lg:flex">
            {themeButton}
            <UserMenu />
          </div>

          {/* 모바일: 햄버거 버튼 */}
          <div className="flex items-center gap-1 lg:hidden">
            {themeButton}
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label={menuOpen ? '메뉴 닫기' : '메뉴 열기'}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="border-t border-slate-200 px-4 pb-4 lg:hidden dark:border-slate-800">
            <nav className="flex flex-col gap-1 py-2" aria-label="모바일 메뉴">
              {items.map((item) => (
                <NavLink key={item.to} to={item.to} end={item.end} className={navClass}>
                  {item.label}
                </NavLink>
              ))}
            </nav>
            <div className="border-t border-slate-200 pt-3 dark:border-slate-800">
              <UserMenu onAction={() => setMenuOpen(false)} />
            </div>
          </div>
        )}
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:py-12">
        <Outlet />
      </main>

      <footer className="border-t border-slate-200 bg-white py-8 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-1">
            <p className="font-semibold text-slate-800 dark:text-slate-200">
              {site.labName} <span className="font-normal text-slate-500">{site.labNameEn}</span>
            </p>
            <p>{site.affiliation}</p>
            <p>{site.address}</p>
            <p>
              연락처:{' '}
              <a href={`mailto:${site.email}`} className="text-blue-700 hover:underline dark:text-blue-400">
                {site.email}
              </a>
            </p>
          </div>
          <div className="flex flex-col items-start gap-1 sm:items-end">
            {isDemo && resetDemoData && (
              <button
                onClick={() => {
                  if (confirm('데모 게시판·사용자 데이터를 처음 상태로 되돌릴까요?')) resetDemoData?.();
                }}
                className="text-xs text-slate-500 underline hover:text-slate-700 dark:hover:text-slate-300"
              >
                데모 데이터 초기화
              </button>
            )}
            <p className="text-xs">© {new Date().getFullYear()} {site.labName}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
