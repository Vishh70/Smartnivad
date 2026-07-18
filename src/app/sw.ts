/// <reference lib="webworker" />
import { defaultCache } from "@serwist/next/worker";
import type {
  PrecacheEntry,
  SerwistGlobalConfig,
  RuntimeCaching,
} from "serwist";
import {
  Serwist,
  CacheFirst,
  StaleWhileRevalidate,
  ExpirationPlugin,
} from "serwist";

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

const customCache: RuntimeCaching[] = [
  {
    matcher: ({ request, url }) =>
      request.method === "GET" &&
      url.origin === self.location.origin &&
      url.pathname.startsWith("/api"),
    handler: new StaleWhileRevalidate({
      cacheName: "smartnivad-api-cache",
      plugins: [
        new ExpirationPlugin({
          maxEntries: 100,
          maxAgeSeconds: 24 * 60 * 60, // 24 hours
        }),
      ],
    }),
  },
  {
    matcher: ({ request }) =>
      request.destination === "image" ||
      request.destination === "font" ||
      request.destination === "script" ||
      request.destination === "style",
    handler: new CacheFirst({
      cacheName: "smartnivad-static-assets",
      plugins: [
        new ExpirationPlugin({
          maxEntries: 200,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
        }),
      ],
    }),
  },
  {
    matcher: ({ url }) =>
      url.pathname.startsWith("/blog") ||
      url.pathname.startsWith("/deals") ||
      url.pathname.startsWith("/store") ||
      url.pathname.startsWith("/category") ||
      url.pathname.startsWith("/brand"),
    handler: new StaleWhileRevalidate({
      cacheName: "smartnivad-pages-cache",
      plugins: [
        new ExpirationPlugin({
          maxEntries: 50,
          maxAgeSeconds: 7 * 24 * 60 * 60, // 7 Days
        }),
      ],
    }),
  },
  ...defaultCache,
];

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: customCache,
  fallbacks: {
    entries: [
      {
        url: "/offline",
        matcher({ request }) {
          return request.destination === "document";
        },
      },
    ],
  },
});

serwist.addEventListeners();
