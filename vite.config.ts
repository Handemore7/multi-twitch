import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Allow dynamic base for GitHub Pages (project pages under /repo-name/)
const base = process.env.BASE_PATH || '/'

export default defineConfig({
  base,
  plugins: [react()],
})
