import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Base path for GitHub Pages - use repo name or '/' for custom domain
  base: process.env.GITHUB_PAGES === 'true' ? '/FX/' : '/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      // Polyfill Node.js modules for browser
      buffer: 'buffer/',
      stream: 'stream-browserify',
      util: 'util/',
    },
  },
  define: {
    // Polyfill global and process for browser
    global: 'globalThis',
    'process.env': {},
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'chart-vendor': ['plotly.js', 'react-plotly.js', 'recharts'],
          'animation-vendor': ['framer-motion'],
        },
      },
    },
  },
  optimizeDeps: {
    include: ['plotly.js', 'react-plotly.js', 'buffer', 'process'],
    esbuildOptions: {
      // Node.js global to browser globalThis
      define: {
        global: 'globalThis'
      },
    },
  },
})
