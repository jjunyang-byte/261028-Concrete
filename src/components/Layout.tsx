/** 모든 페이지의 공통 틀: 상단 내비게이션 + 본문 + 하단 푸터 */
import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router';
import { Building2, Mail, MapPin, Menu, Moon, Sun, X } from 'lucide-react';
import { site } from '../data/site';
import { useAuth } from '../auth/useAuth';
import { useTheme } from '../theme/useTheme';
import { UserMenu } from './UserMenu';
import { Container } from './ui';
import { resetDemoData } from '../services';

const navItems = [
  { to: '/', label: '홈', end: true },
  { to: '/research', label: '연구' },
  { to: '/courses', label: '수업 자료' },
  { to: '/members', label: '구성원' },
  { to: '/discussion', label: '토론 게시판' },
];

function desktopNavClass({ isActive }: { isActive: boolean }) {
  return `relative rounded-lg px-3 py-2 text-[15px] font-medium transition-colors after:absolute after:inset-x-3 after:-bottom-[13px] after:h-0.5 after:rounded-full after:transition ${
    isActive
      ? 'text-brand-700 after:bg-brand-600 dark:text-brand-300 dark:after:bg-brand-400'
      : 'text-slate-600 after:bg-transparent hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
  }`;
}

function mobileNavClass({ isActive }: { isActive: boolean }) {
  return `rounded-xl px-4 py-3 text-base font-medium ${
    isActive
      ? 'bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300'
      : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
  }`;
}

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-brand-500 to-brand-800 text-white shadow-md shadow-brand-900/20">
        <Building2 className="h-5 w-5" />
      </span>
      <span className="flex flex-col leading-tight">
        <span className={`text-[15px] font-bold tracking-tight ${light ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
          {site.labName}
        </span>
        <span className={`hidden text-[11px] sm:block ${light ? 'text-slate-400' : 'text-slate-500 dark:text-slate-400'}`}>
          {site.labNameEn}
        </span>
      </span>
    </span>
  );
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
      className="rounded-xl p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
      aria-label={theme === 'dark' ? '밝은 화면으로 전환' : '어두운 화면으로 전환'}
      title={theme === 'dark' ? '밝은 화면' : '어두운 화면'}
    >
      {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </button>
  );

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl dark:border-slate-800/70 dark:bg-slate-950/80">
        <Container className="flex h-16 items-center justify-between gap-4">
          <Link to="/" className="shrink-0" aria-label={`${site.labName} 홈`}>
            <Logo />
          </Link>

          {/* 넓은 화면용 메뉴 */}
          <nav className="hidden items-center gap-0.5 lg:flex" aria-label="주 메뉴">
            {items.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.end} className={desktopNavClass}>
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
              className="rounded-xl p-2 text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
              aria-label={menuOpen ? '메뉴 닫기' : '메뉴 열기'}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </Container>

        {menuOpen && (
          <div className="animate-fade-up border-t border-slate-200 bg-white lg:hidden dark:border-slate-800 dark:bg-slate-950">
            <Container className="pb-5">
              <nav className="flex flex-col gap-1 py-3" aria-label="모바일 메뉴">
                {items.map((item) => (
                  <NavLink key={item.to} to={item.to} end={item.end} className={mobileNavClass}>
                    {item.label}
                  </NavLink>
                ))}
              </nav>
              <div className="border-t border-slate-200 pt-4 dark:border-slate-800">
                <UserMenu onAction={() => setMenuOpen(false)} />
              </div>
            </Container>
          </div>
        )}
      </header>

      <main className="relative z-10 flex-1">
        <Outlet />
      </main>

      <footer className="relative overflow-hidden bg-slate-950 text-slate-400">
        <div className="absolute inset-0 bg-blueprint opacity-60" aria-hidden />
        <Container className="relative grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1.2fr]">
          <div>
            <Logo light />
            <p className="mt-4 text-sm leading-relaxed">{site.affiliation}</p>
          </div>
          <div>
            <h2 className="mb-4 text-xs font-semibold tracking-[0.2em] text-slate-200 uppercase">바로가기</h2>
            <ul className="grid grid-cols-2 gap-2 text-sm">
              {navItems.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className="transition hover:text-white">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="mb-4 text-xs font-semibold tracking-[0.2em] text-slate-200 uppercase">연락처</h2>
            <p className="flex gap-2 text-sm leading-relaxed">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" aria-hidden />
              {site.address}
            </p>
            <p className="mt-2 flex gap-2 text-sm">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" aria-hidden />
              <a href={`mailto:${site.email}`} className="break-all transition hover:text-white">
                {site.email}
              </a>
            </p>
          </div>
        </Container>
        <div className="relative border-t border-white/10">
          <Container className="flex flex-col gap-2 py-5 text-xs sm:flex-row sm:items-center sm:justify-between">
            <p>
              © {new Date().getFullYear()} {site.labName}. All rights reserved.
            </p>
            {isDemo && resetDemoData && (
              <button
                onClick={() => {
                  if (confirm('데모 게시판·사용자 데이터를 처음 상태로 되돌릴까요?')) resetDemoData?.();
                }}
                className="self-start text-slate-500 underline-offset-4 transition hover:text-slate-300 hover:underline sm:self-auto"
              >
                데모 데이터 초기화
              </button>
            )}
          </Container>
        </div>
      </footer>
    </div>
  );
}
