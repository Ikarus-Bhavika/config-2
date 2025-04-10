import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
// https://vite.dev/config/
export default defineConfig({
  server:{
    allowedHosts:[
      "2e3e-2401-4900-1c6a-88d3-1533-1b09-7afe-2357.ngrok-free.app"
    ]
  },
  plugins: [
    react(),
    tailwindcss()
  ],
})
