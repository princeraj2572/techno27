"use client";
// Browse events as a cart: competitions are grouped under their fest event; add any open ones to the
// cart, register them in one go, and unregister from the ones you're in.
import { useCallback, useEffect, useMemo, useState } from "react";
import { CalendarDays, CheckCircle2, Plus, ShoppingBag, Trash2, Users, X } from "lucide-react";
import AppShell from "@/components/layout/app-shell";
import { display } from "@/components/indie";
import { CARD_UI, INSET } from "@/components/indie/gold-poster";
import { ALL_EVENTS } from "@/features/events/data/all-events";
import { calculatePayAmount, MAX_PAYMENT } from "@/features/payments/payment-constants";
import { statusChip } from "@/features/events/status-ui";
import {
  getAllEventsAction, getMyRegistrationsAction, submitEventsAction, unregisterFromEventAction,
} from "@/features/events/event-actions";

type Ev = { _id: string; name: string; status: string; teamSize?: number; mainEvent?: string; category?: string };
type Reg = { eventId: string; teamId: string; isLeader: boolean; members: number };
type Fest = { key: string; name: string; tagline?: string; category?: string; prize: string; events: Ev[] };

const CART_KEY = "trx27-cart";
// "Kalakriti: Rangoli" -> "Rangoli" inside the Kalakriti group
const shortName = (ev: Ev, fest: string) => (ev.name.startsWith(fest + ": ") ? ev.name.slice(fest.length + 2) : ev.name);

function readCart(): string[] {
  try { return JSON.parse(localStorage.getItem(CART_KEY) ?? "[]"); } catch { return []; }
}

