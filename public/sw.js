const CACHE_NAME = 'mandar-whats-v1.0.0';
const urlsToCache = [
  '/',
  '/enviar-whatsapp-sem-contato',
  '/enviar-whatsapp-em-massa',
  '/termos-de-uso',
  '/politica-privacidade',
  '/logo.webp',
  '/logo.png',
  '/manifest.json'
];

// Instalação do Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache aberto');
        return cache.addAll(urlsToCache);
      })
  );
});

// Interceptação de requisições
self.addEventListener('fetch', (event) => {
  // Ignorar completamente requests externas e com esquemas não suportados
  try {
    const url = new URL(event.request.url);
    
    // Ignorar requests externos, chrome-extension, data:, blob:, etc
    if (url.origin !== self.location.origin || 
        url.protocol === 'chrome-extension:' ||
        url.protocol === 'data:' ||
        url.protocol === 'blob:' ||
        url.protocol === 'moz-extension:' ||
        url.protocol === 'safari-extension:' ||
        url.hostname.includes('googletagmanager.com') ||
        url.hostname.includes('google-analytics.com') ||
        url.hostname.includes('sessionrewind.com') ||
        url.hostname.includes('doubleclick.net') ||
        url.hostname.includes('facebook.com') ||
        url.hostname.includes('googlesyndication.com')) {
      return;
    }
  } catch (error) {
    // Se não conseguir fazer parse da URL, ignora
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Retorna do cache se disponível
        if (response) {
          return response;
        }

        // Se não estiver no cache, busca da rede
        return fetch(event.request)
          .then((response) => {
            // Verifica se a resposta é válida
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clona a resposta para armazenar no cache
            const responseToCache = response.clone();

            // Cache apenas requests válidos do mesmo domínio
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              })
              .catch((error) => {
                console.warn('Erro ao cachear:', error);
              });

            return response;
          })
          .catch(() => {
            // Fallback para página offline
            if (event.request.destination === 'document') {
              return caches.match('/').then(response => {
                return response || new Response('<h1>Offline</h1>', { headers: { 'Content-Type': 'text/html' } });
              });
            }
            // Para outros tipos de request, retorna Response vazio
            return new Response('', { status: 503, statusText: 'Offline' });
          });
      })
  );
});

// Ativação e limpeza de caches antigos
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Removendo cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Background sync para funcionalidades offline
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

function doBackgroundSync() {
  // Implementar sincronização em background quando necessário
  console.log('Background sync executado');
} 