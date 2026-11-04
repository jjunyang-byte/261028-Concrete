import { Mail, User } from 'lucide-react';
import { groupLabels, members, type MemberGroup } from '../data/members';
import { usePageTitle } from '../hooks/usePageTitle';
import { Card, PageHeader } from '../components/ui';

const order: MemberGroup[] = ['professor', 'phd', 'master', 'alumni'];

export function MembersPage() {
  usePageTitle('구성원');
  return (
    <div className="space-y-10">
      <PageHeader title="구성원" description="연구실을 함께 만들어 가는 사람들입니다." />
      {order.map((group) => {
        const list = members.filter((m) => m.group === group);
        if (list.length === 0) return null;
        return (
          <section key={group}>
            <h2 className="mb-4 text-xl font-bold">
              {groupLabels[group]} <span className="text-base font-normal text-slate-500">({list.length})</span>
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((m) => (
                <Card key={m.name + m.topic} className="flex gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-slate-200 text-slate-400 dark:bg-slate-700">
                    <User className="h-7 w-7" aria-hidden />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold">{m.name}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{m.topic}</p>
                    {m.note && <p className="text-xs text-slate-500">{m.note}</p>}
                    {m.email && (
                      <a href={`mailto:${m.email}`} className="mt-1 inline-flex items-center gap-1 break-all text-xs text-blue-700 hover:underline dark:text-blue-400">
                        <Mail className="h-3.5 w-3.5" /> {m.email}
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
  );
}
