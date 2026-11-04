import { Link } from 'react-router';
import { ArrowRight, CalendarDays, Layers } from 'lucide-react';
import { courses } from '../data/courses';
import { usePageTitle } from '../hooks/usePageTitle';
import { Card, Page } from '../components/ui';

export function CoursesPage() {
  usePageTitle('수업 자료');
  return (
    <Page eyebrow="Courses" title="수업 자료" description="과목을 선택하면 강의 개요와 주차별 자료를 볼 수 있습니다.">
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {courses.map((c) => (
          <li key={c.id}>
            <Link to={`/courses/${c.id}`} className="group block h-full">
              <Card interactive className="flex h-full flex-col">
                <div className="flex items-center justify-between gap-2">
                  <span className="rounded-lg bg-brand-50 px-2.5 py-1 font-mono text-xs font-semibold text-brand-700 dark:bg-brand-950 dark:text-brand-300">
                    {c.code}
                  </span>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      c.level === '대학원'
                        ? 'bg-violet-50 text-violet-700 dark:bg-violet-950 dark:text-violet-300'
                        : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                    }`}
                  >
                    {c.level}
                  </span>
                </div>
                <h2 className="mt-4 text-xl font-bold tracking-tight">{c.title}</h2>
                <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{c.overview}</p>
                <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 text-sm text-slate-500 dark:border-slate-800">
                  <span className="flex items-center gap-3">
                    <span className="inline-flex items-center gap-1">
                      <CalendarDays className="h-4 w-4" /> {c.semester}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Layers className="h-4 w-4" /> {c.weeks.length}주
                    </span>
                  </span>
                  <ArrowRight className="h-4 w-4 text-brand-600 transition group-hover:translate-x-1 dark:text-brand-400" />
                </div>
              </Card>
            </Link>
          </li>
        ))}
      </ul>
    </Page>
  );
}
