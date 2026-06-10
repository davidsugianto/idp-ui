import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

const oidcIssuer = process.env.VITE_OIDC_ISSUER || 'http://localhost:8081/realms/idp-core';
const externalOrigin = new URL(oidcIssuer).origin;

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: process.env.VITE_API_BASE_URL || 'http://localhost:8989',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        configure: (proxy) => {
          proxy.on('proxyRes', (proxyRes) => {
            if (proxyRes.statusCode === 302 || proxyRes.statusCode === 301) {
              const location = proxyRes.headers.location;
              if (location && location.includes('keycloak')) {
                proxyRes.headers.location = location.replace(
                  /^https?:\/\/[^/]+/,
                  externalOrigin,
                );
              }
            }
          });
        },
      },
      '/ws': {
        target: process.env.VITE_WS_BASE_URL || 'ws://localhost:8989',
        ws: true,
      },
    },
  },
  preview: {
    port: 3089,
  },
});