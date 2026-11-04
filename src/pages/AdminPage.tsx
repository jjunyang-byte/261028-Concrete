import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { Check, FilePlus2, UserCheck, X } from 'lucide-react';
import { discussionService, userService, type AppUser } from '../services';
import { welcomePosts } from '../data/welcomePosts';
import { usePageTitle } from '../hooks/usePageTitle';
import { Avatar, buttonClass, Card, CategoryBadge, EmptyState, ErrorMessage, errorText, formatDate, Page, Spinner } from '../components/ui';

export function AdminPage() {
  usePageTitle('관리자');
  const [users, setUsers] = useState<AppUser[] | null>(null);
  const [error, setError] = useState('');
  const [busyUid, setBusyUid] = useState<string | null>(null);

  const load = () =>
    userService
      .listPendingUsers()
      .then(setUsers)
      .catch((e) => setError(errorText(e)));

  useEffect(() => {
    void load();
  }, []);

  const decide = async (u: AppUser, approve: boolean) => {
    if (!approve && !confirm(`${u.displayName}님의 가입을 거절할까요?`)) return;
    setBusyUid(u.uid);
    setError('');
    try {
      // 승인 → 역할을 member로, 거절 → 사용자 정보 삭제
      if (approve) await userService.setRole(u.uid, 'member');
      else await userService.removeUser(u.uid);
      await load();
    } catch (e) {
      setError(errorText(e));
    } finally {
      setBusyUid(null);
    }
  };

  return (
    <Page eyebrow="Admin" title="관리자" description="가입을 신청한 사용자를 승인하거나 거절합니다.">
      {error && <ErrorMessage message={error} />}
      <StarterPosts />
      <h2 className="mb-5 flex items-center gap-2 text-lg font-bold tracking-tight">
        <UserCheck className="h-5 w-5 text-brand-600 dark:text-brand-400" />
        가입 대기 중인 사용자
        {users && (
          <span className="rounded-full bg-brand-50 px-2.5 py-0.5 text-sm text-brand-700 dark:bg-brand-950 dark:text-brand-300">
            {users.length}
          </span>
        )}
      </h2>
      {users === null ? (
        <Spinner />
      ) : users.length === 0 ? (
        <EmptyState>대기 중인 사용자가 없습니다.</EmptyState>
      ) : (
        <ul className="divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm dark:divide-slate-800 dark:border-slate-800 dark:bg-slate-900">
          {users.map((u) => (
            <li key={u.uid} className="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <div className="flex min-w-0 items-center gap-4">
                <Avatar name={u.displayName} />
                <div className="min-w-0">
                  <p className="font-semibold">{u.displayName}</p>
                  <p className="text-sm break-all text-slate-500">{u.email}</p>
                  <p className="text-xs text-slate-400">신청일 {formatDate(u.createdAt)}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className={buttonClass.primary} disabled={busyUid === u.uid} onClick={() => decide(u, true)}>
                  <Check className="h-4 w-4" /> 승인
                </button>
                <button className={buttonClass.danger} disabled={busyUid === u.uid} onClick={() => decide(u, false)}>
                  <X className="h-4 w-4" /> 거절
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Page>
  );
}

/**
 * 게시판이 비어 있을 때만 보이는 카드: 안내 글(src/data/welcomePosts.ts)을 한 번에 등록합니다.
 */
function StarterPosts() {
  const [isEmpty, setIsEmpty] = useState<boolean | null>(null);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    discussionService
      .listPosts({ pageSize: 1 })
      .then((res) => setIsEmpty(res.posts.length === 0))
      .catch(() => setIsEmpty(false));
  }, []);

  const register = async () => {
    if (!confirm(`안내 글 ${welcomePosts.length}개를 교수님 이름으로 게시판에 등록할까요?`)) return;
    setBusy(true);
    setError('');
    try {
      // 목록의 첫 글이 게시판 맨 위에 오도록, 마지막 글부터 순서대로 등록합니다.
      for (const p of [...welcomePosts].reverse()) {
        await discussionService.createPost({ title: p.title, body: p.body, category: p.category });
      }
      setDone(true);
    } catch (e) {
      setError(errorText(e));
    } finally {
      setBusy(false);
    }
  };

  if (done) {
    return (
      <Card className="mb-10 border-emerald-200 bg-emerald-50/60 dark:border-emerald-900 dark:bg-emerald-950/30">
        <p className="font-semibold text-emerald-800 dark:text-emerald-300">안내 글을 등록했습니다.</p>
        <Link to="/discussion" className={`${buttonClass.secondary} mt-4`}>
          게시판에서 보기
        </Link>
      </Card>
    );
  }
  if (!isEmpty) return null;

  return (
    <Card className="mb-10 sm:p-8">
      <h2 className="flex items-center gap-2 text-lg font-bold tracking-tight">
        <FilePlus2 className="h-5 w-5 text-brand-600 dark:text-brand-400" />
        게시판 시작하기
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
        게시판이 아직 비어 있습니다. 아래 안내 글을 한 번에 등록할 수 있습니다. 등록 후에는 게시판에서 자유롭게 수정·삭제할 수 있고,
        내용은 <code className="rounded bg-slate-100 px-1 dark:bg-slate-800">src/data/welcomePosts.ts</code>에서 미리 고칠 수 있습니다.
      </p>
      <ul className="mt-4 space-y-2">
        {welcomePosts.map((p) => (
          <li key={p.title} className="flex items-center gap-2 text-sm">
            <CategoryBadge category={p.category} />
            <span className="font-medium">{p.title}</span>
          </li>
        ))}
      </ul>
      {error && <div className="mt-4"><ErrorMessage message={error} /></div>}
      <button className={`${buttonClass.primary} mt-6`} onClick={register} disabled={busy}>
        <FilePlus2 className="h-4 w-4" /> {busy ? '등록 중…' : '첫 글 등록'}
      </button>
    </Card>
  );
}
