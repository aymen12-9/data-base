export interface RuntimeConfig {
  VITE_API_URL?: string;
}

export async function loadRuntimeConfig(): Promise<RuntimeConfig> {
  try {
    const res = await fetch('/config.json', { cache: 'no-store' });
    if (!res.ok) return {};
    const data = await res.json();
    // Expose on window for other modules
    (window as any).__RUNTIME_CONFIG__ = data;
    return data;
  } catch (err) {
    // If fetch fails, just fall back to import.meta.env
    return {};
  }
}

export function getRuntimeApiUrl(): string {
  const cfg = (window as any).__RUNTIME_CONFIG__ || {};
  return cfg.VITE_API_URL || import.meta.env.VITE_API_URL || '';
}
