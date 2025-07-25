// Service Worker for enhanced security
self.addEventListener('install', function(event) {
  console.log('SW installed');
  self.skipWaiting();
});

self.addEventListener('activate', function(event) {
  console.log('SW activated');
  event.waitUntil(self.clients.claim());
});

// Block potential security threats
self.addEventListener('fetch', function(event) {
  const url = new URL(event.request.url);
  
  // Block requests to known tracking/analytics domains
  const blockedDomains = [
    'lovable.dev',
    'google-analytics.com',
    'googletagmanager.com'
  ];
  
  if (blockedDomains.some(domain => url.hostname.includes(domain))) {
    event.respondWith(new Response('', { status: 204 }));
    return;
  }
});

// Remove any Lovable badges or tracking elements
self.addEventListener('message', function(event) {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});