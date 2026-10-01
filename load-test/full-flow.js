// Expanded k6 load test covering the full participant lifecycle:
//   - internal leader: signup -> login -> join TWO events at once
//     (multi-event registration) -> check-in -> invite teammate -> teammate
//     accepts -> teammate leaves -> leader deletes both teams (covers
//     "leaving an event" from both member and leader sides)
//   - outsider (external user): signup -> login -> join event -> fill
//     accommodation form -> submit payment transaction -> delete own team
//
// One event ("Load Test Event") has no participant cap, used to find the
// real concurrency ceiling. A second event ("Load Test Event Capped",
// maxParticipants=20, teamSize=2) is DELIBERATELY small — failures on its
// "join capped event" check past the first ~10 teams are EXPECTED (the
// capacity-limit logic doing its job), not a scalability problem. Only
// failures on the uncapped event's checks indicate real capacity issues.
//
// Requires ALLOW_LOADTEST=true on the target, pointed at a TEST/STAGING
// database — this writes real rows and (per this run) is NOT cleaned up
// automatically; run POST /api/loadtest/cleanup yourself when ready.
//
// Run:
//   k6 run -e BASE_URL=http://localhost:3000 -e STAFF_EMAIL=... -e STAFF_PASSWORD=... load-test/full-flow.js

import http from "k6/http";
import { check, sleep, fail } from "k6";

const BASE_URL = __ENV.BASE_URL || "http://localhost:3000";
const STAFF_EMAIL = __ENV.STAFF_EMAIL || "devadmin@techno27.com";
const STAFF_PASSWORD = __ENV.STAFF_PASSWORD || "Dev@12345";

export const options = {
  scenarios: {
    full_flow: {
      executor: "ramping-vus",
      startVUs: 0,
      stages: [
        { duration: "1m", target: 100 },
        { duration: "3m", target: 1500 },
        { duration: "6m", target: 4000 }, // pushes past the last confirmed 3000-VU run to find the real ceiling
        { duration: "2m", target: 0 },
      ],
    },
  },
  thresholds: {
    // Only the uncapped event's join rate is a real pass/fail signal —
    // the capped event is expected to reject most joins by design.
    "checks{check:join uncapped event ok}": ["rate>0.90"],
  },
};

const json = { headers: { "Content-Type": "application/json" } };

