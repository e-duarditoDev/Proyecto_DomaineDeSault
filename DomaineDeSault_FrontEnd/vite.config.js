import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

//intermediario para comunicar con la API Login, auth coincide con la @RequestMappgin de la clase restController
  server: {
  proxy: {
    '/auth': {
      target: 'http://localhost:8082',
      changeOrigin: true
    }
  }
}


})


