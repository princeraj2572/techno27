// Catch mistyped and throwaway email domains at sign-up. Plain data + functions: used by the
// sign-up form (instant "did you mean …?") and by the server before an OTP is sent.

// Real mail providers people commonly use here. A domain within 2 edits of one of these, but not
// equal to it, is almost always a typo (gamil.com, gmial.com, yahooo.com, hotmal.com, …).
const PROVIDERS = [
  "gmail.com", "googlemail.com", "yahoo.com", "yahoo.co.in", "yahoo.in", "ymail.com", "rediffmail.com",
  "outlook.com", "outlook.in", "hotmail.com", "live.com", "msn.com", "icloud.com", "me.com",
  "protonmail.com", "proton.me", "zoho.com", "zoho.in", "zohomail.in", "aol.com",
  // real providers one letter away from gmail/ymail: never "correct" these
  "mail.com", "email.com", "gmx.com", "gmx.net", "yandex.com", "inbox.com",
];

// Ends that are typos of .com / .in on a known provider name (gmail.con, gmail.co, yahoo.cm …).
const BAD_TLDS = ["con", "cm", "om", "comm", "cpm", "vom", "xom", "co", "cmo", "ocm", "inn"];

// Throwaway inbox services: an OTP sent there proves nothing about the person.
// shortcut: a short list of the common ones; add domains here as they show up in sign-ups.
export const DISPOSABLE = new Set([
  "mailinator.com", "yopmail.com", "guerrillamail.com", "guerrillamail.net", "sharklasers.com", "grr.la",
  "10minutemail.com", "10minutemail.net", "temp-mail.org", "tempmail.com", "tempmail.net", "tempmailo.com",
  "temp-mail.io", "throwawaymail.com", "trashmail.com", "getnada.com", "nada.email", "maildrop.cc",
  "dispostable.com", "mohmal.com", "fakeinbox.com", "mintemail.com", "emailondeck.com", "mailnesia.com",
  "spamgourmet.com", "tempinbox.com", "burnermail.io", "mail.tm", "mailpoof.com", "inboxkitten.com",
]);

function distance(a: string, b: string): number {
  // Damerau-Levenshtein (adjacent swaps count as one edit: gmial -> gmail)
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
    }
  }
  return d[a.length][b.length];
}

/** The domain the person most likely meant, or null if the domain looks fine. */
export function suggestDomain(domain: string): string | null {
  const dom = domain.toLowerCase().trim();
  if (!dom || PROVIDERS.includes(dom)) return null;

  // right name, wrong ending: gmail.con -> gmail.com, rediffmail.cm -> rediffmail.com
  const dot = dom.indexOf(".");
  const name = dot > 0 ? dom.slice(0, dot) : dom;
  const tld = dot > 0 ? dom.slice(dot + 1) : "";
  if (BAD_TLDS.includes(tld) || !tld) {
    const fixed = PROVIDERS.find((p) => p.startsWith(name + "."));
    if (fixed) return fixed;
  }

  // close misspelling of a provider (only for short distances, so real domains aren't "corrected").
  // College and institute domains are never guessed at: too many real ones look alike.
  if (/\.(ac|edu|gov|nic|res)\./.test(dom) || /\.(edu|gov)$/.test(dom)) return null;
  let best: string | null = null, bestD = 3;
  for (const p of PROVIDERS) {
    const dd = distance(dom, p);
    if (dd < bestD) { best = p; bestD = dd; }
  }
  return best && bestD <= (dom.length <= 9 ? 1 : 2) ? best : null;
}

/** "name@gamil.com" -> "name@gmail.com", or null if nothing to suggest. */
export function suggestEmail(email: string): string | null {
  const at = email.lastIndexOf("@");
  if (at < 1) return null;
  const fix = suggestDomain(email.slice(at + 1));
  return fix ? `${email.slice(0, at)}@${fix}` : null;
}

export const isDisposable = (domain: string) => DISPOSABLE.has(domain.toLowerCase().trim());
