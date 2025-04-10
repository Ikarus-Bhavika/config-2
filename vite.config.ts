import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
// https://vite.dev/config/
export default defineConfig({
  server:{
    allowedHosts:[
      "f456-2401-4900-1c6a-cbad-3cb5-67e5-7676-5cf1.ngrok-free.app"
    ]
  },
  plugins: [
    react(),
    tailwindcss()
  ],
})
