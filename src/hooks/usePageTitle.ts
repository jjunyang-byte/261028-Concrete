import { useEffect } from 'react';
import { site } from '../data/site';

/** 브라우저 탭에 보이는 제목을 설정합니다. 예) usePageTitle('연구') → "연구 | 구조·지반 연구실" */
export function usePageTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} | ${site.labName}` : site.labName;
  }, [title]);
}
