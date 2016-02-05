importScripts('../node_modules/sw-toolbox/sw-toolbox.js');
var version = '6';
var dataCacheName = 'weatherData-v'+version;
var cacheName = 'weatherPWA-step-celebrate-'+version;
var filesToCache = [
  './',
  './index.html',
  './scripts/app.js',
  './images/clear.png',
  './images/cloudy-scattered-showers.png',
  './images/cloudy.png',
  './images/fog.png',
  './images/partly-cloudy.png',
  './images/rain.png',
  './images/scattered-showers.png',
  './images/sleet.png',
  './images/snow.png',
  './images/thunderstorm.png',
  './images/wind.png'
];

toolbox.options.cache.name = cacheName;
toolbox.precache(filesToCache);

self.addEventListener('install', function(e) {
  e.waitUntil(self.skipWaiting());
});

// activate event
self.addEventListener('activate', function(e) {
  console.log('[ServiceWorker] Activate');
  e.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        console.log('[ServiceWorker] Removing old cache', key);
        if (key !== cacheName && key.indexOf("$$$inactive$$$") === -1) {
          return caches.delete(key);
        }
      }));
    })
  );
});

var nosw = 0;
self.addEventListener('fetch', function(e) {
  var url = new URL(e.request.url);
  if (nosw || (url.search.indexOf("nosw=1") >= 0)) {
    nosw = 1;
    return;
  }
});

toolbox.router.get('/(.*)', toolbox.networkFirst, {
  domain: 'https://publicdata-weather.firebaseio.com',
  cache: { name: dataCacheName }
});

toolbox.router.get('/(.*)', toolbox.cacheFirst, {
  cache: { name: cacheName }
});