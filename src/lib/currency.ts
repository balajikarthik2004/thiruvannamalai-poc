/**
 * Indian Rupee formatting helpers.
 *
 * Every price in the devotee store, booking flow, donation flow and the admin
 * command centre is an INR amount. These helpers keep the ₹ symbol and the
 * Indian digit grouping (1,23,456) consistent across the app.
 */

/** ₹4,899 — whole rupees, Indian digit grouping. No decimals. */
export const formatINR = (amount: number): string =>
  `₹${Math.round(amount).toLocaleString("en-IN")}`;

/** ₹4,899.50 — used only where paise genuinely matter (cart tax lines). */
export const formatINRPrecise = (amount: number): string =>
  `₹${amount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

/**
 * Compact Indian notation for dashboards: ₹12.8L, ₹1.4Cr, ₹8,500.
 * Used in the admin stat tiles where space is tight.
 */
export const formatINRCompact = (amount: number): string => {
  const abs = Math.abs(amount);
  if (abs >= 1_00_00_000) return `₹${(amount / 1_00_00_000).toFixed(2).replace(/\.00$/, "")}Cr`;
  if (abs >= 1_00_000) return `₹${(amount / 1_00_000).toFixed(2).replace(/\.00$/, "")}L`;
  if (abs >= 1_000) return `₹${(amount / 1_000).toFixed(1).replace(/\.0$/, "")}K`;
  return `₹${Math.round(amount).toLocaleString("en-IN")}`;
};

/** 38,240 — plain Indian-grouped integer (footfall, scans, walkers). */
export const formatCount = (n: number): string => Math.round(n).toLocaleString("en-IN");
