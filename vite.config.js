import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: '0.0.0.0',
    strictPort: true,
    
    // ¡AGREGA ESTA LÍNEA!s
    allowedHosts: [
      'enlaces.cooperativataulabe.hn',
      'localhost',
      '10.0.100.71',
      '127.0.0.1',
      // Agrega también la IP de tu servidor si accedes por IP
    ],
    
    // Opcional: Configuración para HMR (Hot Module Replacement)
    hmr: {
      host: 'localhost',
      protocol: 'ws'
    }
  }
})