// Service Worker لتطبيق AlifLamMeem
self.addEventListener('install', (event) => {
    console.log('✅ Service Worker تم تثبيته');
    event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
    console.log('✅ Service Worker تم تفعيله');
    event.waitUntil(self.clients.claim());
});

self.addEventListener('push', (event) => {
    const data = event.data.json();
    
    const options = {
        body: data.body || 'لديك مكالمة جديدة',
        icon: '/logo.png',
        badge: '/logo.png',
        vibrate: [200, 100, 200],
        requireInteraction: true,
        actions: [
            {
                action: 'accept',
                title: '📞 قبول',
                icon: '/accept.png'
            },
            {
                action: 'reject',
                title: '❌ رفض',
                icon: '/reject.png'
            }
        ],
        data: {
            callId: data.callId,
            from: data.from,
            type: data.type
        }
    };
    
    event.waitUntil(
        self.registration.showNotification(data.title || '📞 مكالمة واردة', options)
    );
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    
    if (event.action === 'accept') {
        // قبول المكالمة
        event.waitUntil(
            clients.openWindow('/chat.html?call=accept&from=' + event.notification.data.from)
        );
    } else if (event.action === 'reject') {
        // رفض المكالمة
        console.log('❌ تم رفض المكالمة من الإشعار');
    } else {
        // فتح التطبيق
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});