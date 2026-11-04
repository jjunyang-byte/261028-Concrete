import { Mail } from 'lucide-react';
import { groupLabels, members, type MemberGroup } from '../data/members';
import { usePageTitle } from '../hooks/usePageTitle';
import { Avatar, Card, Page, SectionHeading } from '../components/ui';

const order: MemberGroup[] = ['professor', 'phd', 'master', 'alumni'];
const eyebrows: Record<MemberGroup, string> = {
  professor: 'Faculty',
  phd: 'Ph.D. Students',
  master: 'M.S. Students',
  alumni: 'Alumni',
};

export function MembersPage() {
  usePageTitle('구성원');
  return (
    <Page eyebrow="People" title="구성원" description="연구실을 함께 만들어 가는 사람들입니다.">
      <div className="space-y-16">
        {order.map((group) => {
          const list = members.filter((m) => m.group === group);
          if (list.length === 0) return null;
          return (
            <section key={group}>
              <SectionHeading
                eyebrow={eyebrows[group]}
                title={
                  <>
                    {groupLabels[group]} <span className="text-lg font-medium text-slate-400">{list.length}</span>
                  </>
                }
              />
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {list.map((m) => (
                  <Card key={m.name + m.topic} interactive className="flex gap-4">
                    <Avatar name={m.name} size="lg" />
                    <div className="min-w-0">
                      <h3 className="text-lg font-bold tracking-tight">{m.name}</h3>
                      <p className="mt-0.5 text-sm font-medium text-brand-700 dark:text-brand-300">{m.topic}</p>
                      {m.note && <p className="mt-1 text-xs text-slate-500">{m.note}</p>}
                      {m.email && (
                        <a
                          href={`mailto:${m.email}`}
                          className="mt-2 inline-flex items-center gap-1.5 text-xs break-all text-slate-500 transition hover:text-brand-700 dark:hover:text-brand-300"
                        >
                          <Mail className="h-3.5 w-3.5 shrink-0" /> {m.email}
                        </a>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </Page>
  );
}
