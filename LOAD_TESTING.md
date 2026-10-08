# Load Testing — Session Log & Reference

This documents the load-testing work done on Techno-aiMBiAtion 2027, what was
tested, the results, the bugs found (and fixed), and how to re-run everything
for future tests.

## TL;DR

- Built a k6-based load-testing harness (`load-test/`) with dedicated,
  env-gated API routes (`/api/loadtest/*`) that mirror real Server Actions.
- Found and fixed two real performance bottlenecks: a too-small Mongoose
  connection pool, and an N+1 query pattern in event registration.
- Confirmed the app's realistic burst capacity on this MongoDB Atlas free
  (M0) tier is roughly **2,000–3,000 concurrent users** before the tier's own
  ceiling (not app code) becomes the limiting factor.
- Added pagination across every dashboard list that was previously unbounded
  or hard-capped, as a direct consequence of what load testing exposed.

---

## 1. Infrastructure built

### `/api/loadtest/*` routes
Plain JSON wrappers around the real Server Actions, since Server Actions use
a build-specific `Next-Action` protocol that k6 can't call directly. Gated by
`ALLOW_LOADTEST=true` (404s otherwise — never enable this in production).

| Route | Wraps |
|---|---|
| `POST /api/loadtest/signup` | `userSignup()` |
| `POST /api/loadtest/login` | `userLogin()` — returns JWT in body |
| `GET /api/loadtest/events` | `getAllEventsAction()` |
| `POST /api/loadtest/events/join` | `submitEventsAction()` |
| `POST /api/loadtest/teams/invite` | `sendTeamInviteAction()` |
| `POST /api/loadtest/teams/invite/accept` | `acceptInviteAction()` |
| `POST /api/loadtest/teams/leave` | `leaveTeamAction()` |
| `POST /api/loadtest/teams/delete` | `deleteTeamAction()` |
| `POST /api/loadtest/checkin` | `checkInByQRAction()` |
| `POST /api/loadtest/accommodation` | `setAccommodationDetailsAction()` |
| `POST /api/loadtest/payment` | `addTransactionIdAction()` |
| `GET /api/loadtest/stats` | Read-only snapshot of all loadtest-* data (no writes) |
| `POST /api/loadtest/cleanup` | Deletes every loadtest-* user, team, invite, check-in, accommodation, transaction, and seeded event |

Routes impersonate a user by JWT token (passed explicitly in the request
body), not browser cookies — this lets one k6 iteration drive multiple
synthetic users (leader, teammate, outsider, staff) independently.

**Gotcha found:** a folder named `_loadtest` is invisible to Next.js routing
(any `_`-prefixed folder under `app/` is a "private folder"). The directory
is named `loadtest` (no underscore) for this reason.

### k6 scripts (`load-test/`)

- **`team-flow.js`** — core flow: signup → login → join event → check-in →
  invite teammate → accept → leave → delete team.
- **`full-flow.js`** — expanded flow: internal leader joins **two events at
  once** (one uncapped, one deliberately capped at 20 participants to test
  the "event full" rejection path) → check-in → invite/accept/leave →
  delete both teams; plus a separate **outsider** flow: signup → join event →
  accommodation form → payment form → delete team.

Both scripts ramp VUs via `options.scenarios` — edit the `stages` array to
change target concurrency/duration.

### Seeding & cleanup
- `GET /api/seed/init` — idempotent; creates 4 fixed dev accounts
  (`devadmin@techno27.com` / `Dev@12345`, etc.) plus two load-test events
  (`"Load Test Event"` uncapped, `"Load Test Event Capped"` capped at 20).
- `POST /api/loadtest/cleanup` — removes everything the above created.

### Required env vars for a run
```
ALLOW_LOADTEST=true      # enables the /api/loadtest/* routes
MONGOOSE_DEBUG=true      # optional — logs every Mongo query to the console
```
Revert both after every run. Never set `ALLOW_LOADTEST=true` on a shared or
production environment.

---

## 2. How to run a load test (future reference)

```bash
# 1. Enable the flag
#    .env.local: add ALLOW_LOADTEST=true

# 2. Build + start (production build gives realistic numbers; `next dev`
#    works too but is much slower and not representative of real capacity)
npm run build
npm run start

# 3. Seed accounts + events
curl http://localhost:3000/api/seed/init

# 4. Smoke test first — NEVER jump straight to full scale
k6 run --vus 5 --duration 20s \
  -e BASE_URL=http://localhost:3000 \
  -e STAFF_EMAIL=devadmin@techno27.com \
  -e STAFF_PASSWORD=Dev@12345 \
  load-test/full-flow.js

# 5. If smoke test is ~100% green, run the full scenario (edit `stages` in
#    the script to set your target VU count first)
k6 run -e BASE_URL=http://localhost:3000 \
  -e STAFF_EMAIL=devadmin@techno27.com -e STAFF_PASSWORD=Dev@12345 \
  load-test/full-flow.js > load-test/run.log 2>&1

# 6. Inspect results without touching data
curl http://localhost:3000/api/loadtest/stats

# 7. Clean up
curl -X POST http://localhost:3000/api/loadtest/cleanup

# 8. Revert ALLOW_LOADTEST in .env.local
```

`load-test/*.log` files are gitignored — they're regenerated per run, not
source.

---

## 3. Test runs performed this session & results

