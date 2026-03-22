// Импорт Firebase библиотек (compat версия для Service Worker)
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js');

// Ваша конфигурация Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAdMzyCRaXOkDn-a0D4ImxeZ4MXSfxdkjY",
  authDomain: "suka-81061.firebaseapp.com",
  projectId: "suka-81061",
  storageBucket: "suka-81061.firebasestorage.app",
  messagingSenderId: "238446297432",
  appId: "1:238446297432:web:b34b9eb890654aa693252d"
};

// Инициализация Firebase
firebase.initializeApp(firebaseConfig);

// Получение инстанса messaging
const messaging = firebase.messaging();

// Обработка фоновых уведомлений (когда сайт закрыт)
messaging.onBackgroundMessage((payload) => {
  console.log('[Service Worker] Получено фоновое уведомление:', payload);
  
  const notificationTitle = payload.notification?.title || 'Новое сообщение';
  const notificationOptions = {
    body: payload.notification?.body || 'У вас новое сообщение',
    icon: '/icon-192.png',
    badge: '/badge-72.png',
    tag: payload.data?.chatId || 'default',
    data: payload.data,
    vibrate: [200, 100, 200],
    requireInteraction: false
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Обработка клика по уведомлению
self.addEventListener('notificationclick', (event) => {
  console.log('[Service Worker] Клик по уведомлению');
  event.notification.close();
  
  const chatId = event.notification.data?.chatId;
  const urlToOpen = chatId 
    ? `${self.location.origin}?openChat=${chatId}` 
    : self.location.origin;

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((windowClients) => {
        // Ищем открытое окно с сайтом
        for (let i = 0; i < windowClients.length; i++) {
          const client = windowClients[i];
          if (client.url.indexOf(self.location.origin) >= 0 && 'focus' in client) {
            return client.focus();
          }
        }
        // Если нет — открываем новое окно
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});
