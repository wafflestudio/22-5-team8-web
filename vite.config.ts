import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://d2vsqxcvld4zf7.cloudfront.net/api',
        changeOrigin: true,
      },
    },
  },
});