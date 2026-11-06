import type { CrowdStatus } from "@/data/temples";
import { useTranslation } from "react-i18next";

const map: Record<CrowdStatus, { bg: string; fg: string; dot: string; label: string }> = {
  LOW:       { bg: "rgba(22,163,74,0.12)", fg: "#15803D", dot: "#16A34A", label: "Low crowd" },
  MODERATE:  { bg: "rgba(217,119,6,0.12)", fg: "#B45309", dot: "#D97706", label: "Moderate" },
  HIGH:      { bg: "rgba(220,38,38,0.12)", fg: "#B91C1C", dot: "#DC2626", label: "High" },
  CRITICAL:  { bg: "rgba(153,27,27,0.15)", fg: "#7F1D1D", dot: "#991B1B", label: "Critical" },
};

export function CrowdBadge({ status, size = "sm" }: { status: CrowdStatus; size?: "sm" | "md" }) {
  const { t } = useTranslation();
  const c = map[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium ${size === "md" ? "px-3 py-1 text-sm" : "px-2.5 py-0.5 text-xs"}`}
      style={{ background: c.bg, color: c.fg }}
    >
      <span className="w-1.5 h-1.5 rounded-full pulse-soft" style={{ background: c.dot }} />
      {t(c.label)}
    </span>
  );
}