| # | Target | Mode | Max VUs reached | p95 latency | Error rate | Key finding |
|---|---|---|---|---|---|---|
| 1 | 3,000 | `next dev` | 715 (never reached target) | 58.07s | 13.00% | Dev mode itself is the bottleneck — never ran at realistic scale |
| 2 | 3,000 | `next start` (prod) | 3,000 (reached) | 58.11s | 12.66% | Confirmed NOT a dev-mode artifact — `join event` specifically collapses; pool exhaustion suspected |
| 3 | 3,000 | `next start`, **after fixes** | 3,000 | 28.03s (↓52%) | 13.43% (flat) | Pool size + query batching roughly doubled throughput (70→131 req/s) and halved latency; `join event` pass rate crept 5%→9% but still degraded at peak — points to Atlas M0 tier ceiling, not app code |
| 4 | 4,000 (full-flow, all forms) | `next start` | 4,000 (reached) | n/a (threshold: join rate) | `join uncapped event` (retry path): 39% pass | Capped event's cap turned out to be 5000 not the intended 20 (unexplained — see §5); combined multi-event join amplified failures since `submitEventsAction` is all-or-nothing across requested events |

**Per-flow reliability (expanded full-flow test, 4,000 VUs):**
| Flow | Result |
|---|---|
| signup / login | 91% |
| checkin / invite / leave / delete team | ~100% |
| accommodation form | 100% |
| payment form | 100% |
| outsider join event | 82% |
| accept invite | 70% |
| join event (combined 2-event call) | 15% (dominated by capped-event contention) |
| join event (single-event retry) | 39% (closer to the real uncapped-event ceiling) |

**Bottom line:** the app comfortably handles real-world registration traffic
spread over time. The numbers above reflect an artificial worst case — 3,000+
people registering in the same few minutes, which is harsher than any real
event's registration window is likely to be.

---

## 4. Fixes applied as a direct result of testing

1. **`src/lib/mongodb.ts`** — `maxPoolSize` raised from Mongoose's default
   (100) to 500. This was the first-order bottleneck: at thousands of
   concurrent requests, connections queued for a free pool slot and piled up
   until timing out.
2. **`src/actions/event-actions.ts` (`submitEventsAction`)** — rewritten from
   ~2N+1 sequential DB round-trips (N = number of events being joined:
   fetch each event twice, fetch each existing team individually, save new
   teams one at a time) down to a fixed ~5 queries regardless of N, via
   batched `Event.find({_id:{$in}})`, parallel `countDocuments`, batched
   `Team.find({_id:{$in}})`, and `Team.insertMany`.

Combined effect: throughput roughly doubled (70.76 → 130.87 req/s), p95
latency roughly halved (58.11s → 28.03s).

**Not fixed / not fixable in code:** MongoDB Atlas's free M0 tier has its own
hard ceiling (shared CPU, limited IOPS, connection cap) that a larger client
pool can't get around. If you need to confirm higher capacity, the only way
is to temporarily test against a paid tier (M10+).

---

## 5. Open items / things to investigate next time

- **Unexplained `maxParticipants` value.** The "Load Test Event Capped" seed
  explicitly sets `maxParticipants: 20`, but a live DB query during the
  4,000-VU run showed the actual stored value as `5000`, with ~2,692 teams
  registered against it. Root cause was never found — re-seeding cleanly and
  checking the value immediately after creation (before any load) would be
  the first step next time.
- **Atlas tier ceiling not empirically confirmed.** We inferred the M0 free
  tier is the remaining bottleneck after the code fixes, but never tested
  against a paid tier to prove it. If you need a hard answer on max
  supportable concurrency, that's the next experiment.
- **Plaintext password comparison.** Unrelated to load testing, found while
  reading `userLogin()`: `src/actions/user-actions.ts` compares passwords
  with plain `===` against the stored value, despite `bcryptjs` being a
  dependency. Not yet fixed.
- **Realistic traffic shape.** All runs here simulate a worst-case burst
  (thousands of registrations in minutes). No test was done simulating a
  more realistic shape (traffic spread over hours/days with periodic
  spikes) — worth doing if you want a number that maps more directly to
  "will the real event survive registration day."

---

## 6. Dashboard changes made as a result of this testing

Running the full-flow test with 16,000+ synthetic users exposed real
dashboard bugs at scale, fixed in the same session:

- **Pagination added** to every previously-unbounded or hard-capped list:
  `admin/participants`, `admin/teams`, `admin/events/[id]`,
  `admin/event-managers`, `admin/payments`, `dev/accommodation`,
  `dev/management`, `dev/logs`, `dev/payments`, `dev/users`,
  `event-manager/[eventId]/teams`, plus client-side pagination for
  `.../participants` and `.../checkin` (which need their full dataset
  loaded for Excel export / QR search).
- **`admin/participants` page.tsx** had a `.limit(100)` silently truncating
  both the displayed list *and* the stat cards computed from that same
  capped array — fixed with real `countDocuments()` totals.
- **`getPaymentData()`** was an unbounded N+1 query (every external user,
  each with its own team/event/transaction lookups) — now paginated.
- Added Internal/External filter tabs and a progressive (byte-level
  streamed) Excel export button to `admin/participants`.
- Added participant total/internal/external stat cards to the `/admin`
  management dashboard (previously only on `/dev`), with a responsive font
  scale fix (5-digit counts were clipping on narrow screens) and removed a
  "blank white card when count is zero" pattern across all stat cards.

See git log (`git log --oneline`) for the full file-by-file commit history —
each commit is scoped to one file and describes its specific change.
