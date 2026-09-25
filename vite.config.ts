import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const isDev = process.env.NODE_ENV !== 'production';

// In dev both apps run on the same Vite server (localhost:5173).
// In production the checkout app would be deployed to a separate domain.
const CHECKOUT_ORIGIN = isDev
  ? 'http://localhost:5173'
  : 'https://checkout.dodo-demo.app';

const HOST_ORIGIN = isDev
  ? 'http://localhost:5173'
  : 'https://acme-store.dodo-demo.app';

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
