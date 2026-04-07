// Handle push notifications (for future server-side push support)
self.addEventListener('push', (event) => {
    if (!event.data) return;

    try {
        const data = event.data.json();
        const options = {
            body: data.body || 'New notification',
            vibrate: [200, 100, 200],
            data: data.data || {},
            tag: data.tag || 'default',
            requireInteraction: false
        };

        event.waitUntil(
            self.registration.showNotification(data.title || 'PiChat', options)
        );
    } catch (e) {
        console.error('Error handling push notification:', e);
    }
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    // Focus or open the app window
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
            // Check if there's already a window open
            for (const client of clientList) {
                if (client.url.includes('/chat') && 'focus' in client) {
                    return client.focus();
                }
            }
            // If no window is open, open one
            if (clients.openWindow) {
                return clients.openWindow('/chat');
            }
        })
    );
});

// Handle notification close
self.addEventListener('notificationclose', (event) => {
    console.log('Notification closed:', event.notification.tag);
});