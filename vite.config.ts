import { defineConfig } from 'vite';
import path from 'path';
import react from '@vitejs/plugin-react-swc';

const createConfig = (outDir: string) => ({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src/renderer/src'),
    },
  },
  root: path.join(__dirname, 'src/renderer'),
  publicDir: path.join(__dirname, 'src/renderer/public'),
  base: './',
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // Flask、Node、等 TTS 配置服务
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      '/voice': {
        target: 'http://172.31.0.203:9885', // GPT-SoVITS 后端服务
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/voice/, ''),
      },
    },
  },
  build: {
    outDir: path.join(__dirname, outDir),
    emptyOutDir: true,
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        main: path.join(__dirname, 'src/renderer/index.html'),
      },
    },
  },
});

export default defineConfig(({ mode }) => {
  if (mode === 'web') {
    return createConfig('dist/web');
  }
  return createConfig('dist/renderer');
});
