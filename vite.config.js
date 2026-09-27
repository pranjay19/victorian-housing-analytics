import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    port: 3000,
    // CORS proxy — all /api/* requests are forwarded server-side to AWS API Gateway,
    // bypassing the browser's same-origin policy restriction completely.
    proxy: {
      '/api': {
        target: 'https://6annl8u42a.execute-api.ap-southeast-2.amazonaws.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/prod'),
        secure: true,
      }
    }
  }
})
