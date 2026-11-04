import { Link, useParams } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { courses } from '../data/courses';
import { usePageTitle } from '../hooks/usePageTitle';
import { Card, ExternalLink } from '../components/ui';
import { NotFoundPage } from './NotFoundPage';

export function CourseDetailPage() {
  const { courseId } = useParams();
  const course = courses.find((c) => c.id === courseId);
  usePageTitle(course?.title ?? '과목을 찾을 수 없음');

  if (!course) return <NotFoundPage />;

  return (
    <div className="space-y-8">
      <Link to="/courses" className="inline-flex items-center gap-1 text-sm text-blue-700 hover:underline dark:text-blue-400">
        <ArrowLeft className="h-4 w-4" /> 과목 목록
      </Link>

      <header>
        <p className="text-sm text-slate-500">
          {course.code} · {course.level}
        </p>
        <h1 className="mt-1 text-2xl font-bold sm:text-3xl">{course.title}</h1>
        <p className="mt-1 font-medium text-blue-700 dark:text-blue-400">{course.semester}</p>
      </header>

      <Card>
        <h2 className="mb-2 font-semibold">강의 개요</h2>
        <p className="leading-relaxed text-slate-700 dark:text-slate-300">{course.overview}</p>
      </Card>

      <section>
        <h2 className="mb-3 text-xl font-bold">주차별 자료</h2>
        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
          <table className="w-full min-w-[480px] text-left text-sm">
            <thead className="bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              <tr>
                <th scope="col" className="w-20 px-4 py-3">주차</th>
                <th scope="col" className="px-4 py-3">주제</th>
                <th scope="col" className="px-4 py-3">자료</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white dark:divide-slate-700 dark:bg-slate-900">
              {course.weeks.map((w) => (
                <tr key={w.week}>
                  <td className="px-4 py-3 font-medium">{w.week}주</td>
                  <td className="px-4 py-3">{w.topic}</td>
                  <td className="px-4 py-3">
                    {w.materials.length === 0 ? (
                      <span className="text-slate-400">준비 중</span>
                    ) : (
                      <span className="flex flex-wrap gap-x-4 gap-y-1">
                        {w.materials.map((m) => (
                          <ExternalLink key={m.url} href={m.url}>
                            {m.label}
                          </ExternalLink>
                        ))}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
