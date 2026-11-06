// keeps the app (and its face/hair models) on the phone after the first visit
const C="tiruoti-v7";
self.addEventListener("install",e=>self.skipWaiting());
self.addEventListener("activate",e=>e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener("fetch",e=>{const r=e.request;if(r.method!=="GET"||new URL(r.url).origin!==location.origin)return;
  const heavy=/\/(mp|models)\//.test(r.url);
  e.respondWith(heavy?caches.open(C).then(c=>c.match(r).then(m=>m||fetch(r).then(res=>{if(res.ok)c.put(r,res.clone());return res;})))
    :fetch(r).then(res=>{if(res.ok)caches.open(C).then(c=>c.put(r,res.clone()));return res;}).catch(()=>caches.match(r)));});
