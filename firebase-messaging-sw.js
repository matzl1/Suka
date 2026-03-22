importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyAdMzyCRaXOkDn-a0D4ImxeZ4MXSfxdkjY",
  authDomain: "suka-81061.firebaseapp.com",
  projectId: "suka-81061",
  storageBucket: "suka-81061.firebasestorage.app",
  messagingSenderId: "238446297432",
  appId: "1:238446297432:web:b34b9eb890654aa693252d"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[SW] Уведомление:', payload);
  
  const title = payload.notification?.title || 'Новое сообщение';
  const options = {
    body: payload.notification?.body || 'У вас новое сообщение',
    icon: '/icon-192.png',
    badge: '/badge-72.png',
    vibrate: [200, 100, 200]
  };

  self.registration.showNotification(title, options);
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('/')
  );
});
