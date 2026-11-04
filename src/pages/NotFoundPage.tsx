import { Link } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { usePageTitle } from '../hooks/usePageTitle';
import { buttonClass, Container } from '../components/ui';

export function NotFoundPage() {
  usePageTitle('페이지를 찾을 수 없습니다');
  return (
    <Container className="animate-fade-up py-24 text-center sm:py-32">
      <p className="bg-linear-to-br from-brand-400 to-brand-800 bg-clip-text font-mono text-8xl font-bold tracking-tight text-transparent">
        404
      </p>
      <h1 className="mt-6 text-2xl font-bold tracking-tight sm:text-3xl">페이지를 찾을 수 없습니다</h1>
      <p className="mt-3 text-slate-600 dark:text-slate-400">주소가 바뀌었거나 삭제된 페이지입니다.</p>
      <Link to="/" className={`${buttonClass.primary} mt-8`}>
        <ArrowLeft className="h-4 w-4" /> 홈으로 가기
      </Link>
    </Container>
  );
}
