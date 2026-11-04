/**
 * 사이트의 주소(라우트) 목록입니다.
 * 게시판과 관리자 페이지는 RequireRole로 감싸서 권한을 확인합니다.
 */
import { BrowserRouter, Route, Routes } from 'react-router';
import { AuthProvider } from './auth/AuthContext';
import { RequireRole } from './auth/RequireRole';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { ResearchPage } from './pages/ResearchPage';
import { CoursesPage } from './pages/CoursesPage';
import { CourseDetailPage } from './pages/CourseDetailPage';
import { MembersPage } from './pages/MembersPage';
import { DiscussionListPage } from './pages/discussion/DiscussionListPage';
import { NewPostPage } from './pages/discussion/NewPostPage';
import { PostDetailPage } from './pages/discussion/PostDetailPage';
import { EditPostPage } from './pages/discussion/EditPostPage';
import { AdminPage } from './pages/AdminPage';
import { NotFoundPage } from './pages/NotFoundPage';
import type { ReactNode } from 'react';

/** 게시판: 승인된 구성원(member)과 관리자(admin)만 */
const Board = ({ children }: { children: ReactNode }) => (
  <RequireRole roles={['member', 'admin']}>{children}</RequireRole>
);

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            {/* 공개 페이지 */}
            <Route index element={<HomePage />} />
            <Route path="research" element={<ResearchPage />} />
            <Route path="courses" element={<CoursesPage />} />
            <Route path="courses/:courseId" element={<CourseDetailPage />} />
            <Route path="members" element={<MembersPage />} />

            {/* 구성원 전용 */}
            <Route path="discussion" element={<Board><DiscussionListPage /></Board>} />
            <Route path="discussion/new" element={<Board><NewPostPage /></Board>} />
            <Route path="discussion/:postId" element={<Board><PostDetailPage /></Board>} />
            <Route path="discussion/:postId/edit" element={<Board><EditPostPage /></Board>} />

            {/* 관리자 전용 */}
            <Route path="admin" element={<RequireRole roles={['admin']}><AdminPage /></RequireRole>} />

            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
