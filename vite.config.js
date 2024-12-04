import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr';
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr(),
  ],
  // server: {
  //   host: '192.168.12.157', // Bind to all network interfaces
  //   port: 3000,       // Optional: specify the port (default is 5173)
  //   open: true,       // Optional: automatically open the browser
  // },
})