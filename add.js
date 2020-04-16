if (workbox)
{
    workbox.routing.registerRoute(/^\//, new workbox.strategies.NetworkFirst())
    workbox.routing.registerRoute(/^\/static\//, new workbox.strategies.CacheFirst())
}
else console.log("scripts not loaded")
self.addEventListener("install", _ => self.skipWaiting())
self.addEventListener("push", event =>
{
    const data = event.data.json()
    self.registration.showNotification(data.title, {
        icon: data.icon,
        body: data.body,
        image: data.image,
        tag: data.tag,
        requireInteraction: data.requireInteraction,
        renotify: data.renotify,
        data: {url: data.url},
    })
})

self.onnotificationclick = event =>
{
    event.notification.close()
    event.waitUntil(clients.matchAll({type: "window"}).then(_ => clients.openWindow && clients.openWindow(event.notification.data.url)))
}