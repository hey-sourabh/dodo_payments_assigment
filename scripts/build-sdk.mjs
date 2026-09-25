import esbuild from 'esbuild';

const isProd = process.argv.includes('--prod');

const CHECKOUT_ORIGIN = isProd
  ? 'https://checkout.dodo-demo.app'
  : 'http://localhost:5173';

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
