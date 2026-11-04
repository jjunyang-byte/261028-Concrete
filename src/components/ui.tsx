/** 여러 페이지에서 함께 쓰는 작은 화면 조각들 */
import type { AnchorHTMLAttributes, ReactNode } from 'react';
import { ExternalLink as ExternalIcon } from 'lucide-react';
import type { Category } from '../services';

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
      className={`inline-flex items-center gap-1 text-blue-700 hover:underline dark:text-blue-400 ${className}`}
      {...rest}
    >
      {children}
      {showIcon && <ExternalIcon className="h-3.5 w-3.5" aria-hidden />}
    </a>
  );
}

export function PageHeader({ title, description }: { title: string; description?: string }) {
  return (
    <header className="mb-8">
      <h1 className="text-2xl font-bold sm:text-3xl">{title}</h1>
      {description && <p className="mt-2 text-slate-600 dark:text-slate-400">{description}</p>}
    </header>
  );
}

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800 ${className}`}>
      {children}
    </div>
  );
}

export function Spinner({ label = '불러오는 중…' }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-2 py-12 text-slate-500" role="status">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-blue-600" />
      {label}
    </div>
  );
}

export function ErrorMessage({ message }: { message: string }) {
  return (
    <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300" role="alert">
      {message}
    </p>
  );
}

export const categoryLabels: Record<Category, string> = {
  research: '연구토론',
  course: '수업질문',
  notice: '공지',
};

const categoryColors: Record<Category, string> = {
  research: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
  course: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300',
  notice: 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300',
};

export function CategoryBadge({ category }: { category: Category }) {
  return (
    <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${categoryColors[category]}`}>
      {categoryLabels[category]}
    </span>
  );
}

export const buttonClass = {
  primary:
    'inline-flex items-center justify-center gap-1.5 rounded-lg bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800 disabled:opacity-50 dark:bg-blue-600 dark:hover:bg-blue-500',
  secondary:
    'inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium hover:bg-slate-100 disabled:opacity-50 dark:border-slate-600 dark:bg-slate-800 dark:hover:bg-slate-700',
  danger:
    'inline-flex items-center justify-center gap-1.5 rounded-lg border border-red-300 px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-50 disabled:opacity-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950',
};

/** 날짜를 "2026. 11. 4. 14:30" 형식으로 */
export function formatDateTime(d: Date): string {
  return d.toLocaleString('ko-KR', { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false });
}
export function formatDate(d: Date): string {
  return d.toLocaleDateString('ko-KR', { year: 'numeric', month: 'numeric', day: 'numeric' });
}

/** 오류 객체에서 사용자에게 보여 줄 문장을 꺼냅니다. */
export function errorText(e: unknown): string {
  return e instanceof Error ? e.message : '알 수 없는 오류가 발생했습니다.';
}
