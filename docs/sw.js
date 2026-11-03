/**
 * Copyright 2018 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// If the loader is already loaded, just stop.
if (!self.define) {
  let registry = {};

  // Used for `eval` and `importScripts` where we can't get script URL by other means.
  // In both cases, it's safe to use a global var because those functions are synchronous.
  let nextDefineUri;

  const singleRequire = (uri, parentUri) => {
    uri = new URL(uri + ".js", parentUri).href;
    return registry[uri] || (
      
        new Promise(resolve => {
          if ("document" in self) {
            const script = document.createElement("script");
            script.src = uri;
            script.onload = resolve;
            document.head.appendChild(script);
          } else {
            nextDefineUri = uri;
            importScripts(uri);
            resolve();
          }
        })
      
      .then(() => {
        let promise = registry[uri];
        if (!promise) {
          throw new Error(`Module ${uri} didn’t register its module`);
        }
        return promise;
      })
    );
  };

  self.define = (depsNames, factory) => {
    const uri = nextDefineUri || ("document" in self ? document.currentScript.src : "") || location.href;
    if (registry[uri]) {
      // Module is already loading or loaded.
      return;
    }
    let exports = {};
    const require = depUri => singleRequire(depUri, uri);
    const specialDeps = {
      module: { uri },
      exports,
      require
    };
    registry[uri] = Promise.all(depsNames.map(
      depName => specialDeps[depName] || require(depName)
    )).then(deps => {
      factory(...deps);
      return exports;
    });
  };
}
define(['./workbox-afac4cd2'], (function (workbox) { 'use strict';

  self.skipWaiting();
  workbox.clientsClaim();
  /**
   * The precacheAndRoute() method efficiently caches and responds to
   * requests for URLs in the manifest.
   * See https://goo.gl/S9QRab
   */
  workbox.precacheAndRoute([{
    "url": "registerSW.js",
    "revision": "402b66900e731ca748771b6fc5e7a068"
  }, {
    "url": "pwa-maskable-512x512.png",
    "revision": "0d2f0e2480f52cf58e763ec8a1b4bf4a"
  }, {
    "url": "pwa-512x512.png",
    "revision": "a8a78305344b4ef086d8cb09a20342f9"
  }, {
    "url": "pwa-192x192.png",
    "revision": "0c903dc6b9b6223066ec022a27f2be94"
  }, {
    "url": "index.html",
    "revision": "3d81395a15878141ec178f9256fdfeee"
  }, {
    "url": "icon.svg",
    "revision": "7a4779b4848c1c311920b5625709ff9b"
  }, {
    "url": "apple-touch-icon.png",
    "revision": "d965811e2f46b287e93e47d2555dcd46"
  }, {
    "url": "assets/index-DR1qW_Sq.js",
    "revision": null
  }, {
    "url": "assets/index-B3AJmxC-.css",
    "revision": null
  }, {
    "url": "apple-touch-icon.png",
    "revision": "d965811e2f46b287e93e47d2555dcd46"
  }, {
    "url": "icon.svg",
    "revision": "7a4779b4848c1c311920b5625709ff9b"
  }, {
    "url": "pwa-192x192.png",
    "revision": "0c903dc6b9b6223066ec022a27f2be94"
  }, {
    "url": "pwa-512x512.png",
    "revision": "a8a78305344b4ef086d8cb09a20342f9"
  }, {
    "url": "pwa-maskable-512x512.png",
    "revision": "0d2f0e2480f52cf58e763ec8a1b4bf4a"
  }, {
    "url": "manifest.webmanifest",
    "revision": "79da45fe140bdb9c34150667f5546119"
  }], {});
  workbox.cleanupOutdatedCaches();
  workbox.registerRoute(new workbox.NavigationRoute(workbox.createHandlerBoundToURL("index.html")));
  workbox.registerRoute(/^https:\/\/fonts\.googleapis\.com\/.*/i, new workbox.CacheFirst({
    "cacheName": "google-fonts-cache",
    plugins: [new workbox.ExpirationPlugin({
      maxEntries: 10,
      maxAgeSeconds: 31536000
    }), new workbox.CacheableResponsePlugin({
      statuses: [0, 200]
    })]
  }), 'GET');
  workbox.registerRoute(/^https:\/\/fonts\.gstatic\.com\/.*/i, new workbox.CacheFirst({
    "cacheName": "gstatic-fonts-cache",
    plugins: [new workbox.ExpirationPlugin({
      maxEntries: 10,
      maxAgeSeconds: 31536000
    }), new workbox.CacheableResponsePlugin({
      statuses: [0, 200]
    })]
  }), 'GET');

}));
