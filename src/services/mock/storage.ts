/**
 * localStorage(브라우저 저장소)를 다루는 작은 도우미입니다. mock 구현 전용입니다.
 * 데이터는 "이 브라우저"에만 저장되므로, 다른 사람과 공유되지 않습니다.
 * (실제 공유 저장은 Phase 2의 Firebase에서 이뤄집니다.)
 */

const PREFIX = 'civil-lab-demo:';

/** 날짜(Date)는 JSON으로 저장할 수 없으므로 문자열로 바꿔 저장하고, 읽을 때 되돌립니다. */
const DATE_KEYS = new Set(['createdAt', 'updatedAt']);

export function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    if (raw == null) return fallback;
    return JSON.parse(raw, (k, v) => (DATE_KEYS.has(k) && typeof v === 'string' ? new Date(v) : v)) as T;
  } catch {
    return fallback;
  }
}

export function writeJSON(key: string, value: unknown): void {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    // 저장 공간이 꽉 찼거나 사생활 보호 모드인 경우 — 조용히 무시합니다.
  }
}

/** 데모 데이터를 모두 지웁니다. (다음 접속 때 예시 데이터가 다시 채워집니다.) */
export function clearAll(): void {
  try {
    Object.keys(localStorage)
      .filter((k) => k.startsWith(PREFIX))
      .forEach((k) => localStorage.removeItem(k));
  } catch {
    /* 무시 */
  }
}

export function newId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

/** 실제 서버처럼 약간의 지연을 흉내 냅니다. */
export function delay(ms = 150): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}
