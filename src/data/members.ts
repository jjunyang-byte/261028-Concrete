/**
 * ─────────────────────────────────────────────
 *  구성원 (구성원 페이지)
 * ─────────────────────────────────────────────
 * ✏️ 수정 방법
 *  - { ... } 묶음 하나가 한 사람입니다.
 *  - group: 아래 넷 중 하나를 정확히 적으세요.
 *        'professor' (교수) / 'phd' (박사과정) / 'master' (석사과정) / 'alumni' (졸업생)
 *  - 학생이 졸업하면 group을 'alumni'로 바꾸고 note에 진로를 적으면 됩니다.
 *  - email, note는 없으면 그 줄을 지워도 됩니다.
 *
 * ⚠️ 아래 인물은 모두 가상의 "예시"입니다.
 */
export type MemberGroup = 'professor' | 'phd' | 'master' | 'alumni';

export interface Member {
  name: string;
  group: MemberGroup;
  /** 연구 주제 또는 직위 */
  topic: string;
  email?: string;
  /** 입학년도, 졸업 후 진로 등 */
  note?: string;
}

export const groupLabels: Record<MemberGroup, string> = {
  professor: '교수',
  phd: '박사과정',
  master: '석사과정',
  alumni: '졸업생',
};

export const members: Member[] = [
  { name: '김토목', group: 'professor', topic: '구조·지반공학', email: 'tomok.kim@example.ac.kr', note: '연구실 책임교수' },
  { name: '이학생', group: 'phd', topic: 'UHPC 보의 휨 거동', email: 'student1@example.ac.kr', note: '2023년 입학' },
  { name: '한도윤', group: 'phd', topic: '영상 기반 터널 균열 탐지', email: 'student2@example.ac.kr', note: '2024년 입학' },
  { name: '박지반', group: 'master', topic: '액상화 지반 말뚝 거동', note: '2025년 입학' },
  { name: '최수리', group: 'master', topic: '도시 홍수 모델링', note: '2025년 입학' },
  { name: '정구조', group: 'alumni', topic: 'FRP 보강 RC 기둥', note: '2024년 박사 졸업 · ○○건설 연구소' },
  { name: '오교량', group: 'alumni', topic: '교량 모니터링', note: '2023년 석사 졸업 · ○○엔지니어링' },
];
