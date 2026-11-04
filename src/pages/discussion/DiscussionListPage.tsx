import { useCallback, useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router';
import { PenSquare } from 'lucide-react';
import { discussionService, type Category, type Post } from '../../services';
import { usePageTitle } from '../../hooks/usePageTitle';
import {
  buttonClass,
  CategoryBadge,
  categoryLabels,
  ErrorMessage,
  errorText,
  formatDate,
  PageHeader,
  Spinner,
} from '../../components/ui';

const PAGE_SIZE = 20;
const filters: (Category | undefined)[] = [undefined, 'research', 'course', 'notice'];

export function DiscussionListPage() {
  usePageTitle('토론 게시판');
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
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <PageHeader title="토론 게시판" description="연구 결과와 수업 내용을 자유롭게 토론하는 공간입니다." />
        <Link to="/discussion/new" className={buttonClass.primary}>
          <PenSquare className="h-4 w-4" /> 글쓰기
        </Link>
      </div>

      <div className="mb-4 flex flex-wrap gap-2" role="tablist" aria-label="카테고리">
        {filters.map((f) => {
          const active = f === category;
          return (
            <button
              key={f ?? 'all'}
              role="tab"
              aria-selected={active}
              onClick={() => setParams(f ? { category: f } : {})}
              className={`rounded-full px-4 py-1.5 text-sm font-medium ${
                active
                  ? 'bg-blue-700 text-white dark:bg-blue-600'
                  : 'bg-white text-slate-700 ring-1 ring-slate-300 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-600'
              }`}
            >
              {f ? categoryLabels[f] : '전체'}
            </button>
          );
        })}
      </div>

      {error && <ErrorMessage message={error} />}
      {loading ? (
        <Spinner />
      ) : posts.length === 0 ? (
        <p className="py-12 text-center text-slate-500">아직 글이 없습니다. 첫 글을 남겨 보세요!</p>
      ) : (
        <ul className="divide-y divide-slate-200 overflow-hidden rounded-xl border border-slate-200 bg-white dark:divide-slate-700 dark:border-slate-700 dark:bg-slate-800">
          {posts.map((p) => (
            <li key={p.id}>
              <Link to={`/discussion/${p.id}`} className="block px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                <div className="flex min-w-0 items-center gap-2">
                  <CategoryBadge category={p.category} />
                  <span className="truncate font-medium">{p.title}</span>
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  {p.authorName} · {formatDate(p.createdAt)}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {cursor && !loading && (
        <div className="mt-6 text-center">
          <button onClick={loadMore} disabled={loadingMore} className={buttonClass.secondary}>
            {loadingMore ? '불러오는 중…' : '더 보기'}
          </button>
        </div>
      )}
    </div>
  );
}
