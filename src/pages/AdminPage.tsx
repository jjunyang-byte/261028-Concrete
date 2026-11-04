import { useEffect, useState } from 'react';
import { Check, X } from 'lucide-react';
import { userService, type AppUser } from '../services';
import { usePageTitle } from '../hooks/usePageTitle';
import { buttonClass, ErrorMessage, errorText, formatDate, PageHeader, Spinner } from '../components/ui';

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
    <div>
      <PageHeader title="관리자" description="가입을 신청한 사용자를 승인하거나 거절합니다." />
      {error && <ErrorMessage message={error} />}
      <h2 className="mb-3 text-lg font-bold">가입 대기 중인 사용자 {users ? `(${users.length})` : ''}</h2>
      {users === null ? (
        <Spinner />
      ) : users.length === 0 ? (
        <p className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-slate-500 dark:border-slate-700">
          대기 중인 사용자가 없습니다.
        </p>
      ) : (
        <ul className="divide-y divide-slate-200 overflow-hidden rounded-xl border border-slate-200 bg-white dark:divide-slate-700 dark:border-slate-700 dark:bg-slate-800">
          {users.map((u) => (
            <li key={u.uid} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="font-medium">{u.displayName}</p>
                <p className="break-all text-sm text-slate-500">{u.email}</p>
                <p className="text-xs text-slate-400">신청일 {formatDate(u.createdAt)}</p>
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
    </div>
  );
}
