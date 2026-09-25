import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const isDev = process.env.NODE_ENV !== 'production';

// Support Vercel deployment URLs and explicit environment variables
const vercelOrigin = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : null;

const CHECKOUT_ORIGIN =
  process.env.VITE_CHECKOUT_ORIGIN ||
  vercelOrigin ||
  (isDev ? 'http://localhost:5173' : 'https://sourabh-labs.dodo-demo.app');

const HOST_ORIGIN =
  process.env.VITE_HOST_ORIGIN ||
  vercelOrigin ||
  (isDev ? 'http://localhost:5173' : 'https://sourabh-labs.dodo-demo.app');

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true, // Fail if port is taken — don't silently bump — so the SDK origin always matches
  },
  define: {
    // Injected into CheckoutApp.tsx and any other source files
    __CHECKOUT_ORIGIN__: JSON.stringify(CHECKOUT_ORIGIN),
    __HOST_ORIGIN__: JSON.stringify(HOST_ORIGIN),
  },
});
