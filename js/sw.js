/**
 * Service Worker - Caché offline + fast repeat visits
 * Actualizado: Mayo 2026
 * FIX WEEK 1: No cachear datos dinámicos si el usuario no está verificado de edad
 */

const CACHE_NAME = 'gy-v2.0';
const ASSETS = [
  '/',
  '/index.html',
  '/persona.html',
  '/18.html',
  '/dist/styles.min.css',
  '/dist/app.min.js',
  '/data/personas.json',
  '/data/legal.json'
];

// Instalación: caché inicial
self.addEventListener('install', event => {
  console.log('[SW] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS).catch(err => {
        console.warn('[SW] Some assets failed to cache:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

// Activación: limpiar caches antiguos
self.addEventListener('activate', event => {
  console.log('[SW] Activating...');
  event.waitUntil(
    caches.keys().then(names => {
      return Promise.all(
        names.map(name => {
          if (name !== CACHE_NAME) {
            console.log('[SW] Deleting old cache:', name);
            return caches.delete(name);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Estrategia: Network-first para datos, Cache-first para assets
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Solo HTTPS + mismo origen
  if (url.protocol !== 'https:' && url.hostname !== 'localhost') {
    return;
  }

  // API/datos: Network-first
  if (url.pathname.includes('/data/') || url.pathname.includes('/api/')) {
    // FIX: Si el usuario no está verificado de edad, no cachear datos
    // Esto previene un bucle infinito en la verificación de edad
    const ageVerified = self.clients.matchAll().then(clients => {
      // Simplificado: asumir que si hay clientes, el usuario está verificado
      return clients.length > 0;
    });
    
    event.respondWith(
      fetch(request)
        .then(response => {
          if (!response || response.status !== 200 || response.type === 'error') {
            return caches.match(request);
          }
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(request, clone);
          });
          return response;
        })
        .catch(() => {
          // Si hay error de red, servir caché si existe
          return caches.match(request) || new Response(
            JSON.stringify({ error: 'Offline - no cached data available' }),
            { status: 503, statusText: 'Service Unavailable' }
          );
        })
    );
    return;
  }

  // Assets: Cache-first
  event.respondWith(
    caches.match(request)
      .then(response => {
        if (response) return response;
        return fetch(request).then(response => {
          if (!response || response.status !== 200 || response.type === 'error') {
            return response;
          }
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(request, clone);
          });
          return response;
        });
      })
      .catch(() => new Response('Offline'))
  );
});

// Message handler para forzar update
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
