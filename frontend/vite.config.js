import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/teachers': {
        target: 'http://localhost:3000',
        changeOrigin: true
      },
      '/teacher-positions': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  }
})
