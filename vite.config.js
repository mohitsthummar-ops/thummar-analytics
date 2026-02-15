import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate recharts into its own chunk (large charting library)
          'vendor-recharts': ['recharts'],
          // Separate framer-motion into its own chunk (animations)
          'vendor-motion': ['framer-motion'],
          // Group react core libraries together
          'vendor-react': ['react', 'react-dom', 'zustand'],
          // Group icons together
          'vendor-icons': ['@heroicons/react']
        }
      }
    },
    // Optional: Increase chunk size warning limit as fallback
    chunkSizeWarningLimit: 600
  }
})
