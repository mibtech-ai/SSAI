import { defineConfig } from 'vite'

export default defineConfig({
  root: 'public',
  build: {
    outDir: '../dist',
    emptyOutDir: true
  },
  server: {
    port: 8888,
    proxy: {
      '/mcp': {
        target: 'http://localhost:8888/.netlify/functions',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/mcp/, '/express-mcp-server')
      }
    }
  }
})