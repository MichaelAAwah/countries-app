import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: './build'
  },
  server: {    
    // this ensures that the browser opens upon server start
    // open: true,
    // this sets a default port to 3000  
    port: 3003, 
  },
})
