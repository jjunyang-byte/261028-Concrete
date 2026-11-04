/**
 * ─────────────────────────────────────────────
 *  논문 목록 (연구 페이지 하단, 연도별로 자동 정리됨)
 * ─────────────────────────────────────────────
 * ✏️ 수정 방법
 *  - { ... } 묶음 하나가 논문 하나입니다. 맨 위에 새 묶음을 추가하면 됩니다. (순서는 자동 정렬)
 *  - year: 숫자로 적습니다 (따옴표 없이). 예) year: 2026,
 *  - link: 논문 주소(DOI 등). 없으면 이 줄을 통째로 지우세요.
 *
 * ⚠️ 아래 논문들은 모두 가상의 "예시"이며 실제 논문이 아닙니다.
 */
export interface Publication {
  year: number;
  authors: string;
  title: string;
  journal: string;
  link?: string;
}

export const publications: Publication[] = [
  {
    year: 2026,
    authors: '이학생, 김토목',
    title: '초고성능 콘크리트 보의 휨 거동에 대한 실험적 연구 (예시)',
    journal: '한국콘크리트학회 논문집',
    link: 'https://example.org/paper-2026-1',
  },
  {
    year: 2026,
    authors: 'D. Han, T. Kim',
    title: 'Image-based crack detection for tunnel linings using deep learning (example)',
    journal: 'Journal of Example Infrastructure Engineering',
    link: 'https://example.org/paper-2026-2',
  },
  {
    year: 2025,
    authors: '한도윤, 박지반, 김토목',
    title: '액상화 가능 지반에 설치된 말뚝 기초의 동적 응답 해석 (예시)',
    journal: '한국지반공학회 논문집',
    link: 'https://example.org/paper-2025-1',
  },
  {
    year: 2025,
    authors: 'T. Kim, S. Lee',
    title: 'Climate-adaptive urban flood modeling with high-resolution rainfall data (example)',
    journal: 'Example Journal of Hydrology',
  },
  {
    year: 2024,
    authors: '김토목, 최수리',
    title: '저수지 퇴사량 추정을 위한 수치모형 비교 연구 (예시)',
    journal: '한국수자원학회 논문집',
    link: 'https://example.org/paper-2024-1',
  },
];
