import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { canModify, discussionService, type Post } from '../../services';
import { useAuth } from '../../auth/useAuth';
import { usePageTitle } from '../../hooks/usePageTitle';
import { Container, ErrorMessage, errorText, Page, Spinner } from '../../components/ui';
import { PostForm } from './PostForm';
import { NotFoundPage } from '../NotFoundPage';

export function EditPostPage() {
  usePageTitle('글 수정');
  const { postId = '' } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null | undefined>(undefined);
  const [error, setError] = useState('');

  useEffect(() => {
    discussionService
      .getPost(postId)
      .then(setPost)
      .catch((e) => setError(errorText(e)));
  }, [postId]);

  if (error) return <Container className="py-12"><ErrorMessage message={error} /></Container>;
  if (post === undefined) return <Spinner />;
  if (post === null) return <NotFoundPage />;
  if (!canModify(user, post))
    return (
      <Container className="py-12">
        <ErrorMessage message="본인 글만 수정할 수 있습니다." />
      </Container>
    );

  return (
    <Page compact narrow eyebrow="Discussion" title="글 수정">
      <PostForm
        initial={{ title: post.title, body: post.body, category: post.category }}
        submitLabel="저장"
        onCancel={() => navigate(`/discussion/${post.id}`)}
        onSubmit={async (values) => {
          await discussionService.updatePost(post.id, values);
          navigate(`/discussion/${post.id}`, { replace: true });
        }}
      />
    </Page>
  );
}
