import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';
import fs from 'fs';

// Automatically sync the generated logo into PWA public folder on start/build
try {
  const srcLogo = path.resolve('./src/assets/images/daro_logo_1780655884279.png');
  const publicDir = path.resolve('./public');
  if (fs.existsSync(srcLogo)) {
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }
    fs.copyFileSync(srcLogo, path.join(publicDir, 'icon-192.png'));
    fs.copyFileSync(srcLogo, path.join(publicDir, 'icon-512.png'));
    fs.copyFileSync(srcLogo, path.join(publicDir, 'logo.png'));
    console.log('PWA Assets synchronized to public folder successfully.');
  }
} catch (err) {
  console.error('Error synchronizing PWA logo assets:', err);
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    define: {
      'process.env.GOOGLE_MAPS_PLATFORM_KEY': JSON.stringify(process.env.GOOGLE_MAPS_PLATFORM_KEY || '')
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
