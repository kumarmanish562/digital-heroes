const ACCESS_TOKEN_KEY = "digital_heroes_access_token";
const USER_KEY = "digital_heroes_user";

export const tokenStore = {
  get(): string | null {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  },
  set(token: string) {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
  },
  clear() {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
  }
};

export const userStore = {
  get<T>(): T | null {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  },
  set<T>(user: T) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },
  clear() {
    localStorage.removeItem(USER_KEY);
  }
};
