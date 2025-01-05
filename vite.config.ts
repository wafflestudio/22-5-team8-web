import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://d1xtmfti6ypide.cloudfront.net',
        changeOrigin: true,
      },
    },
  },
});
