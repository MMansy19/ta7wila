import { getCookie } from 'cookies-next';

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return getCookie("token") as string | null;
}

export function isAuthenticated(): boolean {
  const token = getToken();
  return !!token && token.length > 0;
}

export function clearAuth(): void {
  if (typeof window !== 'undefined') {
    document.cookie = 'token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  }
}