export default function EventsSelectionPage() {
  const [events, setEvents] = useState<Ev[]>([]);
  const [regs, setRegs] = useState<Reg[]>([]);
  const [role, setRole] = useState("");
  const [max, setMax] = useState<number | null>(null);
  const [cart, setCart] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false); // don't overwrite the saved cart before it is read
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [confirming, setConfirming] = useState<string | null>(null); // eventId awaiting unregister confirm
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const load = useCallback(async () => {
    const [all, mine] = await Promise.all([getAllEventsAction(), getMyRegistrationsAction()]);
    setEvents(all); setRegs(mine.registrations); setRole(mine.role); setMax(mine.maxFestEvents);
    return { all: all as Ev[], mine };
  }, []);

  useEffect(() => {
    load()
      .then(({ all, mine }) => {
        // keep only cart items that are still open and not already registered
        const open = new Set(all.filter((e) => e.status === "REGISTRATION_OPEN").map((e) => e._id));
        const reg = new Set(mine.registrations.map((r) => r.eventId));
        setCart(readCart().filter((id) => open.has(id) && !reg.has(id)));
        setHydrated(true);
      })
      .catch(() => setMsg({ ok: false, text: "Couldn't load events. Refresh to try again." }))
      .finally(() => setLoading(false));
  }, [load]);

  useEffect(() => {
    if (!hydrated) return;
    try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch { /* private mode */ }
  }, [cart, hydrated]);

  const byId = useMemo(() => new Map(events.map((e) => [e._id, e])), [events]);
  const festOf = useCallback((id: string) => { const e = byId.get(id); return e?.mainEvent || id; }, [byId]);
  const regIds = useMemo(() => new Set(regs.map((r) => r.eventId)), [regs]);

  // Group in website order; events without a fest (made by hand) form their own group at the end.
  const fests: Fest[] = useMemo(() => {
    const groups = ALL_EVENTS.map((f) => ({ key: f.slug, name: f.name, tagline: f.tagline, category: f.category, prize: f.prize, events: events.filter((e) => e.mainEvent === f.slug) }));
    const loose = events.filter((e) => !e.mainEvent || !ALL_EVENTS.some((f) => f.slug === e.mainEvent)).map((e) => ({ key: e._id, name: e.name, category: e.category, prize: "", events: [e] }));
    return [...groups, ...loose].filter((g) => g.events.length);
  }, [events]);

  const usedFests = useMemo(() => new Set([...regs.map((r) => festOf(r.eventId)), ...cart.map(festOf)]), [regs, cart, festOf]);
  const atCap = max !== null && usedFests.size >= max;
  const canAdd = (id: string) => !atCap || usedFests.has(festOf(id));

  // Fee estimate (externals; leaders pay): solo vs team events after registering the cart.
  const fee = useMemo(() => {
    if (role !== "EXTERNAL_USER") return null;
    const paying = [...regs.filter((r) => r.isLeader).map((r) => r.eventId), ...cart];
    const solo = paying.filter((id) => (byId.get(id)?.teamSize ?? 1) <= 1).length;
    return calculatePayAmount(solo, paying.length - solo);
  }, [role, regs, cart, byId]);

  const toggle = (id: string) => {
    setMsg(null);
    setCart((c) => (c.includes(id) ? c.filter((x) => x !== id) : canAdd(id) ? [...c, id] : c));
  };

  const register = async () => {
    if (!cart.length) return;
    setBusy(true); setMsg(null);
    try {
      await submitEventsAction({ eventIds: cart });
      const n = cart.length;
      setCart([]);
      await load();
      setMsg({ ok: true, text: `Registered for ${n} event${n > 1 ? "s" : ""}. Invite teammates from My teams.` });
    } catch (e) {
      setMsg({ ok: false, text: e instanceof Error ? e.message : "Registration failed." });
    } finally { setBusy(false); }
  };

  const unregister = async (id: string) => {
    setBusy(true); setMsg(null);
    const res = await unregisterFromEventAction(id).catch(() => ({ ok: false, error: "Something went wrong." }));
    setConfirming(null);
    if (res.ok) { await load(); setMsg({ ok: true, text: `Unregistered from ${byId.get(id)?.name ?? "the event"}.` }); }
    else setMsg({ ok: false, text: res.error ?? "Couldn't unregister." });
    setBusy(false);
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl space-y-4 px-4 py-16">
        <div className="h-10 w-48 animate-pulse rounded-xl bg-[#1c1812]/15" />
        {[1, 2, 3].map((i) => <div key={i} className="h-40 animate-pulse rounded-2xl bg-[#1c1812]/10" />)}
      </div>
    );
  }

  const cartEvents = cart.map((id) => byId.get(id)).filter(Boolean) as Ev[];

  const CartBody = (
    <>
      {cartEvents.length === 0 ? (
        <p className="py-4 text-center text-sm text-black/60">Add open competitions to register for them together.</p>
      ) : (
        <ul className="space-y-2">
          {cartEvents.map((e) => (
            <li key={e._id} className={`${INSET} flex items-center gap-2 px-3 py-2`}>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-[#1c1812]">{e.name}</p>
                <p className="text-xs text-black/55">{(e.teamSize ?? 1) > 1 ? `Team of up to ${e.teamSize}` : "Solo"}</p>
              </div>
              <button onClick={() => toggle(e._id)} aria-label={`Remove ${e.name}`} className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-black/60 hover:bg-black/10 active:scale-95">
                <X className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
      {fee !== null && (
        <p className="mt-3 flex items-baseline justify-between text-sm text-[#1c1812]">
          <span>Total fee <span className="text-black/50">(incl. cart · max ₹{MAX_PAYMENT})</span></span>
          <span className={`text-xl ${display.className}`}>₹{fee}</span>
        </p>
      )}
      {role === "INTERNAL_USER" && <p className="mt-3 text-sm font-semibold text-[#0f6b63]">Free for OPJU students.</p>}
      <button
        onClick={register}
        disabled={!cart.length || busy}
        className="mt-4 w-full rounded-full border-[3px] border-[#1c1812] bg-[#0f6b63] py-3 font-extrabold uppercase tracking-wider text-white shadow-[0_4px_0_#1c1812] transition-transform duration-150 active:translate-y-0.5 disabled:opacity-50"
      >
        {busy ? "Working…" : `Register ${cart.length || ""} event${cart.length === 1 ? "" : "s"}`}
      </button>
    </>
  );

  return (
    <>
      <AppShell
        title="Browse events"
        sub="Add competitions to your cart, then register them together."
        icon={<CalendarDays className="h-6 w-6" />}
        crumbs={[{ label: "Home", href: "/" }, { label: "Dashboard", href: "/dashboard" }, { label: "Browse events" }]}
        back={{ href: "/dashboard", label: "Back to dashboard" }}
        width="max-w-6xl"
      >
        {/* Limit */}
        <div className={`${CARD_UI} flex flex-wrap items-center gap-x-6 gap-y-2 px-5 py-4`}>
          {max !== null ? (
            <>
              <p className="text-[#1c1812]">
                <span className={`text-2xl ${display.className}`}>{usedFests.size} / {max}</span>{" "}
                <span className="font-bold uppercase tracking-wider">fest events</span>
              </p>
              <p className="text-sm text-black/65">External participants can join up to {max} fest events. Competitions inside one fest event count once.</p>
              {atCap && <p className="w-full text-sm font-bold text-[#a33517]">Limit reached: you can still add competitions from fest events you&apos;re already in.</p>}
            </>
          ) : (
            <p className="text-sm text-[#1c1812]"><span className="font-bold">No event limit</span> for OPJU students. Join as many competitions as you like.</p>
          )}
        </div>

        {msg && (
          <p role="status" className={`rounded-2xl border-[3px] border-[#1c1812] px-4 py-3 font-semibold ${msg.ok ? "bg-[#d9f2df] text-[#0d3d1a]" : "bg-[#ffd0d0] text-[#6b0010]"}`}>
            {msg.ok && <CheckCircle2 className="mr-1.5 inline h-4 w-4" />}{msg.text}
          </p>
        )}

        <div className="grid items-start gap-6 lg:grid-cols-[1fr_20rem]">
          {/* Fest events with their competitions */}
          <div className="space-y-5 pb-28 lg:pb-0">
            {fests.map((f) => {
              const inFest = f.events.some((e) => regIds.has(e._id));
              return (
                <section key={f.key} className={`${CARD_UI} overflow-hidden`}>
                  <header className="flex flex-wrap items-baseline gap-x-3 gap-y-1 border-b-2 border-dashed border-black/15 px-5 py-4">
                    <h2 className={`text-2xl text-[#1c1812] ${display.className}`}>{f.name}</h2>
                    {f.category && <span className="text-xs font-bold uppercase tracking-widest text-[#a33517]">{f.category}</span>}
                    <span className="text-xs text-black/50">{f.events.length > 1 ? `${f.events.length} competitions` : "Single event"}</span>
                    <span className="rounded-full bg-[#fff1c2] px-2.5 py-0.5 text-xs font-bold uppercase text-[#5a3b00]">
                      Prize pool: {/\d/.test(f.prize) ? f.prize : "To be announced"}
                    </span>
                    {inFest && <span className="ml-auto rounded-full bg-[#d9f2df] px-2.5 py-0.5 text-xs font-bold uppercase text-[#0d3d1a]">You&apos;re in</span>}
                    {f.tagline && <p className="w-full text-sm text-black/60">{f.tagline}</p>}
                  </header>
                  <ul className="divide-y divide-black/10">
                    {f.events.map((e) => {
                      const reg = regs.find((r) => r.eventId === e._id);
                      const inCart = cart.includes(e._id);
                      const open = e.status === "REGISTRATION_OPEN";
                      const st = statusChip(e.status);
                      const blocked = open && !reg && !inCart && !canAdd(e._id);
                      return (
                        <li key={e._id} className={`px-5 py-3 ${inCart ? "bg-[#fff6cc]" : ""}`}>
                          <div className="flex flex-wrap items-center gap-3">
                            <div className="min-w-0 flex-1">
                              <p className="font-bold text-[#1c1812]">{shortName(e, f.name)}</p>
                              <p className="mt-0.5 flex items-center gap-1 text-xs text-black/55">
                                <Users className="h-3.5 w-3.5" /> {(e.teamSize ?? 1) > 1 ? `Team of up to ${e.teamSize}` : "Solo"}
                              </p>
                            </div>
                            {reg ? (
                              <>
                                <span className="inline-flex items-center gap-1 rounded-full bg-[#d9f2df] px-2.5 py-1 text-xs font-bold uppercase text-[#0d3d1a]">
                                  <CheckCircle2 className="h-3.5 w-3.5" /> Registered
                                </span>
                                <button onClick={() => setConfirming(e._id)} disabled={busy} className="text-xs font-bold uppercase text-[#a33517] underline-offset-2 hover:underline disabled:opacity-50">
                                  Unregister
                                </button>
                              </>
                            ) : open ? (
                              <button
                                onClick={() => toggle(e._id)}
                                disabled={blocked}
                                title={blocked ? `Limit of ${max} fest events reached` : undefined}
                                className={`inline-flex items-center gap-1.5 rounded-full border-[3px] border-[#1c1812] px-4 py-1.5 text-sm font-extrabold uppercase transition-transform duration-150 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 ${inCart ? "bg-[#1c1812] text-[#f3e8cf]" : "bg-[#f5c928] text-[#1c1812]"}`}
                              >
                                {inCart ? <><X className="h-4 w-4" /> In cart</> : <><Plus className="h-4 w-4" /> Add</>}
                              </button>
                            ) : (
                              <span className={`rounded-full px-2.5 py-1 text-xs font-bold uppercase ${st.cls}`}>{st.text}</span>
                            )}
                          </div>
                          {confirming === e._id && reg && (
                            <div className={`${INSET} mt-3 flex flex-wrap items-center gap-3 px-4 py-3`}>
                              <p className="flex-1 text-sm text-[#1c1812]">
                                {reg.isLeader && reg.members > 1
                                  ? `You lead this team: unregistering removes the whole team (${reg.members} members).`
                                  : reg.isLeader ? "Unregister from this event?" : "You'll leave this team."}
                              </p>
                              <button onClick={() => unregister(e._id)} disabled={busy} className="inline-flex items-center gap-1.5 rounded-full border-2 border-[#1c1812] bg-[#c8421f] px-4 py-1.5 text-sm font-extrabold uppercase text-white active:scale-95 disabled:opacity-50">
                                <Trash2 className="h-4 w-4" /> {busy ? "Working…" : "Yes, unregister"}
                              </button>
                              <button onClick={() => setConfirming(null)} className="text-sm font-bold uppercase text-black/60 hover:text-black">Keep</button>
                            </div>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </section>
              );
            })}
            {fests.length === 0 && (
              <p className="rounded-2xl border-[3px] border-dashed border-[#1c1812]/30 bg-white/60 py-16 text-center text-black/60">No events yet. Check back soon.</p>
            )}
          </div>

          {/* Cart: sticky on desktop */}
          <aside className={`${CARD_UI} sticky top-20 hidden p-5 lg:block`}>
            <p className="mb-3 flex items-center gap-2 text-lg font-extrabold text-[#1c1812]"><ShoppingBag className="h-5 w-5" /> Your cart</p>
            {CartBody}
          </aside>
        </div>
      </AppShell>

      {/* Cart: bottom sheet on phone/tablet */}
      {cart.length > 0 && (
        <details className="group fixed inset-x-0 bottom-[var(--tabbar-h,4.25rem)] z-40 md:bottom-0 border-t-[3px] border-[#1c1812] bg-white p-4 shadow-[0_-4px_0_#1c1812] lg:hidden">
          <summary className="flex cursor-pointer list-none items-center gap-2 font-extrabold text-[#1c1812]">
            <ShoppingBag className="h-5 w-5" /> Cart · {cart.length} event{cart.length > 1 ? "s" : ""}
            {fee !== null && <span className="ml-auto">₹{fee}</span>}
            <span className="ml-2 text-xs uppercase text-[#0f6b63] group-open:hidden">Review</span>
          </summary>
          <div className="mt-3 max-h-[50vh] overflow-y-auto">{CartBody}</div>
        </details>
      )}
    </>
  );
}
