import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const AWS_API_TARGET = 'https://6annl8u42a.execute-api.ap-southeast-2.amazonaws.com'

// Proxy rule reused for both dev server and preview server
const proxyConfig = {
  '/api': {
    target: AWS_API_TARGET,
    changeOrigin: true,
    // /api/housing  →  /prod/housing  on the AWS target (server-side, no CORS)
    rewrite: (path) => path.replace(/^\/api/, '/prod'),
    secure: true,
  }
}

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  // Dev server
  server: {
    port: 3000,
    proxy: proxyConfig,
  },
  // Preview server (npm run preview) — same proxy, avoids CORS on built files
  preview: {
    port: 4173,
    proxy: proxyConfig,
  },
})
