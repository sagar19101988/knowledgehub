import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  build: {
    rollupOptions: {
      output: {
        // Split vendor libraries and content into separate cached chunks
        manualChunks: (id: string) => {
          // Firebase SDKs
          if (id.includes('firebase')) return 'vendor-firebase';
          // Framer Motion
          if (id.includes('framer-motion')) return 'vendor-motion';
          // React ecosystem
          if (id.includes('react-dom') || id.includes('react-router')) return 'vendor-react';
          // Zustand
          if (id.includes('zustand')) return 'vendor-zustand';
          // Content data files — heaviest, split from app logic
          if (id.includes('src/data/analogies')) return 'content-analogies';
          if (id.includes('src/data/quizzes'))   return 'content-quizzes';
        },
      },
    },
    // Raise the warning threshold so the console stays clean
    chunkSizeWarningLimit: 600,
  },
})
