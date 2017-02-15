"use strict";

var self = this;
var cacheName = "cacheV1";
var cacheImgName = "imgCacheV1"
var cacheFileList = [
    '/',
    '/js/ng-app.js',
    '/js/jq-app.js',
    '/css/styles.css',
    "lib/font-awesome/css/font-awesome.min.css",
    "lib/material-design-lite/material.min.css",
    "lib/jquery-ui/themes/base/jquery-ui.min.css",
    "lib/material-design-lite/material.min.js",
    "lib/angular/angular.min.js",
    "lib/jquery/dist/jquery.min.js",
    "lib/jquery-ui/jquery-ui.min.js",
    "lib/localforage/dist/localforage.min.js",
    "lib/angular-localforage/dist/angular-localForage.min.js"
];
var latestPath = '/pluralsight/courses/progressive-web-apps/service/latest-deals.php';
var imagePath = '/pluralsight/courses/progressive-web-apps/service/car-image.php';

self.addEventListener('install', function(event){ 
    self.skipWaiting();
    event.waitUntil(caches.open(cacheName)
        .then(function(cache){
            return cache.addAll(cacheFileList);
        }));
});

self.addEventListener('activate', function (event) {
    self.clients.claim();
    event.waitUntil(caches.keys()
        .then(function(cacheKeys){
            var deletePormises = [];
            for(var i=0; i<cacheKeys.length; i++){
                if(cacheKeys[i] != cacheName && cacheKeys[i] != cacheImgName){
                    deletePormises.push(caches.delete(cacheKeys[i]));
                }
            }
            return Promise.all(deletePormises);
        }));
});

self.addEventListener('fetch', function (event) {
    var requestUrl = new URL(event.request.url);
    var requestPath = requestUrl.pathname;
    var fileName = requestPath.substring(requestPath.lastIndexOf('/') + 1);

    if (requestPath == latestPath || fileName == "sw.js") {
        event.respondWith(fetch(event.request));
    } else {
        event.respondWith(networkFirst(event.request));
    }
});


function networkFirst(request) {
    return fetchAndCache(request).catch(function (err) {
        return caches.match(request);
    });
}

function fetchAndCache(request) {
    return fetch(request).then(function (response) {
        caches.open(getCacheName(request))
        .then(function (cache) {
            cache.put(request, response);
        });
        return response.clone();
    });
}

function getCacheName(request) {
    var requestUrl = new URL(request.url);
    var requestPath = requestUrl.pathname;

    if (requestPath == imagePath) {
        return cacheImgName;
    } else {
        return cache;
    }
}