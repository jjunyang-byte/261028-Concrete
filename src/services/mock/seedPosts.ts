/**
 * [mock] 게시판 예시 글과 댓글입니다. (모두 가상의 예시입니다.)
 * 처음 접속했을 때 한 번만 브라우저 저장소에 채워집니다.
 */
import type { Category, Comment, Post } from '../types';
import { DEMO_UIDS } from './mockUsers';

const authors = [
  { uid: DEMO_UIDS.member, name: '이학생 (데모 학생)' },
  { uid: 'seed-member-2', name: '한도윤' },
];
const admin = { uid: DEMO_UIDS.admin, name: '김교수 (데모 관리자)' };

const researchTopics = [
  'UHPC 보 휨실험 결과 공유 — 하중-변위 곡선 해석',
  '말뚝 재하시험 데이터에서 침하량 보정 방법 질문',
  '하천 홍수량 산정 시 강우-유출 모형 선택 기준',
  '콘크리트 염해 확산계수 측정 결과 비교',
  '지반 액상화 평가 시 N값 보정 계수 논의',
  'FRP 보강 RC 기둥 해석 모델 검증',
  '교량 모니터링 가속도 데이터 노이즈 처리',
  '사면 안정 해석 결과 — 안전율 1.3 기준 적용 여부',
  '저수지 퇴사량 추정 방법 정리',
  '내진 보강 구조물 비선형 해석 수렴 문제',
  '터널 라이닝 균열 이미지 분석 결과',
  '도시 침수 시뮬레이션 격자 크기 민감도',
];
const courseTopics = [
  '구조역학 과제 3번 처짐 계산 질문',
  '토질역학 압밀 문제에서 Cv 단위',
  '수리학 개수로 비에너지 그래프 해석',
  '철근콘크리트 설계 중간고사 범위 문의',
  '구조역학 모멘트 분배법 예제 풀이 확인',
  '토질역학 실험 보고서 양식 질문',
  '수리학 과제 제출 형식 문의',
  '철근콘크리트 전단 설계 예제 질문',
];
const notices = [
  '[공지] 2026학년도 2학기 연구실 세미나 일정',
  '[공지] 실험실 안전교육 이수 안내',
  '[공지] 학회 발표 초록 마감일 안내',
];

export function buildSeed(): { posts: Post[]; comments: Comment[] } {
  const posts: Post[] = [];
  const base = new Date('2026-11-03T10:00:00').getTime();
  const HOUR = 3600_000;
  let i = 0;

  const push = (title: string, category: Category, author: { uid: string; name: string }) => {
    const createdAt = new Date(base - i * 13 * HOUR);
    posts.push({
      id: `seed-post-${i + 1}`,
      title,
      category,
      body:
        `${title}에 대한 예시 본문입니다.\n\n` +
        `이 글은 데모용으로 자동 생성된 가상의 글입니다.\n줄바꿈이 그대로 표시되는지 확인할 수 있습니다.`,
      authorUid: author.uid,
      authorName: author.name,
      createdAt,
      updatedAt: createdAt,
    });
    i++;
  };

  // 최신 글부터 섞어서 만듭니다.
  const maxLen = Math.max(researchTopics.length, courseTopics.length);
  for (let k = 0; k < maxLen; k++) {
    if (k < notices.length) push(notices[k], 'notice', admin);
    if (k < researchTopics.length) push(researchTopics[k], 'research', authors[k % 2]);
    if (k < courseTopics.length) push(courseTopics[k], 'course', authors[(k + 1) % 2]);
  }

  const comments: Comment[] = [];
  posts.slice(0, 6).forEach((p, idx) => {
    comments.push({
      id: `seed-comment-${idx}-a`,
      postId: p.id,
      body: '좋은 자료 감사합니다. 다음 미팅 때 같이 논의해 봐요.',
      authorUid: admin.uid,
      authorName: admin.name,
      createdAt: new Date(p.createdAt.getTime() + 2 * HOUR),
    });
    comments.push({
      id: `seed-comment-${idx}-b`,
      postId: p.id,
      body: '저도 비슷한 결과가 나왔습니다.\n데이터 공유 드릴게요.',
      authorUid: authors[1].uid,
      authorName: authors[1].name,
      createdAt: new Date(p.createdAt.getTime() + 3 * HOUR),
    });
  });

  return { posts, comments };
}
