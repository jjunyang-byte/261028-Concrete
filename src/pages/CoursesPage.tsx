import { Link } from 'react-router';
import { BookOpen } from 'lucide-react';
import { courses } from '../data/courses';
import { usePageTitle } from '../hooks/usePageTitle';
import { PageHeader } from '../components/ui';

export function CoursesPage() {
  usePageTitle('수업 자료');
  return (
    <div>
      <PageHeader title="수업 자료" description="과목을 선택하면 주차별 강의 자료를 볼 수 있습니다." />
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {courses.map((c) => (
          <li key={c.id}>
            <Link
              to={`/courses/${c.id}`}
              className="block h-full rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-400 hover:shadow dark:border-slate-700 dark:bg-slate-800 dark:hover:border-blue-500"
            >
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <BookOpen className="h-4 w-4" /> {c.code} · {c.level} · {c.semester}
              </div>
              <h2 className="mt-2 text-lg font-semibold">{c.title}</h2>
              <p className="mt-2 line-clamp-3 text-sm text-slate-600 dark:text-slate-400">{c.overview}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
