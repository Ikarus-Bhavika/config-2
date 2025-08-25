import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
// https://vite.dev/config/
export default defineConfig({
  server:{
    allowedHosts:[
      "1c914ea67032.ngrok-free.app"
    ]
  },
  plugins: [
    react(),
    tailwindcss()
  ],
})
