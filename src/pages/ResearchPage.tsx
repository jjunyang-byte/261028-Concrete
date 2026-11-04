import { researchAreas } from '../data/research';
import { publications } from '../data/publications';
import { usePageTitle } from '../hooks/usePageTitle';
import { Card, ExternalLink, Page, SectionHeading } from '../components/ui';

export function ResearchPage() {
  usePageTitle('연구');

  // 논문을 연도별로 묶고, 최신 연도부터 보여 줍니다.
  const byYear = new Map<number, typeof publications>();
  for (const p of publications) byYear.set(p.year, [...(byYear.get(p.year) ?? []), p]);
  const years = [...byYear.keys()].sort((a, b) => b - a);

  return (
    <Page eyebrow="Research" title="연구" description="실험·해석·현장 계측을 아우르며 안전하고 지속가능한 사회기반시설을 연구합니다.">
      <section>
        <SectionHeading eyebrow="Research Areas" title="연구 분야" />
        <div className="grid gap-5 md:grid-cols-2">
          {researchAreas.map((a, idx) => (
            <Card key={a.title} interactive className="relative overflow-hidden">
              <span
                className="pointer-events-none absolute -top-4 right-4 font-mono text-8xl font-bold text-slate-100 select-none dark:text-slate-800/70"
                aria-hidden
              >
                {String(idx + 1).padStart(2, '0')}
              </span>
              <div className="relative">
                <h3 className="text-xl font-bold tracking-tight">{a.title}</h3>
                <p className="mt-3 leading-relaxed text-slate-600 dark:text-slate-400">{a.description}</p>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {a.keywords.map((k) => (
                    <li
                      key={k}
                      className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                    >
                      #{k}
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section className="mt-20">
        <SectionHeading eyebrow="Publications" title={<>논문 <span className="text-lg font-medium text-slate-400">{publications.length}편</span></>} />
        <div className="space-y-12">
          {years.map((year) => (
            <div key={year} className="grid gap-4 md:grid-cols-[140px_1fr] md:gap-8">
              <h3 className="text-3xl font-bold tracking-tight text-slate-300 md:sticky md:top-24 md:self-start dark:text-slate-700">
                {year}
              </h3>
              <ol className="space-y-3">
                {byYear.get(year)!.map((p) => (
                  <li
                    key={p.title}
                    className="group rounded-2xl border border-slate-200/80 bg-white p-5 transition hover:border-brand-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-brand-700"
                  >
                    <p className="font-semibold leading-snug text-slate-900 dark:text-white">{p.title}</p>
                    <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-400">{p.authors}</p>
                    <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                      <p className="text-sm text-slate-500 italic">
                        {p.journal}, {p.year}
                      </p>
                      {p.link && (
                        <ExternalLink href={p.link} className="text-sm">
                          논문 보기
                        </ExternalLink>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </section>
    </Page>
  );
}
