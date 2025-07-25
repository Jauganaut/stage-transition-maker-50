import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  build: {
    outDir: "dist",
    assetsDir: "assets",
    // Enhanced security and obfuscation for production
    minify: mode === 'production' ? 'terser' : false,
    rollupOptions: {
      output: {
        // Obfuscate chunk names
        chunkFileNames: mode === 'production' ? 'assets/[hash].js' : 'assets/[name]-[hash].js',
        entryFileNames: mode === 'production' ? 'assets/[hash].js' : 'assets/[name]-[hash].js',
        assetFileNames: mode === 'production' ? 'assets/[hash].[ext]' : 'assets/[name]-[hash].[ext]',
        // Obfuscate variable names in production
        manualChunks: undefined,
      },
    },
    terserOptions: mode === 'production' ? {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
      mangle: {
        // Obfuscate all identifiers
        toplevel: true,
        properties: false,
      },
      format: {
        comments: false,
      },
    } : undefined,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
