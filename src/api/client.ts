export type HttpClient = ReturnType<typeof httpClient>;

export function httpClient({baseURL, timeoutMs = 15_000}: { baseURL: string; timeoutMs?: number; }) {
  async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
    console.warn(`HTTP ${init.method || 'GET'} ${baseURL + path}`);
    const ctrl = new AbortController();
    const id = setTimeout(() => ctrl.abort(), timeoutMs);
    try {
      const res = await fetch(baseURL + path, {
        ...init,
        signal: ctrl.signal,
        headers: {'Content-Type': 'application/json', ...(init.headers || {})}
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const ct = res.headers.get('content-type') || '';
      if (ct.includes('application/json')) return (await res.json()) as T;
      return undefined as unknown as T;
    } finally {
      clearTimeout(id);
    }
  }

  return {
    get: <T>(p: string) => request<T>(p),
    post: <T>(p: string, body?: unknown) => request<T>(p, {method: 'POST', body: JSON.stringify(body)}),
  };
}