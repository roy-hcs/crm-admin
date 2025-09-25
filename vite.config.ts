import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    // 允许通过局域网 IP 访问：host:true 等价于 0.0.0.0
    host: true, // 或写成 '0.0.0.0'
    port: 5173,
    // 端口被占用时不自动递增，方便固定访问地址
    strictPort: true,
    // 如需手机调试 HMR 更稳定，可按需开启以下（默认即可工作）
    // hmr: { host: '0.0.0.0', port: 5173 },
    proxy: {
      '/api': {
        target: 'http://admin-1.hcs55.com:38080',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, ''),
      },
    },
  },
});
