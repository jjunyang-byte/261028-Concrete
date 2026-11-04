import { useNavigate } from 'react-router';
import { discussionService } from '../../services';
import { usePageTitle } from '../../hooks/usePageTitle';
import { Page } from '../../components/ui';
import { PostForm } from './PostForm';

export function NewPostPage() {
  usePageTitle('글쓰기');
  const navigate = useNavigate();
  return (
    <Page compact narrow eyebrow="Discussion" title="글쓰기">
      <PostForm
        submitLabel="등록"
        onCancel={() => navigate('/discussion')}
        onSubmit={async (values) => {
          const id = await discussionService.createPost(values);
          navigate(`/discussion/${id}`, { replace: true });
        }}
      />
    </Page>
  );
}
