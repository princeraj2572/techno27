// k6 load test for the team lifecycle: signup -> login -> join event
// (creates team) -> invite teammate -> teammate accepts -> member leaves ->
// leader deletes team -> staff checks in a participant.
//
// Requires the target deployment to be running with ALLOW_LOADTEST=true,
// pointed at a TEST/STAGING database — these routes write real rows.
//
// Run:
//   k6 run -e BASE_URL=http://localhost:3000 -e STAFF_EMAIL=... -e STAFF_PASSWORD=... load-test/team-flow.js

import http from "k6/http";
import { check, sleep, fail } from "k6";

const BASE_URL = __ENV.BASE_URL || "http://localhost:3000";
const STAFF_EMAIL = __ENV.STAFF_EMAIL || "devadmin@techno27.com";
const STAFF_PASSWORD = __ENV.STAFF_PASSWORD || "Dev@12345";

export const options = {
  scenarios: {
    team_flow: {
      executor: "ramping-vus",
      startVUs: 0,
      stages: [
        { duration: "1m", target: 100 },
        { duration: "3m", target: 1000 },
        { duration: "5m", target: 3000 },
        { duration: "2m", target: 0 },
      ],
    },
  },
  thresholds: {
    http_req_failed: ["rate<0.05"],
    http_req_duration: ["p(95)<2000"],
  },
};

const json = { headers: { "Content-Type": "application/json" } };

function signupAndLogin(suffix, overrides = {}) {
  const email = `loadtest-${suffix}@opju.ac.in`;
  const password = "Loadtest@12345";

  const signupRes = http.post(
    `${BASE_URL}/api/loadtest/signup`,
    JSON.stringify({
      email,
      password,
      fullName: `Load Test ${suffix}`,
      mobileNumber: "9876543210",
      gender: "Other",
      department: "Engineering",
      program: "B.Tech",
      branch: "CSE",
      year: "2nd",
      address: "N/A",
      emergencyContactName: "N/A",
      emergencyContactNumber: "9876543210",
      semester: "3",
      section: "A",
      enrollmentNumber: `LT${suffix}`,
      dayScholarOrHosteller: "Day Scholar",
      ...overrides,
    }),
    json,
  );
  check(signupRes, { "signup ok": (r) => r.status === 200 });

  const loginRes = http.post(
    `${BASE_URL}/api/loadtest/login`,
    JSON.stringify({ email, password }),
    json,
  );
  check(loginRes, { "login ok": (r) => r.status === 200 });

  const token = loginRes.json("token");
  if (!token) fail(`login did not return a token for ${email}`);
  const userId = loginRes.json("user._id");
  return { email, token, userId };
}

function staffLogin() {
  const res = http.post(
    `${BASE_URL}/api/loadtest/login`,
    JSON.stringify({ email: STAFF_EMAIL, password: STAFF_PASSWORD }),
    json,
  );
  check(res, { "staff login ok": (r) => r.status === 200 });
  return res.json("token");
}

export default function (data) {
  const vu = `${__VU}-${__ITER}-${Date.now()}`;
  const leader = signupAndLogin(`leader-${vu}`);
  const teammate = signupAndLogin(`mate-${vu}`);

  const eventsRes = http.get(`${BASE_URL}/api/loadtest/events`, json);
  check(eventsRes, { "events ok": (r) => r.status === 200 });
  const events = eventsRes.json("events") || [];
  const openEvent = events.find((e) => e.name === "Load Test Event" && e.status === "REGISTRATION_OPEN");
  if (!openEvent) {
    // No seeded event to join — skip the rest of this iteration rather than
    // failing the whole run. Seed at least one REGISTRATION_OPEN event first.
    sleep(1);
    return;
  }

  const joinRes = http.post(
    `${BASE_URL}/api/loadtest/events/join`,
    JSON.stringify({ token: leader.token, eventIds: [openEvent._id] }),
    json,
  );
  check(joinRes, { "join event ok": (r) => r.status === 200 });
  const teamId = joinRes.json("teamIds.0");
  if (!teamId) {
    sleep(1);
    return;
  }

  const checkinRes = http.post(
    `${BASE_URL}/api/loadtest/checkin`,
    JSON.stringify({
      staffToken: data.staffToken,
      scannedUserId: leader.userId,
      eventId: openEvent._id,
    }),
    json,
  );
  check(checkinRes, { "checkin ok": (r) => r.status === 200 });

  const inviteRes = http.post(
    `${BASE_URL}/api/loadtest/teams/invite`,
    JSON.stringify({ token: leader.token, teamId, inviteeEmail: teammate.email }),
    json,
  );
  check(inviteRes, { "invite ok": (r) => r.status === 200 });
  const inviteId = inviteRes.json("invite._id");

  if (inviteId) {
    const acceptRes = http.post(
      `${BASE_URL}/api/loadtest/teams/invite/accept`,
      JSON.stringify({ token: teammate.token, inviteId }),
      json,
    );
    check(acceptRes, { "accept invite ok": (r) => r.status === 200 });

    const leaveRes = http.post(
      `${BASE_URL}/api/loadtest/teams/leave`,
      JSON.stringify({ token: teammate.token, teamId }),
      json,
    );
    check(leaveRes, { "leave team ok": (r) => r.status === 200 });
  }

  const deleteRes = http.post(
    `${BASE_URL}/api/loadtest/teams/delete`,
    JSON.stringify({ token: leader.token, teamId }),
    json,
  );
  check(deleteRes, { "delete team ok": (r) => r.status === 200 });

  sleep(1);
}

export function setup() {
  const staffToken = staffLogin();
  if (!staffToken) {
    fail("Could not log in staff/admin account for check-in — check STAFF_EMAIL/STAFF_PASSWORD");
  }
  return { staffToken };
}
