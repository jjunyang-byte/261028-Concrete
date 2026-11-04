import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { ArrowLeft, MessageCircle, Pencil, Trash2 } from 'lucide-react';
import { canModify, discussionService, type Comment, type Post } from '../../services';
import { useAuth } from '../../auth/useAuth';
import { usePageTitle } from '../../hooks/usePageTitle';
import {
  Avatar,
  buttonClass,
  Card,
  CategoryBadge,
  Container,
  ErrorMessage,
  errorText,
  formatDateTime,
  inputClass,
  Page,
  Spinner,
} from '../../components/ui';
import { NotFoundPage } from '../NotFoundPage';

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

  if (post === null) return <NotFoundPage />;
  if (!post) {
    return <Container className="py-12">{error ? <ErrorMessage message={error} /> : <Spinner />}</Container>;
  }

  return (
    <Page
      compact
      narrow
      eyebrow={<CategoryBadge category={post.category} />}
      title={post.title}
      description={
        <span className="flex items-center gap-2 text-sm">
          <Avatar name={post.authorName} size="sm" />
          <span className="font-medium text-white">{post.authorName}</span>
          <span className="text-brand-200/60">·</span>
          <span>{formatDateTime(post.createdAt)}</span>
          {post.updatedAt.getTime() !== post.createdAt.getTime() && <span className="text-brand-200/60">(수정됨)</span>}
        </span>
      }
    >
      <Link
        to="/discussion"
        className="mb-6 inline-flex items-center gap-1 text-sm font-medium text-slate-500 transition hover:text-brand-700 dark:hover:text-brand-300"
      >
        <ArrowLeft className="h-4 w-4" /> 목록으로
      </Link>

      {error && <ErrorMessage message={error} />}

      <Card className="sm:p-8">
        {/* 본문은 일반 텍스트로만 표시합니다. HTML로 해석하지 않으므로 안전합니다. */}
        <article className="text-[16px] leading-[1.85] break-words whitespace-pre-wrap text-slate-800 dark:text-slate-200">
          {post.body}
        </article>

        {canModify(user, post) && (
          <div className="mt-8 flex justify-end gap-2 border-t border-slate-100 pt-6 dark:border-slate-800">
            <Link to={`/discussion/${post.id}/edit`} className={buttonClass.secondary}>
              <Pencil className="h-4 w-4" /> 수정
            </Link>
            <button onClick={handleDeletePost} className={buttonClass.danger}>
              <Trash2 className="h-4 w-4" /> 삭제
            </button>
          </div>
        )}
      </Card>

      <section className="mt-12">
        <h2 className="mb-5 flex items-center gap-2 text-lg font-bold tracking-tight">
          <MessageCircle className="h-5 w-5 text-brand-600 dark:text-brand-400" />
          댓글 {comments.length}
        </h2>

        {comments.length > 0 && (
          <ul className="mb-6 space-y-4">
            {comments.map((c) => (
              <li key={c.id} className="flex gap-3">
                <Avatar name={c.authorName} size="sm" />
                <div className="min-w-0 flex-1 rounded-2xl rounded-tl-sm border border-slate-200/80 bg-white px-5 py-4 dark:border-slate-800 dark:bg-slate-900">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm">
                      <span className="font-semibold">{c.authorName}</span>
                      <span className="ml-2 text-xs text-slate-400">{formatDateTime(c.createdAt)}</span>
                    </p>
                    {canModify(user, c) && (
                      <button
                        onClick={() => handleDeleteComment(c)}
                        className="-mt-1 -mr-2 rounded-lg p-1.5 text-slate-400 transition hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950"
                        aria-label="댓글 삭제"
                        title="댓글 삭제"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  <p className="mt-1.5 text-[15px] leading-relaxed break-words whitespace-pre-wrap text-slate-700 dark:text-slate-300">
                    {c.body}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}

        <form onSubmit={handleAddComment} className="flex gap-3">
          {user && <Avatar name={user.displayName} size="sm" />}
          <div className="flex-1 space-y-3">
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
            <div className="flex justify-end">
              <button type="submit" className={buttonClass.primary} disabled={busy || !commentText.trim()}>
                {busy ? '등록 중…' : '댓글 등록'}
              </button>
            </div>
          </div>
        </form>
      </section>
    </Page>
  );
}
