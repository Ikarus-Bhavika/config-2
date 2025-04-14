import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
// https://vite.dev/config/
export default defineConfig({
  server:{
    allowedHosts:[
      "034e-2401-4900-1c6f-d8b1-604d-3d6b-f867-8be.ngrok-free.app"
    ]
  },
  plugins: [
    react(),
    tailwindcss()
  ],
})
