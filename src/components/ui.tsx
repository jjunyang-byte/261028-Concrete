/** 여러 페이지에서 함께 쓰는 화면 조각들 (디자인을 바꾸려면 주로 이 파일을 고칩니다) */
import type { AnchorHTMLAttributes, ReactNode } from 'react';
import { ArrowUpRight } from 'lucide-react';
import type { Category } from '../services';

/* ─────────────── 배치 ─────────────── */

/** 본문 가로 폭을 맞춰 주는 틀 */
export function Container({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 ${className}`}>{children}</div>;
}

/** 페이지 상단의 남색 배너 (도면 격자 무늬 배경) */
export function PageHero({
  eyebrow,
  title,
  description,
  children,
  compact = false,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  compact?: boolean;
}) {
  return (
    <section className="relative isolate overflow-hidden bg-brand-950 text-white">
      <div className="absolute inset-0 -z-10 bg-linear-to-br from-brand-950 via-brand-900/90 to-slate-950" aria-hidden />
      <div className="absolute inset-0 -z-10 bg-blueprint" aria-hidden />
      <div className="absolute -top-32 right-[-10%] -z-10 h-80 w-80 rounded-full bg-brand-500/25 blur-3xl" aria-hidden />
      <Container className={`animate-fade-up ${compact ? 'py-10 sm:py-12' : 'py-14 sm:py-20'}`}>
        {eyebrow && <p className="text-xs font-semibold tracking-[0.2em] text-amber-300 uppercase">{eyebrow}</p>}
        <h1 className={`mt-3 font-bold tracking-tight break-words ${compact ? 'text-2xl sm:text-3xl' : 'text-3xl sm:text-4xl'}`}>
          {title}
        </h1>
        {description && <div className="mt-3 max-w-2xl text-base leading-relaxed text-brand-100/80">{description}</div>}
        {children}
      </Container>
    </section>
  );
}

/** 상단 배너 + 본문을 한 번에: 대부분의 페이지가 이 틀을 씁니다. */
export function Page({
  children,
  narrow = false,
  ...hero
}: Parameters<typeof PageHero>[0] & { children: ReactNode; narrow?: boolean }) {
  return (
    <>
      <PageHero {...hero} />
      <Container className="py-10 sm:py-14">
        <div className={narrow ? 'mx-auto max-w-3xl' : ''}>{children}</div>
      </Container>
    </>
  );
}

/** 구역 제목: 작은 영문 라벨 + 큰 한글 제목 */
export function SectionHeading({
  eyebrow,
  title,
  action,
}: {
  eyebrow?: string;
  title: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        {eyebrow && (
          <p className="mb-1.5 flex items-center gap-2 text-xs font-semibold tracking-[0.2em] text-brand-600 uppercase dark:text-brand-300">
            <span className="h-px w-6 bg-brand-500" aria-hidden />
            {eyebrow}
          </p>
        )}
        <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
      </div>
      {action}
    </div>
  );
}

export function Card({
  children,
  className = '',
  interactive = false,
}: {
  children: ReactNode;
  className?: string;
  interactive?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm shadow-slate-900/[0.03] dark:border-slate-800 dark:bg-slate-900 ${
        interactive
          ? 'transition duration-200 hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-lg hover:shadow-brand-900/5 dark:hover:border-brand-700'
          : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}

/* ─────────────── 작은 요소 ─────────────── */

/** 외부 링크: 항상 새 탭 + 안전 옵션으로 엽니다. */
export function ExternalLink({
  href,
  children,
  className = '',
  showIcon = true,
  ...rest
}: AnchorHTMLAttributes<HTMLAnchorElement> & { showIcon?: boolean }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-0.5 font-medium text-brand-700 underline-offset-4 hover:underline dark:text-brand-300 ${className}`}
      {...rest}
    >
      {children}
      {showIcon && <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />}
    </a>
  );
}

