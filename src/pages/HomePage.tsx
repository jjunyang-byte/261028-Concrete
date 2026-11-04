import { Link } from 'react-router';
import { ArrowRight, Mail, MapPin, User } from 'lucide-react';
import { professor } from '../data/professor';
import { news } from '../data/news';
import { usePageTitle } from '../hooks/usePageTitle';
import { Card, ExternalLink } from '../components/ui';

export function HomePage() {
  usePageTitle();
  const latest = [...news].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3);

  return (
    <div className="space-y-12">
      {/* 교수 소개 */}
      <section className="grid gap-8 md:grid-cols-[220px_1fr]">
        <div className="mx-auto w-48 md:w-full">
          {professor.photo ? (
            <img
              src={professor.photo}
              alt={`${professor.name} ${professor.position} 사진`}
              className="aspect-[3/4] w-full rounded-xl object-cover shadow"
            />
          ) : (
            <div className="flex aspect-[3/4] w-full items-center justify-center rounded-xl bg-slate-200 text-slate-400 dark:bg-slate-800">
              <User className="h-20 w-20" aria-label="사진 자리" />
            </div>
          )}
        </div>
        <div>
          <p className="text-sm font-medium text-blue-700 dark:text-blue-400">{professor.affiliation}</p>
          <h1 className="mt-1 text-3xl font-bold">
            {professor.name} <span className="text-xl font-medium text-slate-600 dark:text-slate-400">{professor.position}</span>
          </h1>
          <p className="text-slate-500">{professor.nameEn}</p>
          <p className="mt-4 whitespace-pre-line leading-relaxed text-slate-700 dark:text-slate-300">{professor.intro}</p>

          <h2 className="mt-6 mb-2 font-semibold">연구 관심사</h2>
          <ul className="flex flex-wrap gap-2">
            {professor.interests.map((i) => (
              <li key={i} className="rounded-full bg-blue-50 px-3 py-1 text-sm text-blue-800 dark:bg-blue-900/40 dark:text-blue-300">
                {i}
              </li>
            ))}
          </ul>

          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-600 dark:text-slate-400">
            <a href={`mailto:${professor.email}`} className="inline-flex items-center gap-1 hover:underline">
              <Mail className="h-4 w-4" /> {professor.email}
            </a>
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-4 w-4" /> {professor.office}
            </span>
          </div>
        </div>
      </section>

      {/* 최근 소식 */}
      <section>
        <div className="mb-4 flex items-end justify-between">
          <h2 className="text-xl font-bold">최근 소식</h2>
          <Link to="/research" className="inline-flex items-center gap-1 text-sm text-blue-700 hover:underline dark:text-blue-400">
            연구 둘러보기 <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {latest.map((n) => (
            <Card key={n.date + n.title}>
              <time className="text-xs text-slate-500" dateTime={n.date}>
                {n.date.replaceAll('-', '. ')}
              </time>
              <h3 className="mt-1 font-semibold">{n.title}</h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{n.summary}</p>
              {n.link && (
                <ExternalLink href={n.link} className="mt-3 text-sm">
                  자세히 보기
                </ExternalLink>
              )}
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
