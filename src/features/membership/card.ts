/**
 * Encoding for the QR printed on a membership card.
 *
 * The whole record travels inside the QR itself (as a URL fragment), so a
 * scan resolves to a readable page with no backend lookup. Only identifiers
 * are carried for the temple and plan — their names, prices and benefits are
 * resolved from `data.ts` on the receiving page, which keeps the payload
 * small enough to stay comfortably scannable from a printed card.
 */

export interface MembershipCardPayload {
  memberId: string;
  name: string;
  email: string;
  phone: string;
  planId: string;
  templeSlug: string;
  amount: number;
  currency: string;
  /** ISO date, yyyy-mm-dd */
  issued: string;
  /** ISO date, or "life" for lifetime tiers */
  validTill: string;
  paymentId: string;
  nakshatra: string;
  gothram: string;
  pan: string;
}

const FIELDS: (keyof MembershipCardPayload)[] = [
  "memberId",
  "name",
  "email",
  "phone",
  "planId",
  "templeSlug",
  "amount",
  "currency",
  "issued",
  "validTill",
  "paymentId",
  "nakshatra",
  "gothram",
  "pan",
];

const clean = (v: unknown) => String(v ?? "").replace(/\|/g, "/");

function toBase64Url(text: string) {
  const bytes = new TextEncoder().encode(text);
  let binary = "";
  bytes.forEach((b) => {
    binary += String.fromCharCode(b);
  });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(token: string) {
  const base64 = token.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export function encodeMembership(payload: MembershipCardPayload) {
  return toBase64Url(["1", ...FIELDS.map((f) => clean(payload[f]))].join("|"));
}

export function decodeMembership(token: string): MembershipCardPayload | null {
  try {
    const parts = fromBase64Url(token).split("|");
    if (parts[0] !== "1" || parts.length < FIELDS.length + 1) return null;

    const values = parts.slice(1);
    const out = {} as Record<string, string | number>;
    FIELDS.forEach((field, i) => {
      out[field] = values[i] ?? "";
    });
    out.amount = Number(out.amount) || 0;

    const payload = out as unknown as MembershipCardPayload;
    return payload.memberId && payload.templeSlug ? payload : null;
  } catch {
    return null;
  }
}

/** Absolute URL a phone camera can open straight from the printed card. */
export function membershipCardUrl(payload: MembershipCardPayload) {
  const origin = typeof window === "undefined" ? "" : window.location.origin;
  return `${origin}/membership-card#${encodeMembership(payload)}`;
}