/** 이름 첫 글자로 만든 동그란 프로필 */
const avatarColors = [
  'from-brand-500 to-brand-700',
  'from-sky-500 to-cyan-600',
  'from-emerald-500 to-teal-600',
  'from-amber-500 to-orange-600',
  'from-violet-500 to-purple-600',
  'from-rose-500 to-pink-600',
];
export function Avatar({ name, size = 'md' }: { name: string; size?: 'sm' | 'md' | 'lg' }) {
  const hash = [...name].reduce((a, c) => a + c.charCodeAt(0), 0);
  const sizes = { sm: 'h-8 w-8 text-xs', md: 'h-12 w-12 text-base', lg: 'h-16 w-16 text-xl' };
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full bg-linear-to-br font-semibold text-white shadow-sm ${avatarColors[hash % avatarColors.length]} ${sizes[size]}`}
      aria-hidden
    >
      {name.trim().charAt(0)}
    </span>
  );
}

export function Spinner({ label = '불러오는 중…' }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-3 py-16 text-sm text-slate-500" role="status">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-brand-600 dark:border-slate-700" />
      {label}
    </div>
  );
}

export function ErrorMessage({ message }: { message: string }) {
  return (
    <p
      className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/50 dark:text-red-300"
      role="alert"
    >
      {message}
    </p>
  );
}

export function EmptyState({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white/50 px-6 py-14 text-center text-slate-500 dark:border-slate-700 dark:bg-slate-900/50">
      {children}
    </div>
  );
}

/* ─────────────── 게시판 카테고리 ─────────────── */

export const categoryLabels: Record<Category, string> = {
  research: '연구토론',
  course: '수업질문',
  notice: '공지',
};

const categoryStyles: Record<Category, { badge: string; dot: string }> = {
  research: {
    badge: 'bg-brand-50 text-brand-700 ring-brand-600/15 dark:bg-brand-950 dark:text-brand-300 dark:ring-brand-400/20',
    dot: 'bg-brand-500',
  },
  course: {
    badge: 'bg-emerald-50 text-emerald-700 ring-emerald-600/15 dark:bg-emerald-950 dark:text-emerald-300 dark:ring-emerald-400/20',
    dot: 'bg-emerald-500',
  },
  notice: {
    badge: 'bg-amber-50 text-amber-800 ring-amber-600/20 dark:bg-amber-950 dark:text-amber-300 dark:ring-amber-400/20',
    dot: 'bg-amber-500',
  },
};

export function CategoryBadge({ category }: { category: Category }) {
  const s = categoryStyles[category];
  return (
    <span className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${s.badge}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} aria-hidden />
      {categoryLabels[category]}
    </span>
  );
}

/* ─────────────── 버튼 모양 ─────────────── */

const btn =
  'inline-flex items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 disabled:pointer-events-none disabled:opacity-50';

export const buttonClass = {
  primary: `${btn} bg-brand-600 text-white shadow-sm shadow-brand-900/20 hover:bg-brand-700 dark:bg-brand-500 dark:hover:bg-brand-400`,
  secondary: `${btn} border border-slate-200 bg-white text-slate-700 shadow-sm hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800`,
  danger: `${btn} border border-red-200 bg-white text-red-600 hover:bg-red-50 dark:border-red-900 dark:bg-transparent dark:text-red-400 dark:hover:bg-red-950/50`,
  /** 남색 배너 위에 올리는 밝은 버튼 */
  light: `${btn} bg-white text-brand-900 shadow-sm hover:bg-brand-50`,
  /** 남색 배너 위에 올리는 투명 버튼 */
  ghostLight: `${btn} text-white ring-1 ring-white/25 ring-inset hover:bg-white/10`,
};

export const inputClass =
  'w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-[15px] shadow-sm transition placeholder:text-slate-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:focus:ring-brand-400/20';

/* ─────────────── 도우미 함수 ─────────────── */

/** 날짜를 "2026. 11. 4. 14:30" 형식으로 */
export function formatDateTime(d: Date): string {
  return d.toLocaleString('ko-KR', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}
export function formatDate(d: Date): string {
  return d.toLocaleDateString('ko-KR', { year: 'numeric', month: 'numeric', day: 'numeric' });
}

/** 오류 객체에서 사용자에게 보여 줄 문장을 꺼냅니다. */
export function errorText(e: unknown): string {
  return e instanceof Error ? e.message : '알 수 없는 오류가 발생했습니다.';
}
