import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Cargar variables del entorno .env
  const env = loadEnv(mode, process.cwd(), '');

  return {
    // ✅ Clave para GitHub Pages
    base: '/Buceo-Seguro/',

    server: {
      port: 3000,
      host: '0.0.0.0',
      open: true,
    },

    plugins: [
      react({
        babel: {
          compact: true,
        },
        fastRefresh: false, // evita eval() bloqueado por CSP
      }),
    ],

    define: {
      'process.env.API_KEY': JSON.stringify(env.API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      global: 'window',
    },

    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },

    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      emptyOutDir: true,
      sourcemap: false, // evita eval() en producción
      minify: 'esbuild',
      target: 'es2015',
      cssCodeSplit: false,
      rollupOptions: {
        output: {
          // ✅ garantiza rutas relativas correctas
          assetFileNames: 'assets/[name][extname]',
          chunkFileNames: 'assets/[name].js',
          entryFileNames: 'assets/[name].js',
        },
      },
    },

    esbuild: {
      logOverride: { 'this-is-undefined-in-esm': 'silent' },
    },
  };
});
