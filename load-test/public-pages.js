// Read-only load test of the public site, safe to point at production:
// only GETs pages and images visitors load anyway. No signups, logins, uploads or OTP emails,
// so nothing is written to the database and no email quota is used.
//
//   k6 run -e BASE=https://13-204-112-108.sslip.io -e PEAK=500 load-test/public-pages.js
//
// Each virtual user behaves like a visitor: open a page, read for 2–5 s, open another.
import http from "k6/http";
import { check, sleep } from "k6";

const BASE = __ENV.BASE || "http://localhost:3000";
const PEAK = Number(__ENV.PEAK || 300);
// Browsers always ask for compression; without this k6 downloads ~8x more (home: 319 KB raw vs 39 KB).
const PARAMS = { headers: { "Accept-Encoding": "gzip, br" } };

export const options = {
  stages: [
    { duration: "30s", target: 50 },
    { duration: "60s", target: Math.round(PEAK / 2) },
    { duration: "60s", target: PEAK },
    { duration: "60s", target: PEAK }, // hold at peak
    { duration: "30s", target: 0 },
  ],
  thresholds: {
    http_req_failed: ["rate<0.01"], // fewer than 1% errors
    http_req_duration: ["p(95)<2000"], // 95% of requests under 2 s
  },
};

// Weighted like real traffic: most visitors land on home, then browse.
const PAGES = [
  ["/", 30],
  ["/events", 15],
  ["/gallery", 15],
  ["/events/codigo", 10],
  ["/junoon", 10],
  ["/schedule", 8],
  ["/auth/login", 7],
  ["/images/gallery/rishi-singh-stage.jpg", 5],
];
const TOTAL = PAGES.reduce((n, [, w]) => n + w, 0);

function pick() {
  let r = Math.random() * TOTAL;
  for (const [path, w] of PAGES) if ((r -= w) < 0) return path;
  return "/";
}

export default function () {
  const path = pick();
  const res = http.get(`${BASE}${path}`, { ...PARAMS, tags: { page: path } });
  check(res, { "status 200": (r) => r.status === 200 });
  sleep(2 + Math.random() * 3);
}
