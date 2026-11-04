import { researchAreas } from '../data/research';
import { publications } from '../data/publications';
import { usePageTitle } from '../hooks/usePageTitle';
import { Card, ExternalLink, PageHeader } from '../components/ui';

export function ResearchPage() {
  usePageTitle('연구');

  // 논문을 연도별로 묶고, 최신 연도부터 보여 줍니다.
  const byYear = new Map<number, typeof publications>();
  for (const p of publications) byYear.set(p.year, [...(byYear.get(p.year) ?? []), p]);
  const years = [...byYear.keys()].sort((a, b) => b - a);

  return (
    <div className="space-y-12">
      <PageHeader title="연구" description="연구실의 주요 연구 분야와 발표 논문입니다." />

      <section>
        <h2 className="mb-4 text-xl font-bold">연구 분야</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {researchAreas.map((a) => (
            <Card key={a.title}>
              <h3 className="text-lg font-semibold">{a.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{a.description}</p>
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {a.keywords.map((k) => (
                  <li key={k} className="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                    #{k}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-bold">논문</h2>
        <div className="space-y-8">
          {years.map((year) => (
            <div key={year}>
              <h3 className="mb-3 border-b border-slate-200 pb-1 text-lg font-semibold text-blue-800 dark:border-slate-700 dark:text-blue-300">
                {year}
              </h3>
              <ol className="space-y-3">
                {byYear.get(year)!.map((p) => (
                  <li key={p.title} className="leading-relaxed">
                    <span className="text-slate-700 dark:text-slate-300">{p.authors}.</span>{' '}
                    <span className="font-medium">“{p.title}”</span>{' '}
                    <span className="italic text-slate-600 dark:text-slate-400">{p.journal}</span>, {p.year}.
                    {p.link && (
                      <ExternalLink href={p.link} className="ml-2 text-sm">
                        링크
                      </ExternalLink>
                    )}
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
