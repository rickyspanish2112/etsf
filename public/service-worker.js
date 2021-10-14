importScripts('workbox-sw.prod.v2.1.3.js');

const workboxSW = new self.WorkboxSW();

workboxSW.router.registerRoute(/.*(?:googleapis|gstatic)\.com.*$/, workboxSW.strategies.staleWhileRevalidate({
    cacheName: 'google-fonts',
    cacheExpiration: {
      maxEntries: 3,
      maxAgeSeconds: 60 * 60 * 24 * 30
    }
  }));

workboxSW.router.registerRoute('https://cdnjs.cloudflare.com/ajax/libs/material-design-lite/1.3.0/material.indigo-pink.min.css', workboxSW.strategies.staleWhileRevalidate({
  cacheName: 'material-css'
}));

workboxSW.router.registerRoute(/.*(?:firebasestorage\.googleapis)\.com.*$/, workboxSW.strategies.staleWhileRevalidate({
  cacheName: 'post-images'
}));

workboxSW.precache([
  {
    "url": "404.html",
    "revision": "df3e69f110c2e3dff82fba9957a394c6"
  },
  {
    "url": "favicon.ico",
    "revision": "2cab47d9e04d664d93c8d91aec59e812"
  },
  {
    "url": "index.html",
    "revision": "930ce5826c82845908205c349b695c65"
  },
  {
    "url": "manifest.json",
    "revision": "ba51c6544ced6e289b2b07596040ac58"
  },
  {
    "url": "offline.html",
    "revision": "45352e71a80a5c75d25e226e7330871b"
  },
  {
    "url": "src/css/app.css",
    "revision": "f27b4d5a6a99f7b6ed6d06f6583b73fa"
  },
  {
    "url": "src/css/feed.css",
    "revision": "885b236ce091e9ca1c2592c9cdcece4b"
  },
  {
    "url": "src/css/help.css",
    "revision": "1c6d81b27c9d423bece9869b07a7bd73"
  },
  {
    "url": "src/images/main-image-lg.jpg",
    "revision": "31b19bffae4ea13ca0f2178ddb639403"
  },
  {
    "url": "src/images/main-image-sm.jpg",
    "revision": "c6bb733c2f39c60e3c139f814d2d14bb"
  },
  {
    "url": "src/images/main-image.jpg",
    "revision": "5c66d091b0dc200e8e89e56c589821fb"
  },
  {
    "url": "src/js/app.min.js",
    "revision": "74d9227e410378a9e05512b829d77d5a"
  },
  {
    "url": "src/js/feed.min.js",
    "revision": "7c92fa1bb078270903192dcda0491647"
  },
  {
    "url": "src/js/fetch.min.js",
    "revision": "d32864ad91e53425397226bd2bab6729"
  },
  {
    "url": "src/js/idb.min.js",
    "revision": "741857752710b399a90d31d1d249f8d8"
  },
  {
    "url": "src/js/material.min.js",
    "revision": "713af0c6ce93dbbce2f00bf0a98d0541"
  },
  {
    "url": "src/js/promise.min.js",
    "revision": "1aa3981e1dca61086f377068aeb5e5e1"
  },
  {
    "url": "src/js/utility.min.js",
    "revision": "36910b2682727a4a6845aca994787768"
  }
]);