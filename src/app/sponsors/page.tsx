import { Check, Globe, Mic, Store, Users, type LucideIcon } from "lucide-react";
import { PARTNER_BENEFITS, PARTNER_PACKAGES, SPONSOR_TIERS } from "@/data/dummy";
import { EVENT_THEMES, patternStyle } from "@/data/event-themes";
import { SponsorStamp, type StampSize } from "@/components/sponsor-stamp";
import { ImageSlot } from "@/components/media";
import { CountUp, Reveal } from "@/components/motion";
import { Band, BlockButton, Marquee, PageShell, display, serif } from "@/components/indie";

export const metadata = { title: "Sponsors | Techno-aiMBiAtion 2027" };

// Optional wide picture for the header, e.g. "/images/sponsors-banner.jpg" (~1600 x 600)
const SPONSORS_BANNER: string | undefined = undefined;

const BENEFIT_ICONS: Record<string, LucideIcon> = { mic: Mic, users: Users, globe: Globe, store: Store };

// Each tier borrows the palette + pattern of one cultural event theme.
const TIER_THEME: Record<StampSize, keyof typeof EVENT_THEMES> = {
  xl: "robovation",
  lg: "ideathon",
  md: "beat-battle",
  sm: "techlab",
  xs: "codigo",
};

export default function SponsorsPage() {
  const all = SPONSOR_TIERS.flatMap((t) => t.sponsors);
  const stats = [
    { to: all.length, suffix: "", label: "Partners" },
    { to: 2000, suffix: "+", label: "Students reached" },
    { to: 15, suffix: "", label: "Flagship events" },
    { to: 5, suffix: "", label: "Days of fest" },
  ];

  return (
    <PageShell>
      {/* Header */}
      <Band tone="crimson" mandala ghost="Partners in the fest" className="!pb-10 !pt-12">
        <p className="text-sm font-bold uppercase tracking-[0.35em] text-[#f5c928]">Partner · Support · Grow</p>
        <h1 className={`mt-3 text-6xl leading-[0.9] sm:text-8xl indie-outline ${serif.className}`}>Sponsors</h1>
        <p className="mt-3 text-xl font-bold uppercase text-[#f5edd8] sm:text-2xl">
          The brands powering Techno-aiMBiAtion &apos;27
        </p>
        <div className="relative mt-8">
          <ImageSlot
            src={SPONSORS_BANNER}
            alt="Techno-aiMBiAtion sponsors banner"
            label="Banner image"
            hint="1600 × 600"
            ratio="aspect-[21/8]"
            tone="from-[#ff6a00] to-[#7a1c1c]"
            className="border-2 border-black shadow-[6px_6px_0_0_#000]"
          />
          <span aria-hidden className="indie-float absolute -top-3 right-6 border-2 border-black bg-[#f5c928] px-3 py-1 text-xs font-bold uppercase tracking-widest text-black" style={{ ["--r" as string]: "5deg" }}>
            ★ {all.length} partners
          </span>
        </div>
      </Band>

      <Marquee
        className="-rotate-1 bg-[#ff6a00] py-1.5 text-xl font-bold uppercase tracking-wider text-black"
        text={`${all.map((s) => s.name).join(" ✦ ")} ✦ `}
        speed={70}
      />

      {/* Numbers */}
      <Reveal>
        <Band tone="cream" className="!py-10">
          <div className="grid grid-cols-2 gap-6 text-center sm:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label}>
                <p className={`text-4xl text-[#7a1c1c] sm:text-5xl ${display.className}`}><CountUp to={s.to} suffix={s.suffix} /></p>
                <p className="mt-1 text-xs font-bold uppercase tracking-[0.3em] text-black/70">{s.label}</p>
              </div>
            ))}
          </div>
        </Band>
      </Reveal>

      {/* One themed section per tier */}
      {SPONSOR_TIERS.map((tier) => {
        const t = EVENT_THEMES[TIER_THEME[tier.size]];
        return (
          <section key={tier.name} className="relative overflow-hidden" style={{ background: `linear-gradient(170deg, ${t.bg} 0%, ${t.bg2} 100%)`, color: t.ink }}>
            <div aria-hidden className="absolute inset-0 opacity-25" style={patternStyle(t.pattern, t.patternColor)} />
            <p aria-hidden className={`pointer-events-none absolute -bottom-6 -right-2 select-none whitespace-nowrap text-[7rem] leading-none opacity-[0.1] sm:text-[11rem] ${display.className}`}>{tier.role}</p>

            <div className="relative mx-auto max-w-5xl px-6 py-14">
              <div className="mb-10 flex flex-wrap items-end justify-between gap-3">
                <h2 className={`text-5xl leading-none sm:text-6xl ${serif.className}`} style={{ textShadow: "3px 3px 0 rgba(255,255,255,0.6)" }}>{tier.name}</h2>
                <p className="text-sm font-bold uppercase tracking-[0.3em]" style={{ color: t.soft }}>
                  {tier.sponsors.length} partner{tier.sponsors.length === 1 ? "" : "s"}
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-x-9 gap-y-12">
                {tier.sponsors.map((sp, i) => (
                  <div key={sp.name} className="indie-pop" style={{ animationDelay: `${Math.min(i, 8) * 70}ms`, transform: `rotate(${[-1.5, 1, 1.8, -1][i % 4]}deg)` }}>
                    <SponsorStamp sponsor={sp} role={tier.role} size={tier.size} pattern={t.pattern} />
                  </div>
                ))}
              </div>
            </div>
          </section>
        );
      })}
      <p className="bg-black py-3 text-center text-xs uppercase tracking-widest text-[#f5edd8]/60">Sample sponsors — all brands are fictional.</p>

      {/* Why partner with us */}
      <Reveal>
        <Band tone="orange" mandala>
          <h2 className={`mb-2 text-5xl leading-none text-black ${serif.className}`}>Why partner with us</h2>
          <p className="mb-10 max-w-xl text-xl font-semibold text-black/75">Put your brand in front of the people who matter most to it.</p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {PARTNER_BENEFITS.map((b, i) => {
              const Icon = BENEFIT_ICONS[b.icon] ?? Users;
              return (
                <div key={b.title} className={`border-2 border-black bg-[#f5edd8] p-5 text-black shadow-[5px_5px_0_0_#000] transition-transform hover:rotate-0 ${i % 2 ? "rotate-1" : "-rotate-1"}`}>
                  <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border-2 border-black bg-[#f5c928]"><Icon className="h-6 w-6" /></span>
                  <p className="text-2xl font-bold uppercase tracking-wide">{b.title}</p>
                  <p className="mt-1 text-lg leading-snug text-black/70">{b.text}</p>
                </div>
              );
            })}
          </div>
        </Band>
      </Reveal>

      {/* Packages */}
      <Reveal>
        <Band tone="indigo" mandala>
          <h2 className={`mb-10 text-4xl text-[#f5c928] sm:text-5xl ${display.className}`}>Sponsorship packages</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {PARTNER_PACKAGES.map((p) => (
              <div key={p.name} className="relative border-2 border-black bg-[#f5edd8] p-6 text-[#1a0505] shadow-[6px_6px_0_0_#000]">
                <span className="absolute -top-3 left-5 border-2 border-black px-3 py-0.5 text-xs font-bold uppercase tracking-[0.25em] text-black" style={{ background: p.accent, color: p.accent === "#f5c928" ? "#000" : "#fff" }}>{p.name}</span>
                <p className={`mt-3 text-4xl ${display.className}`}>{p.price}</p>
                <ul className="mt-4 space-y-2">
                  {p.perks.map((perk) => (
                    <li key={perk} className="flex items-start gap-2 text-lg leading-snug"><Check className="mt-1 h-4 w-4 shrink-0 text-[#c8421f]" />{perk}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="mt-8 text-center text-xs uppercase tracking-widest text-white/60">Sample packages — prices are placeholders.</p>
        </Band>
      </Reveal>

      <Band tone="black">
        <div className="space-y-4 text-center">
          <h2 className={`text-4xl text-[#f5c928] sm:text-5xl ${serif.className}`}>Partner with us</h2>
          <p className="mx-auto max-w-xl text-xl text-[#f5edd8]/80">Reach thousands of students, creators and innovators. Get in touch to become a sponsor.</p>
          <BlockButton href="/contact" tone="mustard">Contact us</BlockButton>
        </div>
      </Band>
    </PageShell>
  );
}
