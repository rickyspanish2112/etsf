importScripts('/src/js/idb.js');
importScripts('/src/js/utility.js');

var CACHE_STATIC_NAME = 'static-v56';
var CACHE_DYNAMIC_NAME = 'dynamic-v2';
var STATIC_FILES = [
  '/',
  '/index.html',
  '/offline.html',
  '/src/js/app.js',
  '/src/js/feed.js',
  '/src/js/promise.js',
  '/src/js/idb.js',
  '/src/js/fetch.js',
  '/src/js/material.min.js',
  '/src/css/app.css',
  '/src/css/feed.css',
  '/src/images/main-image.jpg',
  '/src/images/asm-logo.jpg',
  'https://fonts.googleapis.com/css?family=Roboto:400,700',
  'https://fonts.googleapis.com/icon?family=Material+Icons',
  'https://cdnjs.cloudflare.com/ajax/libs/material-design-lite/1.3.0/material.indigo-pink.min.css'
]


// function trimCache(cacheName, maxItems) {
//   caches.open(cacheName)
//     .then(function (cache) {
//       return cache.keys()
//         .then(function (keys) {
//           if (keys.length > maxItems) {
//             cache.delete(keys[0])
//               .then(trimCache(cacheName, maxItems));
//           }
//         });
//     })
// }


self.addEventListener('install', function (event) {
  console.log('[Service Worker] Installing Service Worker ...', event);
  event.waitUntil(
    caches.open(CACHE_STATIC_NAME)
      .then(function (cache) {
        console.log('[Service Worker] Precaching App Shell');
        cache.addAll(STATIC_FILES);
      })
  )
});

self.addEventListener('activate', function (event) {
  console.log('[Service Worker] Activating Service Worker ....', event);
  event.waitUntil(
    caches.keys()
      .then(function (keyList) {
        return Promise.all(keyList.map(function (key) {
          if (key !== CACHE_STATIC_NAME && key !== CACHE_DYNAMIC_NAME) {
            console.log('[Service Worker] Removing old cache.', key);
            return caches.delete(key);
          }
        }));
      })
  );
  return self.clients.claim();
});

function isInArray(string, array) {
  var cachePath;
  if (string.indexOf(self.origin) === 0) { // request targets domain where we serve the page from (i.e. NOT a CDN)
    console.log('matched ', string);
    cachePath = string.substring(self.origin.length); // take the part of the URL AFTER the domain (e.g. after localhost:8080)
  } else {
    cachePath = string; // store the full request (for CDNs)
  }
  return array.indexOf(cachePath) > -1;
}


self.addEventListener('fetch', function (event) {
  var url = 'https://pwagram-ce869-default-rtdb.europe-west1.firebasedatabase.app/posts';
  if (event.request.url.indexOf(url) > -1) {  //Strategy: Cache then network and dynamic caching (see Feed.js for counter part.)
    event.respondWith(
      // caches.open(CACHE_DYNAMIC_NAME) //No longer need to look in browser cache as we are using IndexedDB
      //   .then(function (cache) {
      fetch(event.request)
        .then(function (res) {
          // trimCache(CACHE_DYNAMIC_NAME, 3);
          //cache.put(event.request, res.clone()); This would put the response in the browser cache
          var clonedRes = res.clone();
          clearAllData('posts')
            .then(function () {
              return clonedRes.json();
            })
            .then(function (data) {
              for (var key in data) {
                writeData('posts', data[key]);
              }
            });
          return res;
        })
      // })
    )
  } else if (isInArray(event.request.url, STATIC_FILES)) { //Strategy: Cache only (use for static assets)
    event.respondWith(
      caches.match(event.request)
    )
  }
  else {
    event.respondWith(
      caches.match(event.request) //Strategy: Cache then network fallback
        .then(function (response) {
          if (response) {
            return response;
          } else {
            return fetch(event.request)
              .then(function (res) {
                return caches.open(CACHE_DYNAMIC_NAME)
                  .then(function (cache) {
                    cache.put(event.request.url, res.clone());
                    return res;
                  })
              })
              .catch(function (err) {
                return caches.open(CACHE_STATIC_NAME)
                  .then(function (cache) {
                    if (event.request.headers.get('accept').includes('text/html')) {
                      return cache.match('/offline.html');
                    }

                  })
              });
          }
        })
    )
  }
});

//Strategy: Cache then network
//self.addEventListener('fetch', function (event) {
//event.respondWith(
    // caches.match(event.request)
    //   .then(function (response) {
    //     if (response) {
    //       return response;
    //     } else {
    //       return fetch(event.request)
    //         .then(function (res) {
    //           return caches.open(CACHE_DYNAMIC_NAME)
    //             .then(function (cache) {
    //               cache.put(event.request.url, res.clone());
    //               return res;
    //             })
    //         })
    //         .catch(function (err) {
    //           return caches.open(CACHE_STATIC_NAME)
    //             .then(function (cache) {
    //               return cache.match('/offline.html')
    //             })
    //         });
    //     }
    //   })
 // );
//})



//Strategy: Cache with network fallabck
// self.addEventListener('fetch', function (event) {
//   event.respondWith(
//     caches.match(event.request)
//       .then(function (response) {
//         if (response) {
//           return response;
//         } else {
//           return fetch(event.request)
//             .then(function (res) {
//               return caches.open(CACHE_DYNAMIC_NAME)
//                 .then(function (cache) {
//                   cache.put(event.request.url, res.clone());
//                   return res;
//                 })
//             })
//             .catch(function (err) {
//               return caches.open(CACHE_STATIC_NAME)
//                 .then(function (cache) {
//                   return cache.match('/offline.html')
//                 })
//             });
//         }
//       })
//   );
// })





//Strategy: Network with cache fallback + dynamic caching - this does not solve the time out issue
// self.addEventListener('fetch', function (event) {
//   event.respondWith(
//     fetch(event.response)
//     .then(function(res){
//       return caches.open(CACHE_DYNAMIC_NAME)
//       .then(function (cache) {
//         cache.put(event.request.url, res.clone());
//         return res;
//       });
//     })
//       .catch(function (err) {
//         return caches.match(event.request)
//       })
//   );
// })

//Strategy: Network with cache fallback: Gotcha - This could cause problems if netork takes a while to timeout.
// self.addEventListener('fetch', function (event) {
//   event.respondWith(
//     fetch(event.response)
//       .catch(function (err) {
//         return caches.match(event.request)
//       })
//   );
// })


//Stragetgy: Network only
// self.addEventListener('fetch', function (event) {
//   event.respondWith(
//     fetch(event.request)
//   )
// })

//Stragetgy: Cach only
// self.addEventListener('fetch', function (event) {
//   event.respondWith(
//     caches.match(event.request)
//       .then(function (response) {
//         return response;
//       })
//   )
// })


