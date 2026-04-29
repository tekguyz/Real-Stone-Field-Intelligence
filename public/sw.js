self.addEventListener("push", function (event) {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: "/favicon-dark.svg",
      badge: "/favicon-dark.svg",
      data: {
        url: data.url || "/",
      },
      vibrate: [100, 50, 100],
      actions: [
        { action: 'open', title: 'Open App', icon: '/favicon-dark.svg' }
      ]
    };

    event.waitUntil(self.registration.showNotification(data.title, options));
  }
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});
