/* SETNOTE: 一度開いたファイルを端末に保存して、電波がなくても開けるようにする。
   通信できるときは裏で新しい版を取りにいき、次に開いたときに反映する */
const CACHE = 'setnote-v2';
self.addEventListener('install', e => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(caches.open(CACHE).then(async c => {
    const hit = await c.match(e.request);
    const net = fetch(e.request).then(r => { if (r && (r.ok || r.type === 'opaque')) c.put(e.request, r.clone()); return r; }).catch(() => hit);
    return hit || net;
  }));
});
