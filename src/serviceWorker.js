const isLocalhost = Boolean(window.location.hostname === "localhost" || window.location.hostname === "[::1]" || window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/))

export default function register()
{
  if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator)
  {
    window.addEventListener("load", () =>
    {
      const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`
      if (!isLocalhost)
      {
        navigator.serviceWorker.register(swUrl).then(registration =>
        {
          registration.update().then(() => console.log("going for update")).catch(() => console.log("can't going for update"))
          registration.onupdatefound = () =>
          {
            const installingWorker = registration.installing
            installingWorker.onstatechange = () =>
            {
              if (installingWorker.state === "installed")
                if (navigator.serviceWorker.controller)
                {
                  console.log("New content is available.")
                  window.location.reload(true)
                }
                else console.log("Content is cached for offline use.")
            }
          }
        }).catch(error => console.error("Error during service worker registration:", error))
        navigator.serviceWorker.addEventListener("controllerchange", () =>
        {
          console.log("New **controller** found.")
          if (localStorage.getItem("user") || sessionStorage.getItem("user")) window.location.reload(true)
        })
      }
    })
  }
}