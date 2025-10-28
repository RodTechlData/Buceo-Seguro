import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      base: '/Buceo-Seguro/',
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [
        react({
          babel: {
            compact: true,
          }
        })
      ],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'global': 'window',
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      build: {
        outDir: 'dist',
        assetsDir: 'assets',
        emptyOutDir: true,
        sourcemap: false,
        minify: 'esbuild',
        target: 'es2015',
        rollupOptions: {
          output: {
            manualChunks: undefined,
          }
        }
      },
      esbuild: {
        logOverride: { 'this-is-undefined-in-esm': 'silent' }
      }
    };
});