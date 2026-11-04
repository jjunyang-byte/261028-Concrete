/**
 * ─────────────────────────────────────────────
 *  수업 자료 (수업 자료 페이지 + 과목 상세 페이지)
 * ─────────────────────────────────────────────
 * ✏️ 수정 방법
 *  - { ... } 묶음 하나가 과목 하나입니다.
 *  - id: 주소에 쓰이는 영문 이름입니다. (예: 'structural-analysis' → /courses/structural-analysis)
 *        영문 소문자·숫자·하이픈(-)만 쓰고, 과목끼리 겹치지 않게 하세요.
 *  - weeks: 주차별 자료입니다. 자료 파일은 Google Drive 등에 올린 뒤
 *           "링크가 있는 모든 사용자" 공유로 설정하고 그 주소를 url에 붙여넣으세요.
 *           (이 사이트에는 파일을 직접 올릴 수 없습니다.)
 *  - 자료가 없는 주차는 materials: [] 로 두면 됩니다.
 *
 * ⚠️ 아래 과목과 링크는 모두 가상의 "예시"입니다.
 */
export interface Material {
  label: string;
  url: string;
}
export interface Week {
  week: number;
  topic: string;
  materials: Material[];
}
export interface Course {
  id: string;
  title: string;
  code: string;
  semester: string;
  level: '학부' | '대학원';
  overview: string;
  weeks: Week[];
}

export const courses: Course[] = [
  {
    id: 'structural-analysis',
    title: '구조역학',
    code: 'CE201',
    semester: '2026년 2학기',
    level: '학부',
    overview: '정정 및 부정정 구조물의 해석 원리를 배웁니다. 보·트러스·라멘의 반력, 단면력, 처짐을 구하는 방법을 다룹니다.',
    weeks: [
      { week: 1, topic: '강의 소개 및 정역학 복습', materials: [{ label: '강의자료', url: 'https://drive.google.com/example-ce201-w1' }] },
      { week: 2, topic: '보의 반력과 단면력', materials: [{ label: '강의자료', url: 'https://drive.google.com/example-ce201-w2' }, { label: '과제 1', url: 'https://drive.google.com/example-ce201-hw1' }] },
      { week: 3, topic: '트러스 해석', materials: [{ label: '강의자료', url: 'https://drive.google.com/example-ce201-w3' }] },
      { week: 4, topic: '처짐 — 이중적분법', materials: [{ label: '강의자료', url: 'https://drive.google.com/example-ce201-w4' }] },
      { week: 5, topic: '처짐 — 모멘트 면적법', materials: [] },
      { week: 6, topic: '부정정 구조물과 모멘트 분배법', materials: [] },
    ],
  },
  {
    id: 'soil-mechanics',
    title: '토질역학',
    code: 'CE305',
    semester: '2026년 2학기',
    level: '학부',
    overview: '흙의 기본 성질, 유효응력, 투수, 압밀, 전단강도를 학습하고 실험을 통해 이해를 높입니다.',
    weeks: [
      { week: 1, topic: '흙의 기본 성질과 분류', materials: [{ label: '강의자료', url: 'https://drive.google.com/example-ce305-w1' }] },
      { week: 2, topic: '유효응력의 원리', materials: [{ label: '강의자료', url: 'https://drive.google.com/example-ce305-w2' }] },
      { week: 3, topic: '투수와 침투', materials: [{ label: '강의자료', url: 'https://drive.google.com/example-ce305-w3' }, { label: '실험 안내', url: 'https://drive.google.com/example-ce305-lab1' }] },
      { week: 4, topic: '압밀 이론', materials: [] },
    ],
  },
  {
    id: 'advanced-concrete',
    title: '고급 콘크리트 구조 (대학원)',
    code: 'CE601',
    semester: '2026년 1학기',
    level: '대학원',
    overview: '고성능 콘크리트의 재료 특성과 구조 거동, 비선형 유한요소해석 기법을 다룹니다. 논문 발표와 토론 중심으로 진행합니다.',
    weeks: [
      { week: 1, topic: '고성능 콘크리트 개요', materials: [{ label: '강의자료', url: 'https://drive.google.com/example-ce601-w1' }] },
      { week: 2, topic: '재료 구성 모델', materials: [{ label: '강의자료', url: 'https://drive.google.com/example-ce601-w2' }, { label: '읽기 자료', url: 'https://drive.google.com/example-ce601-r1' }] },
      { week: 3, topic: '비선형 FEM 실습', materials: [{ label: '실습 파일', url: 'https://drive.google.com/example-ce601-w3' }] },
    ],
  },
];
