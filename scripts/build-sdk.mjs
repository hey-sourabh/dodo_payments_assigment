import esbuild from 'esbuild';

const isProd = process.argv.includes('--prod');

// Allow Vercel or environment override, falling back to local dev or production domain
const CHECKOUT_ORIGIN =
  process.env.VITE_CHECKOUT_ORIGIN ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : null) ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null) ||
  (isProd ? 'https://sourabh-labs.dodo-demo.app' : 'http://localhost:5173');

await esbuild.build({
  entryPoints: ['src/sdk.ts'],
  bundle: true,
  outfile: 'public/sdk.js',
  format: 'iife',
  minify: isProd,
  define: {
    __CHECKOUT_ORIGIN__: JSON.stringify(CHECKOUT_ORIGIN),
  },
});

console.log(`SDK built → public/sdk.js  [CHECKOUT_ORIGIN=${CHECKOUT_ORIGIN}]`);
