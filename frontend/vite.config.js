import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '^/(auth|events|attendance|rewards|wallet|cashout|admin)': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
})

