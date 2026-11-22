/* SETNOTE: 一度開いたファイルを端末に保存して、電波がなくても開けるようにする。
   通信できるときは裏で新しい版を取りにいき、次に開いたときに反映する */
const CACHE = 'setnote-20261122113634';
self.addEventListener('install', e => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  if (new URL(e.request.url).searchParams.has('fresh')) return; // 版の確認は保存せず、毎回ネットから取る
  e.respondWith(caches.open(CACHE).then(async c => {
    const hit = await c.match(e.request);
    const net = fetch(e.request).then(r => { if (r && (r.ok || r.type === 'opaque')) c.put(e.request, r.clone()); return r; }).catch(() => hit);
    return hit || net;
  }));
});
