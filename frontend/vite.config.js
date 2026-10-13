import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Matches the origin already whitelisted in the backend's CORS config
  // (see backend/api.py) so we don't need to touch the shared backend code.
  server: {
    port: 3000,
  },
})
