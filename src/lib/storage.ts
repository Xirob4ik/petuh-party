// localStorage может быть недоступен (приватный режим, запреты) — не падаем.
const mem = new Map<string, string>();

function get(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return mem.get(key) ?? null;
  }
}

function set(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    mem.set(key, value);
  }
}

export const storage = {
  get,
  set,
  getJSON<T>(key: string): T | null {
    const raw = get(key);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  },
  setJSON(key: string, value: unknown) {
    set(key, JSON.stringify(value));
  },
};
