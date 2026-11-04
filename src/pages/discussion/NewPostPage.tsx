import { useNavigate } from 'react-router';
import { discussionService } from '../../services';
import { usePageTitle } from '../../hooks/usePageTitle';
import { PageHeader } from '../../components/ui';
import { PostForm } from './PostForm';

export function NewPostPage() {
  usePageTitle('글쓰기');
  const navigate = useNavigate();
  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="글쓰기" />
      <PostForm
        submitLabel="등록"
        onCancel={() => navigate('/discussion')}
        onSubmit={async (values) => {
          const id = await discussionService.createPost(values);
          navigate(`/discussion/${id}`, { replace: true });
        }}
      />
    </div>
  );
}
