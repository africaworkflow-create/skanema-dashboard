// Service Worker Skanema — Push Notifications
const CACHE_NAME = 'skanema-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

// Réception d'une notification push
self.addEventListener('push', (event) => {
  if (!event.data) return;

  let data;
  try { data = event.data.json(); } 
  catch (_) { data = { title: 'Skanema', body: event.data.text() }; }

  const options = {
    body     : data.body || 'Nouvelle commande reçue',
    icon     : '/icon_SKANEMA.png',
    badge    : '/icon_SKANEMA.png',
    tag      : data.tag || 'skanema-order',
    data     : { url: data.url || '/dashboard/commandes' },
    actions  : [
      { action: 'view',    title: 'Voir la commande' },
      { action: 'dismiss', title: 'Ignorer' },
    ],
    requireInteraction: true, // Reste visible jusqu'à interaction
    vibrate: [200, 100, 200],
  };

  event.waitUntil(
    self.registration.showNotification(data.title || '🔔 Nouvelle commande !', options)
  );
});

// Clic sur la notification
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'dismiss') return;

  const url = event.notification.data?.url || '/dashboard/commandes';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Si le dashboard est déjà ouvert → focus
      for (const client of clientList) {
        if (client.url.includes('dashboard.skanema.com') && 'focus' in client) {
          client.navigate(url);
          return client.focus();
        }
      }
      // Sinon ouvre un nouvel onglet
      if (clients.openWindow) {
        return clients.openWindow('https://dashboard.skanema.com' + url);
      }
    })
  );
});
