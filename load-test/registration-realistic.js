// Realistic registration-day simulation — NOT a stress test.
//
// Unlike team-flow.js / full-flow.js (which loop the same VU through the
// whole flow repeatedly with only a 1s pause — a deliberate worst-case
// burst), this models what actually happens on registration morning:
//   - each "arrival" is one real person registering exactly ONCE
//   - realistic think-time between steps (reading the page, typing,
//     waiting for things to load) instead of machine-gun requests
//   - arrivals spread naturally over a window via the arrival-rate
//     executor (an open model), instead of a fixed set of VUs hammering
//     in lockstep (a closed model)
//
// Default profile: ramps to ~5 arrivals/sec and holds it for 90s, which
// works out to roughly 500 real people registering over about 2 minutes —
// a plausible "registration just opened" rush. Adjust the stages below to
// match your actual expected pattern.
//
// Requires ALLOW_LOADTEST=true on the target, pointed at a TEST/STAGING
// database — this writes real rows. Run /api/loadtest/cleanup after.
//
// Run:
//   k6 run -e BASE_URL=http://localhost:3000 load-test/registration-realistic.js

import http from "k6/http";
import { check, sleep } from "k6";

const BASE_URL = __ENV.BASE_URL || "http://localhost:3000";

export const options = {
  scenarios: {
    registration_rush: {
      executor: "ramping-arrival-rate",
      startRate: 0,
      timeUnit: "1s",
      preAllocatedVUs: 300,
      maxVUs: 800,
      stages: [
        { target: 2, duration: "20s" },  // first few early arrivals
        { target: 5, duration: "20s" },  // ramping as word spreads
        { target: 5, duration: "90s" },  // sustained rush ~= 450-500 people
        { target: 0, duration: "10s" },
      ],
    },
  },
  thresholds: {
    // This is a realism check, not a stress ceiling — a healthy backend
    // should comfortably clear human-paced traffic.
    "checks{check:join event ok}": ["rate>0.95"],
    http_req_duration: ["p(95)<3000"],
  },
};

const json = { headers: { "Content-Type": "application/json" } };

// Think-time helpers: real humans don't fire requests back-to-back.
const readPage = () => sleep(2 + Math.random() * 4);   // 2-6s reading
const typeForm = () => sleep(3 + Math.random() * 7);   // 3-10s filling a form
const decide    = () => sleep(1 + Math.random() * 3);   // 1-4s deciding

export default function (data) {
  const person = `${__VU}-${__ITER}-${Date.now()}`;
  const email = `loadtest-reg-${person}@opju.ac.in`;
  const password = "Loadtest@12345";

  // Person lands on signup, reads the form, fills it in.
  readPage();
  typeForm();

  const signupRes = http.post(
    `${BASE_URL}/api/loadtest/signup`,
    JSON.stringify({
      email,
      password,
      fullName: `Load Test ${person}`,
      mobileNumber: "9876543210",
      gender: "Other",
      department: "Engineering",
      program: "B.Tech",
      branch: "Computer Science and Engineering",
      year: "2nd",
      address: "N/A",
      emergencyContactName: "N/A",
      emergencyContactNumber: "9876543210",
      semester: "3",
      section: "A",
      enrollmentNumber: `LTREG${person}`,
      dayScholarOrHosteller: "Day Scholar",
    }),
    json,
  );
  if (!check(signupRes, { "signup ok": (r) => r.status === 200 })) return;

  // Waits for the "account created" screen, then logs in.
  decide();

  const loginRes = http.post(
    `${BASE_URL}/api/loadtest/login`,
    JSON.stringify({ email, password }),
    json,
  );
  if (!check(loginRes, { "login ok": (r) => r.status === 200 })) return;
  const token = loginRes.json("token");
  if (!token) return;

  // Browses the events list, reads descriptions, picks one.
  readPage();
  readPage();

  const eventId = data.eventId;
  if (!eventId) return;

  const joinRes = http.post(
    `${BASE_URL}/api/loadtest/events/join`,
    JSON.stringify({ token, eventIds: [eventId] }),
    json,
  );
  check(joinRes, { "join event ok": (r) => r.status === 200 });
}

export function setup() {
  const eventsRes = http.get(`${BASE_URL}/api/loadtest/events`, json);
  const events = eventsRes.json("events") || [];
  const openEvent = events.find((e) => e.name === "Load Test Event" && e.status === "REGISTRATION_OPEN");
  return { eventId: openEvent ? openEvent._id : null };
}