function signupAndLogin(suffix, overrides = {}) {
  const email = overrides.email || `loadtest-${suffix}@opju.ac.in`;
  const password = "Loadtest@12345";

  const base = {
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
  };

  const signupRes = http.post(
    `${BASE_URL}/api/loadtest/signup`,
    JSON.stringify({ ...base, ...overrides, email }),
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

function signupOutsiderAndLogin(suffix) {
  return signupAndLogin(suffix, {
    email: `loadtest-${suffix}@gmail.com`,
    collegeName: "Load Test University",
    city: "Testville",
    state: "Teststate",
    accommodationNeeded: true,
    // external-only fields; internal-only fields above (semester/section/
    // enrollmentNumber/dayScholarOrHosteller) are simply ignored by the
    // server for EXTERNAL_USER signups
  });
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
  const { uncappedEvent, cappedEvent } = data;
  if (!uncappedEvent) {
    sleep(1);
    return;
  }

  // ── Internal leader + teammate: multi-event join, invite, leave, delete ──
  const leader = signupAndLogin(`leader-${vu}`);
  const teammate = signupAndLogin(`mate-${vu}`);

  const eventIdsToJoin = [uncappedEvent._id];
  if (cappedEvent) eventIdsToJoin.push(cappedEvent._id);

  const joinRes = http.post(
    `${BASE_URL}/api/loadtest/events/join`,
    JSON.stringify({ token: leader.token, eventIds: eventIdsToJoin }),
    json,
  );
  // The join can partially fail (e.g. capped event full) — submitEventsAction
  // is all-or-nothing per call, so treat the two events as separate checks
  // by re-deriving success from the response rather than assuming both landed.
  const joinOk = joinRes.status === 200;
  check(joinRes, { "join uncapped event ok": () => joinOk || cappedEvent === null });
  if (cappedEvent) check(joinRes, { "join capped event ok": () => joinOk });

  let teamIds = [];
  if (!joinOk) {
    // Capped event was likely full — retry with just the uncapped event so
    // the rest of the flow (invite/checkin/etc.) still exercises the leader.
    const retryRes = http.post(
      `${BASE_URL}/api/loadtest/events/join`,
      JSON.stringify({ token: leader.token, eventIds: [uncappedEvent._id] }),
      json,
    );
    check(retryRes, { "join uncapped event ok (retry)": (r) => r.status === 200 });
    if (retryRes.status !== 200) {
      sleep(1);
      return;
    }
    teamIds = retryRes.json("teamIds") || [];
  } else {
    teamIds = joinRes.json("teamIds") || [];
  }
  if (teamIds.length === 0) {
    sleep(1);
    return;
  }
  const primaryTeamId = teamIds[teamIds.length - 1]; // most recently created team (uncapped event)

  const checkinRes = http.post(
    `${BASE_URL}/api/loadtest/checkin`,
    JSON.stringify({
      staffToken: data.staffToken,
      scannedUserId: leader.userId,
      eventId: uncappedEvent._id,
    }),
    json,
  );
  check(checkinRes, { "checkin ok": (r) => r.status === 200 });

  const inviteRes = http.post(
    `${BASE_URL}/api/loadtest/teams/invite`,
    JSON.stringify({ token: leader.token, teamId: primaryTeamId, inviteeEmail: teammate.email }),
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
      JSON.stringify({ token: teammate.token, teamId: primaryTeamId }),
      json,
    );
    check(leaveRes, { "leave team ok": (r) => r.status === 200 });
  }

  // Leader deletes every team it holds — covers "leaving" each joined event.
  for (const teamId of teamIds) {
    const deleteRes = http.post(
      `${BASE_URL}/api/loadtest/teams/delete`,
      JSON.stringify({ token: leader.token, teamId }),
      json,
    );
    check(deleteRes, { "delete team ok": (r) => r.status === 200 });
  }

  // ── Outsider: join event, fill accommodation + payment forms ──
  const outsider = signupOutsiderAndLogin(`out-${vu}`);

  const outsiderJoinRes = http.post(
    `${BASE_URL}/api/loadtest/events/join`,
    JSON.stringify({ token: outsider.token, eventIds: [uncappedEvent._id] }),
    json,
  );
  check(outsiderJoinRes, { "outsider join event ok": (r) => r.status === 200 });
  const outsiderTeamId = outsiderJoinRes.json("teamIds.0");

  if (outsiderTeamId) {
    const accommodationRes = http.post(
      `${BASE_URL}/api/loadtest/accommodation`,
      JSON.stringify({
        token: outsider.token,
        arrivalTime: new Date().toISOString(),
        departureTime: new Date(Date.now() + 86400000).toISOString(),
        universityName: "Load Test University",
        gender: "Other",
        additionalDetails: "k6 load test booking",
      }),
      json,
    );
    check(accommodationRes, { "accommodation form ok": (r) => r.status === 200 });

    const paymentRes = http.post(
      `${BASE_URL}/api/loadtest/payment`,
      JSON.stringify({
        transactionId: `LT-TXN-${vu}`,
        userEmail: outsider.email,
        currentPayAmount: 499,
      }),
      json,
    );
    check(paymentRes, { "payment form ok": (r) => r.status === 200 });

    const outsiderDeleteRes = http.post(
      `${BASE_URL}/api/loadtest/teams/delete`,
      JSON.stringify({ token: outsider.token, teamId: outsiderTeamId }),
      json,
    );
    check(outsiderDeleteRes, { "outsider delete team ok": (r) => r.status === 200 });
  }

  sleep(1);
}

export function setup() {
  const staffToken = staffLogin();
  if (!staffToken) {
    fail("Could not log in staff/admin account for check-in — check STAFF_EMAIL/STAFF_PASSWORD");
  }

  const eventsRes = http.get(`${BASE_URL}/api/loadtest/events`, json);
  const events = eventsRes.json("events") || [];
  const uncappedEvent = events.find((e) => e.name === "Load Test Event" && e.status === "REGISTRATION_OPEN");
  const cappedEvent = events.find((e) => e.name === "Load Test Event Capped" && e.status === "REGISTRATION_OPEN") || null;

  if (!uncappedEvent) {
    fail("No 'Load Test Event' with status REGISTRATION_OPEN found — run GET /api/seed/init first");
  }

  return { staffToken, uncappedEvent, cappedEvent };
}
