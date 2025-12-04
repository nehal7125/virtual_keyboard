import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const isExtension = process.env.BUILD_TARGET === 'extension';
  
  if (isExtension) {
    // Extension build configuration
    return {
      plugins: [react()],
      build: {
        outDir: 'dist',
        rollupOptions: {
          input: resolve(__dirname, 'src/main-extension.tsx'),
          output: {
            entryFileNames: 'keyboard.js',
            chunkFileNames: 'assets/[name]-[hash].js',
            assetFileNames: 'assets/[name]-[hash].[ext]',
            format: 'es',
          },
        },
      },
      resolve: {
        alias: {
          '@': resolve(__dirname, 'src'),
        },
      },
    };
  }
  
  // Regular build configuration
  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
      },
    },
  };
})
