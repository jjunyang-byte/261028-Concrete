import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { ArrowLeft, Pencil, Trash2 } from 'lucide-react';
import { canModify, discussionService, type Comment, type Post } from '../../services';
import { useAuth } from '../../auth/useAuth';
import { usePageTitle } from '../../hooks/usePageTitle';
import { buttonClass, CategoryBadge, ErrorMessage, errorText, formatDateTime, Spinner } from '../../components/ui';
import { NotFoundPage } from '../NotFoundPage';
import { inputClass } from './PostForm';

export function PostDetailPage() {
  const { postId = '' } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [post, setPost] = useState<Post | null | undefined>(undefined);
  const [comments, setComments] = useState<Comment[]>([]);
  const [error, setError] = useState('');
  const [commentText, setCommentText] = useState('');
  const [busy, setBusy] = useState(false);

  usePageTitle(post?.title ?? '게시글');

  const loadComments = useCallback(() => discussionService.listComments(postId).then(setComments), [postId]);

  useEffect(() => {
    setPost(undefined);
    setError('');
    Promise.all([discussionService.getPost(postId).then(setPost), loadComments()]).catch((e) => setError(errorText(e)));
  }, [postId, loadComments]);

  const handleDeletePost = async () => {
    if (!post || !confirm('이 글을 삭제할까요? 댓글도 함께 삭제됩니다.')) return;
    try {
      await discussionService.deletePost(post.id);
      navigate('/discussion', { replace: true });
    } catch (e) {
      setError(errorText(e));
    }
  };

  const handleAddComment = async (e: FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setBusy(true);
    setError('');
    try {
      await discussionService.addComment(postId, commentText);
      setCommentText('');
      await loadComments();
    } catch (err) {
      setError(errorText(err));
    } finally {
      setBusy(false);
    }
  };

  const handleDeleteComment = async (c: Comment) => {
    if (!confirm('이 댓글을 삭제할까요?')) return;
    try {
      await discussionService.deleteComment(postId, c.id);
      await loadComments();
    } catch (e) {
      setError(errorText(e));
    }
  };

  if (post === undefined && !error) return <Spinner />;
  if (post === null) return <NotFoundPage />;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link to="/discussion" className="inline-flex items-center gap-1 text-sm text-blue-700 hover:underline dark:text-blue-400">
        <ArrowLeft className="h-4 w-4" /> 목록으로
      </Link>

      {error && <ErrorMessage message={error} />}

      {post && (
        <>
          <article className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
            <CategoryBadge category={post.category} />
            <h1 className="mt-2 break-words text-2xl font-bold">{post.title}</h1>
            <p className="mt-1 text-sm text-slate-500">
              {post.authorName} · {formatDateTime(post.createdAt)}
              {post.updatedAt.getTime() !== post.createdAt.getTime() && ' (수정됨)'}
            </p>
            {/* 본문은 일반 텍스트로만 표시합니다. HTML로 해석하지 않으므로 안전합니다. */}
            <div className="mt-6 whitespace-pre-wrap break-words leading-relaxed">{post.body}</div>

            {canModify(user, post) && (
              <div className="mt-6 flex gap-2 border-t border-slate-200 pt-4 dark:border-slate-700">
                <Link to={`/discussion/${post.id}/edit`} className={buttonClass.secondary}>
                  <Pencil className="h-4 w-4" /> 수정
                </Link>
                <button onClick={handleDeletePost} className={buttonClass.danger}>
                  <Trash2 className="h-4 w-4" /> 삭제
                </button>
              </div>
            )}
          </article>

          <section>
            <h2 className="mb-3 text-lg font-bold">댓글 {comments.length}</h2>
            <ul className="space-y-3">
              {comments.map((c) => (
                <li key={c.id} className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm">
                      <span className="font-medium">{c.authorName}</span>
                      <span className="ml-2 text-xs text-slate-500">{formatDateTime(c.createdAt)}</span>
                    </p>
                    {canModify(user, c) && (
                      <button
                        onClick={() => handleDeleteComment(c)}
                        className="rounded p-1 text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950"
                        aria-label="댓글 삭제"
                        title="댓글 삭제"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  <p className="mt-1 whitespace-pre-wrap break-words text-sm leading-relaxed">{c.body}</p>
                </li>
              ))}
            </ul>

            <form onSubmit={handleAddComment} className="mt-4 space-y-2">
              <label htmlFor="comment" className="sr-only">
                댓글 작성
              </label>
              <textarea
                id="comment"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                rows={3}
                maxLength={5000}
                placeholder="댓글을 입력하세요"
                className={inputClass}
              />
              <button type="submit" className={buttonClass.primary} disabled={busy || !commentText.trim()}>
                {busy ? '등록 중…' : '댓글 등록'}
              </button>
            </form>
          </section>
        </>
      )}
    </div>
  );
}
