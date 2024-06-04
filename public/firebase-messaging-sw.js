/* eslint-disable no-undef */
// File: firebase-messaging-sw.js
importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js"
);
// Set Firebase configuration, once available

self.addEventListener('fetch', () => {
  try {
    const urlParams = new URLSearchParams(location.search);
    console.log('urlParams', urlParams);
    self.firebaseConfig = Object.fromEntries(urlParams);
  } catch (err) {
    console.error('Failed to add event listener', err);
  }
});

// "Default" Firebase configuration (prevents errors)
const defaultConfig = {
  apiKey: true,
  projectId: true,
  messagingSenderId: true,
  appId: true,
};
// Initialize Firebase app
firebase.initializeApp(self.firebaseConfig || defaultConfig);
let messaging;
try {
  messaging = firebase.messaging.isSupported() ? firebase.messaging() : null
} catch (err) {
  console.error('Failed to initialize Firebase Messaging', err);
}

// To dispaly background notifications
if (messaging) {
  try {
    messaging.onBackgroundMessage((payload) => {
      console.log('Received background message: ', payload);
      const notificationTitle = payload.notification.title;
      const notificationOptions = {
        body: payload.notification.body,
        tag: notificationTitle, // tag is added to ovverride the notification with latest update
        // icon: payload.notification?.image || data.image,
        data: {
          url: "https://www.google.com/.",// This should contain the URL you want to open
        },
      }
      // Optional
      /*
       * This condition is added because notification triggers from firebase messaging console doesn't handle image by default.
       * collapseKey comes only when the notification is triggered from firebase messaging console and not from hitting fcm google api.
       */
      if (payload?.collapseKey && notification?.image) {
        self.registration.showNotification(notificationTitle, notificationOptions);
      } else {
        // Skipping the event handling for notification
        // return new Promise(function (resolve, reject) { });
      }
    });

  } catch (err) {
    console.log(err);
  }
}
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  // Get the URL from the notification data
  const notificationData = event.notification.data;
  const redirectUrl = notificationData.url || 'https://www.google.com/';

  // Open the URL in the client
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      for (const client of clientList) {
        if (client.url === '/' && 'focus' in client) {
          return client.focus();
        }
      }

      if (clients.openWindow) {
        return clients.openWindow(redirectUrl);
      }
    })
  );
});

self.addEventListener("notificationclick", console.log);