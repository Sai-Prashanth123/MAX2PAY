import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Bundle analyzer - generates stats.html after build
    visualizer({
      filename: './dist/stats.html',
      open: false,
      gzipSize: true,
      brotliSize: true,
    })
  ],
  build: {
    sourcemap: false,
    rollupOptions: {
      // Load heavy libraries from CDN instead of bundling them
      external: ['tesseract.js', 'xlsx', '@ericblade/quagga2'],
      output: {
        globals: {
          'tesseract.js': 'Tesseract',
          'xlsx': 'XLSX',
          '@ericblade/quagga2': 'Quagga',
        },
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['lucide-react', 'recharts'],
          'supabase': ['@supabase/supabase-js'],
          'pdf': ['jspdf', 'jspdf-autotable'],
          'utils': ['axios', 'date-fns'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
  },
})
