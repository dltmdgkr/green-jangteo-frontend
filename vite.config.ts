// // import { defineConfig } from 'vite';
// // import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   define: {
//     global: {},
//   },
// });

// // import { defineConfig } from 'vite';
// // import react from '@vitejs/plugin-react-swc';

// // export default defineConfig({
// //   server: {
// //     proxy: {
// //       '/api': 'https://43.202.197.58:8443',
// //     },
// //   },
// //   plugins: [react()],
// // });

// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   build: {
//     target: 'esnext',
//   },
//   optimizeDeps: {
//     exclude: ['js-big-decimal'],
//   },
//   // server: {
//   //   proxy: {
//   //     '/api': {
//   //       target: 'https://43.202.197.58:8443',
//   //       changeOrigin: true,
//   //       rewrite: path => path.replace(/^\/api/, ''),
//   //       secure: false,
//   //       ws: true,
//   //     },
//   //   },
//   // },
//   define: {
//     global: {},
//   },
// });

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    global: {},
  },

  // is not a constructor를 위해 추가한 코드
  build: {
    commonjsOptions: { include: [] },
  },
  optimizeDeps: {
    disabled: false,
  },
});
