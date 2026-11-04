import { Link } from 'react-router';
import { ArrowRight, BookOpen, FileText, FlaskConical, Mail, MapPin, MessagesSquare, User, Users } from 'lucide-react';
import { professor } from '../data/professor';
import { news } from '../data/news';
import { researchAreas } from '../data/research';
import { publications } from '../data/publications';
import { courses } from '../data/courses';
import { members } from '../data/members';
import { site } from '../data/site';
import { usePageTitle } from '../hooks/usePageTitle';
import { buttonClass, Card, Container, ExternalLink, SectionHeading } from '../components/ui';

export function HomePage() {
  usePageTitle();
  const latest = [...news].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3);

  const stats = [
    { icon: FlaskConical, value: researchAreas.length, label: '연구 분야' },
    { icon: FileText, value: publications.length, label: '발표 논문' },
    { icon: BookOpen, value: courses.length, label: '개설 과목' },
    { icon: Users, value: members.filter((m) => m.group !== 'alumni').length, label: '재학 구성원' },
  ];

  return (
    <>
      {/* ── 상단 배너: 연구실 소개 + 교수 카드 ── */}
      <section className="relative isolate overflow-hidden bg-brand-950 text-white">
        <div className="absolute inset-0 -z-10 bg-linear-to-br from-brand-950 via-brand-900 to-slate-950" aria-hidden />
        <div className="absolute inset-0 -z-10 bg-blueprint" aria-hidden />
        <div className="absolute -top-40 right-0 -z-10 h-[28rem] w-[28rem] rounded-full bg-brand-500/25 blur-3xl" aria-hidden />
        <div className="absolute bottom-0 left-[-10%] -z-10 h-72 w-72 rounded-full bg-sky-400/10 blur-3xl" aria-hidden />

        <Container className="grid items-center gap-12 pt-16 pb-28 sm:pt-20 lg:grid-cols-[1.25fr_1fr] lg:pb-32">
          <div className="animate-fade-up">
            <p className="text-xs font-semibold tracking-[0.25em] text-amber-300 uppercase">{site.labNameEn}</p>
            <h1 className="mt-4 text-4xl leading-tight font-bold tracking-tight sm:text-5xl">{site.labName}</h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed whitespace-pre-line text-brand-100/80">
              {professor.intro}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/research" className={buttonClass.light}>
                연구 분야 보기 <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/discussion" className={buttonClass.ghostLight}>
                <MessagesSquare className="h-4 w-4" /> 토론 게시판
              </Link>
            </div>
          </div>

          {/* 교수 카드 */}
          <div className="animate-fade-up rounded-3xl border border-white/10 bg-white/[0.06] p-6 shadow-2xl shadow-black/20 backdrop-blur-md [animation-delay:120ms] sm:p-8">
            <div className="flex items-center gap-5">
              {professor.photo ? (
                <img
                  src={professor.photo}
                  alt={`${professor.name} ${professor.position} 사진`}
                  className="h-24 w-24 shrink-0 rounded-2xl object-cover ring-2 ring-white/20"
                />
              ) : (
                <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-white/50 ring-1 ring-white/15">
                  <User className="h-10 w-10" aria-label="사진 자리" />
                </div>
              )}
              <div className="min-w-0">
                <p className="text-2xl font-bold">
                  {professor.name} <span className="text-base font-medium text-brand-200">{professor.position}</span>
                </p>
                <p className="text-sm text-brand-200/70">{professor.nameEn}</p>
                <p className="mt-1 text-sm text-brand-100/80">{professor.affiliation}</p>
              </div>
            </div>

            <h2 className="mt-7 mb-3 text-xs font-semibold tracking-[0.2em] text-brand-200/80 uppercase">연구 관심사</h2>
            <ul className="space-y-2">
              {professor.interests.map((i) => (
                <li key={i} className="flex items-start gap-2.5 text-[15px] text-white/90">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-300" aria-hidden />
                  {i}
                </li>
              ))}
            </ul>

            <div className="mt-7 flex flex-col gap-2 border-t border-white/10 pt-5 text-sm text-brand-100/80">
              <a href={`mailto:${professor.email}`} className="inline-flex items-center gap-2 break-all transition hover:text-white">
                <Mail className="h-4 w-4 shrink-0" /> {professor.email}
              </a>
              <span className="inline-flex items-center gap-2">
                <MapPin className="h-4 w-4 shrink-0" /> {professor.office}
              </span>
            </div>
          </div>
        </Container>
      </section>

      {/* ── 숫자 요약 (배너 아래에 살짝 겹침) ── */}
      <Container className="relative z-10 -mt-14">
        <dl className="grid grid-cols-2 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xl shadow-slate-900/5 md:grid-cols-4 dark:border-slate-800 dark:bg-slate-900">
          {stats.map(({ icon: Icon, value, label }, idx) => (
            <div
              key={label}
              className={`flex items-center gap-4 p-5 sm:p-6 ${idx > 0 ? 'md:border-l' : ''} ${idx % 2 === 1 ? 'border-l md:border-l' : ''} ${
                idx >= 2 ? 'border-t md:border-t-0' : ''
              } border-slate-100 dark:border-slate-800`}
            >
              <span className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600 sm:flex dark:bg-brand-950 dark:text-brand-300">
                <Icon className="h-5 w-5" />
              </span>
              <div>
                <dd className="text-2xl font-bold tracking-tight sm:text-3xl">{value}</dd>
                <dt className="text-sm text-slate-500 dark:text-slate-400">{label}</dt>
              </div>
            </div>
          ))}
        </dl>
      </Container>

      {/* ── 연구 분야 미리보기 ── */}
      <Container className="py-20">
        <SectionHeading
          eyebrow="Research"
          title="연구 분야"
          action={
            <Link to="/research" className="group inline-flex items-center gap-1 text-sm font-semibold text-brand-700 dark:text-brand-300">
              전체 보기 <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </Link>
          }
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {researchAreas.map((a, idx) => (
            <Link key={a.title} to="/research" className="group">
              <Card interactive className="h-full">
                <span className="font-mono text-sm font-semibold text-brand-500/70 dark:text-brand-400/70">
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-3 text-lg font-bold tracking-tight">{a.title}</h3>
                <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{a.description}</p>
              </Card>
            </Link>
          ))}
        </div>
      </Container>

      {/* ── 최근 소식 ── */}
      <section className="border-t border-slate-200/80 bg-white py-20 dark:border-slate-800 dark:bg-slate-900/40">
        <Container>
          <SectionHeading eyebrow="News" title="최근 소식" />
          <ol className="grid gap-5 md:grid-cols-3">
            {latest.map((n) => {
              const [y, m, d] = n.date.split('-');
              return (
                <li key={n.date + n.title}>
                  <Card className="flex h-full flex-col">
                    <time dateTime={n.date} className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold tracking-tight text-brand-700 dark:text-brand-300">
                        {m}.{d}
                      </span>
                      <span className="text-sm text-slate-400">{y}</span>
                    </time>
                    <h3 className="mt-4 font-bold leading-snug">{n.title}</h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{n.summary}</p>
                    {n.link && (
                      <ExternalLink href={n.link} className="mt-4 text-sm">
                        자세히 보기
                      </ExternalLink>
                    )}
                  </Card>
                </li>
              );
            })}
          </ol>
        </Container>
      </section>
    </>
  );
}
