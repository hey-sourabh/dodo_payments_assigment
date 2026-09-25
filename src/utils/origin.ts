export function resolveHostOrigin(): string {
  if (typeof window === 'undefined') return 'http://localhost:5173';

  const params = new URLSearchParams(window.location.search);
  const hostParam = params.get('hostOrigin');

  if (hostParam) {
    try {
      const parsed = new URL(hostParam);
      const isTrustedOrigin =
        parsed.origin === window.location.origin ||
        parsed.hostname === 'localhost' ||
        parsed.hostname === '127.0.0.1' ||
        parsed.hostname.endsWith('.vercel.app') ||
        (typeof __HOST_ORIGIN__ !== 'undefined' && parsed.origin === __HOST_ORIGIN__);

      if (isTrustedOrigin) return parsed.origin;
    } catch {
      // invalid URL param — fall through
    }
  }

  const isVercelOrLocal =
    window.location.hostname.endsWith('.vercel.app') ||
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1';

  if (isVercelOrLocal) return window.location.origin;

  return typeof __HOST_ORIGIN__ !== 'undefined' ? __HOST_ORIGIN__ : 'http://localhost:5173';
}

declare const __HOST_ORIGIN__: string;
