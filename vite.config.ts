import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import {defineConfig, Plugin} from 'vite';
import {VitePWA} from 'vite-plugin-pwa';

function heroAssetPlugin(): Plugin {
  return {
    name: 'hero-asset-handler',
    configureServer(server) {
      server.middlewares.use('/api/upload-hero', (req, res) => {
        if (req.method === 'POST') {
          let body = '';
          req.on('data', chunk => {
            body += chunk;
          });
          req.on('end', () => {
            try {
              const { data } = JSON.parse(body);
              const base64Data = data.replace(/^data:image\/\w+;base64,/, '');
              const buffer = Buffer.from(base64Data, 'base64');
              const assetsDir = path.resolve(__dirname, 'public/assets');
              const imagesDir = path.resolve(__dirname, 'public/images');
              if (!fs.existsSync(assetsDir)) fs.mkdirSync(assetsDir, { recursive: true });
              if (!fs.existsSync(imagesDir)) fs.mkdirSync(imagesDir, { recursive: true });
              fs.writeFileSync(path.join(assetsDir, 'kamal-hero.png'), buffer);
              fs.writeFileSync(path.join(assetsDir, 'kamal-hero.jpg'), buffer);
              fs.writeFileSync(path.join(imagesDir, 'kamal-hero.png'), buffer);
              fs.writeFileSync(path.join(imagesDir, 'hero-lifestyle.jpg'), buffer);
              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ success: true }));
            } catch (err: any) {
              res.writeHead(500, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: err.message }));
            }
          });
        } else {
          res.writeHead(405);
          res.end();
        }
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [
      heroAssetPlugin(),
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['icon.svg', 'apple-touch-icon.png', 'pwa-192x192.png', 'pwa-512x512.png'],
        manifest: {
          id: '/',
          name: 'KAMAL BUSINESS — Enterprises & Industries',
          short_name: 'KAMAL',
          description: 'Commercial business application and catalogue for Kamal Enterprises and Kamal Industries.',
          theme_color: '#FAF8F5',
          background_color: '#FAF8F5',
          display: 'standalone',
          start_url: '/',
          scope: '/',
          icons: [
            {
              src: '/pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/pwa-maskable-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable',
            },
            {
              src: '/icon.svg',
              sizes: '512x512',
              type: 'image/svg+xml',
              purpose: 'any',
            },
          ],
        },
        devOptions: {
          enabled: true,
          type: 'module',
        },
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
