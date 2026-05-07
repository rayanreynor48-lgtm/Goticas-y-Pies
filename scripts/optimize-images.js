#!/usr/bin/env node
/**
 * optimize-images.js
 * Convierte JPG → WebP + thumbnails
 * 
 * Uso: node scripts/optimize-images.js
 * Requiere: imagemin, imagemin-webp, imagemin-mozjpeg, imagemin-pngquant
 */

import imagemin from 'imagemin';
import imageminWebp from 'imagemin-webp';
import imageminMozjpeg from 'imagemin-mozjpeg';
import imageminPngquant from 'imagemin-pngquant';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function optimizeImages() {
  try {
    console.log('🖼️ Optimizando imágenes...');

    // 1. Crear WebP de assets/personas/*/
    console.log('📦 Convirtiendo a WebP...');
    const files = await imagemin(['assets/personas/**/*.{jpg,png}'], {
      destination: 'assets/personas-optimized',
      plugins: [
        imageminMozjpeg({ quality: 75 }),
        imageminWebp({ quality: 75 }),
        imageminPngquant({ quality: [0.6, 0.8] }),
      ],
    });

    console.log('✅ Convertidas:', files.length, 'imágenes');

    // 2. Crear thumbnails (50% size)
    console.log('📸 Creando thumbnails...');
    const dirs = fs.readdirSync('assets/personas', { withFileTypes: true });
    for (const dir of dirs) {
      if (!dir.isDirectory()) continue;

      const personDir = path.join('assets/personas', dir.name);
      const files = fs.readdirSync(personDir).filter(f => /\.(jpg|png)$/.test(f));

      for (const file of files) {
        const src = path.join(personDir, file);
        const dest = path.join(personDir, `${path.parse(file).name}-thumb.webp`);

        // Usar sharp o imagemin con resize
        await imagemin([src], {
          destination: personDir,
          plugins: [
            imageminWebp({ quality: 60, resize: { width: 240 } }),
          ],
        });

        console.log(`  ✓ ${file} → thumb`);
      }
    }

    console.log('✅ Optimización completa!');
    console.log('📊 Resultados:');
    console.log('  - Archivos WebP creados en: assets/personas-optimized/');
    console.log('  - Thumbnails creados en: assets/personas/*/');
    console.log('\n⚠️  Próximos pasos:');
    console.log('  1. Reemplazar referencias en HTML: src="img.jpg" → src="img.webp"');
    console.log('  2. Agregar fallback: <source srcset="img.webp" type="image/webp">');
    console.log('  3. Mover archivos optimizados a assets/personas/');

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

optimizeImages();
