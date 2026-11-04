import { Link } from 'react-router';
import { usePageTitle } from '../hooks/usePageTitle';
import { buttonClass } from '../components/ui';

export function NotFoundPage() {
  usePageTitle('페이지를 찾을 수 없습니다');
  return (
    <div className="py-16 text-center">
      <p className="text-6xl font-bold text-blue-700 dark:text-blue-400">404</p>
      <h1 className="mt-4 text-2xl font-bold">페이지를 찾을 수 없습니다</h1>
      <p className="mt-2 text-slate-600 dark:text-slate-400">주소가 바뀌었거나 삭제된 페이지입니다.</p>
      <Link to="/" className={`${buttonClass.primary} mt-6`}>
        홈으로 가기
      </Link>
    </div>
  );
}
