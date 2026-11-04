import { Link, useParams } from 'react-router';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { courses } from '../data/courses';
import { usePageTitle } from '../hooks/usePageTitle';
import { Card, Page } from '../components/ui';
import { NotFoundPage } from './NotFoundPage';

export function CourseDetailPage() {
  const { courseId } = useParams();
  const course = courses.find((c) => c.id === courseId);
  usePageTitle(course?.title ?? '과목을 찾을 수 없음');

  if (!course) return <NotFoundPage />;

  const info = [
    { label: '학기', value: course.semester },
    { label: '과목 코드', value: course.code },
    { label: '구분', value: course.level },
    { label: '자료 등록', value: `${course.weeks.filter((w) => w.materials.length > 0).length} / ${course.weeks.length}주` },
  ];

  return (
    <Page
      eyebrow={`${course.code} · ${course.level}`}
      title={course.title}
      description={course.semester}
    >
      <Link
        to="/courses"
        className="mb-8 inline-flex items-center gap-1 text-sm font-medium text-slate-500 transition hover:text-brand-700 dark:hover:text-brand-300"
      >
        <ArrowLeft className="h-4 w-4" /> 과목 목록
      </Link>

      <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
        <Card>
          <h2 className="text-xs font-semibold tracking-[0.2em] text-brand-600 uppercase dark:text-brand-300">강의 개요</h2>
          <p className="mt-3 text-[17px] leading-relaxed text-slate-700 dark:text-slate-300">{course.overview}</p>
        </Card>
        <Card className="p-0">
          <dl className="divide-y divide-slate-100 dark:divide-slate-800">
            {info.map((i) => (
              <div key={i.label} className="flex items-center justify-between px-6 py-3.5 text-sm">
                <dt className="text-slate-500">{i.label}</dt>
                <dd className="font-semibold">{i.value}</dd>
              </div>
            ))}
          </dl>
        </Card>
      </div>

      <section className="mt-12">
        <h2 className="mb-4 text-xl font-bold tracking-tight">주차별 자료</h2>
        <div className="overflow-x-auto rounded-2xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead className="border-b border-slate-200 text-xs tracking-wide text-slate-500 uppercase dark:border-slate-800">
              <tr>
                <th scope="col" className="w-24 px-6 py-4 font-semibold">주차</th>
                <th scope="col" className="px-6 py-4 font-semibold">주제</th>
                <th scope="col" className="px-6 py-4 font-semibold">자료</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {course.weeks.map((w) => (
                <tr key={w.week} className="transition hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                  <td className="px-6 py-4">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 font-mono text-xs font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                      {String(w.week).padStart(2, '0')}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium">{w.topic}</td>
                  <td className="px-6 py-4">
                    {w.materials.length === 0 ? (
                      <span className="text-slate-400">준비 중</span>
                    ) : (
                      <span className="flex flex-wrap gap-2">
                        {w.materials.map((m) => (
                          <a
                            key={m.url}
                            href={m.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 rounded-lg border border-brand-200 bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700 transition hover:border-brand-400 hover:bg-brand-100 dark:border-brand-800 dark:bg-brand-950 dark:text-brand-300 dark:hover:border-brand-600"
                          >
                            {m.label} <ArrowUpRight className="h-3 w-3" aria-hidden />
                          </a>
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
    </Page>
  );
}
