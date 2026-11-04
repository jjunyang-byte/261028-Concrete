import { useCallback, useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router';
import { ChevronRight, PenSquare } from 'lucide-react';
import { discussionService, isAdmin, type Category, type Post } from '../../services';
import { useAuth } from '../../auth/useAuth';
import { usePageTitle } from '../../hooks/usePageTitle';
import {
  Avatar,
  buttonClass,
  CategoryBadge,
  categoryLabels,
  EmptyState,
  ErrorMessage,
  errorText,
  formatDate,
  Page,
  Spinner,
} from '../../components/ui';

const PAGE_SIZE = 20;
const filters: (Category | undefined)[] = [undefined, 'research', 'course', 'notice'];

export function DiscussionListPage() {
  usePageTitle('토론 게시판');
  const { user } = useAuth();
  const [params, setParams] = useSearchParams();
  const raw = params.get('category');
  const category = raw && raw in categoryLabels ? (raw as Category) : undefined;

  const [posts, setPosts] = useState<Post[]>([]);
  const [cursor, setCursor] = useState<string | undefined>();
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');

  // 카테고리가 바뀌면 처음부터 다시 불러옵니다.
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');
    discussionService
      .listPosts({ category, pageSize: PAGE_SIZE })
      .then((res) => {
        if (cancelled) return;
        setPosts(res.posts);
        setCursor(res.nextCursor);
      })
      .catch((e) => !cancelled && setError(errorText(e)))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [category]);

  const loadMore = useCallback(async () => {
    if (!cursor) return;
    setLoadingMore(true);
    try {
      const res = await discussionService.listPosts({ category, pageSize: PAGE_SIZE, cursor });
      setPosts((prev) => [...prev, ...res.posts]);
      setCursor(res.nextCursor);
    } catch (e) {
      setError(errorText(e));
    } finally {
      setLoadingMore(false);
    }
  }, [category, cursor]);

  return (
    <Page
      eyebrow="Discussion"
      title="토론 게시판"
      description="연구 결과와 수업 내용을 자유롭게 토론하는 공간입니다."
    >
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div
          className="inline-flex flex-wrap gap-1 rounded-2xl border border-slate-200/80 bg-white p-1 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          role="tablist"
          aria-label="카테고리"
        >
          {filters.map((f) => {
            const active = f === category;
            return (
              <button
                key={f ?? 'all'}
                role="tab"
                aria-selected={active}
                onClick={() => setParams(f ? { category: f } : {})}
                className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                  active
                    ? 'bg-brand-600 text-white shadow-sm dark:bg-brand-500'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white'
                }`}
              >
                {f ? categoryLabels[f] : '전체'}
              </button>
            );
          })}
        </div>
        <Link to="/discussion/new" className={buttonClass.primary}>
          <PenSquare className="h-4 w-4" /> 글쓰기
        </Link>
      </div>

      {error && <ErrorMessage message={error} />}
      {loading ? (
        <Spinner />
      ) : posts.length === 0 ? (
        <EmptyState>
          아직 글이 없습니다. 첫 글을 남겨 보세요!
          {isAdmin(user) && !category && (
            <p className="mt-3 text-sm">
              <Link to="/admin" className="font-semibold text-brand-700 hover:underline dark:text-brand-300">
                관리자 페이지
              </Link>
              에서 안내 글을 한 번에 등록할 수 있습니다.
            </p>
          )}
        </EmptyState>
      ) : (
        <ul className="divide-y divide-slate-100 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm dark:divide-slate-800 dark:border-slate-800 dark:bg-slate-900">
          {posts.map((p) => (
            <li key={p.id}>
              <Link
                to={`/discussion/${p.id}`}
                className={`group flex items-center gap-4 px-5 py-4 transition hover:bg-slate-50 sm:px-6 dark:hover:bg-slate-800/50 ${
                  p.category === 'notice' ? 'bg-amber-50/40 dark:bg-amber-950/10' : ''
                }`}
              >
                <Avatar name={p.authorName} size="sm" />
                <div className="min-w-0 flex-1">
                  <div className="flex min-w-0 items-center gap-2">
                    <CategoryBadge category={p.category} />
                    <span className="truncate font-semibold text-slate-900 group-hover:text-brand-700 dark:text-slate-100 dark:group-hover:text-brand-300">
                      {p.title}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-500">
                    {p.authorName} · {formatDate(p.createdAt)}
                  </p>
                </div>
                <ChevronRight className="h-5 w-5 shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-brand-500" />
              </Link>
            </li>
          ))}
        </ul>
      )}

      {cursor && !loading && (
        <div className="mt-8 text-center">
          <button onClick={loadMore} disabled={loadingMore} className={buttonClass.secondary}>
            {loadingMore ? '불러오는 중…' : '더 보기'}
          </button>
        </div>
      )}
    </Page>
  );
}
