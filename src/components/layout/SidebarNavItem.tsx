import { Link } from "@tanstack/react-router";
import { memo } from "react";
import { useTranslation } from "react-i18next";
import type { NavEntry } from "./nav-config";

/**
 * One navigation row, shared by the desktop rail and the mobile drawer, so the
 * active-state and tooltip logic lives in a single place.
 */
export const SidebarNavItem = memo(function SidebarNavItem({
  entry,
  active,
  expanded,
  variant = "main",
  showDescription = false,
  onNavigate,
}: {
  entry: NavEntry;
  active: boolean;
  /** When false the rail is collapsed: labels hide and the title becomes the tooltip. */
  expanded: boolean;
  variant?: "main" | "quick" | "footer";
  /** Drawer rows show the one-line purpose under the label. */
  showDescription?: boolean;
  onNavigate?: () => void;
}) {
  const { t } = useTranslation();
  const Icon = entry.icon;
  const label = t(entry.label);
  const description = entry.description ? t(entry.description) : undefined;
  const isEmergency = entry.emphasis === "emergency";

  const height = variant === "footer" ? "min-h-[34px] py-1.5" : "min-h-[40px] py-2";
  const text = variant === "footer" ? "text-[12.5px]" : "text-[13.5px]";

  // Resting appearance.
  const resting = isEmergency
    ? "bg-[#7D2525]/35 text-white ring-1 ring-[#DC2626]/40 hover:bg-[#7D2525]/55 font-medium"
    : variant === "quick"
      ? "bg-white/[0.06] text-white/90 hover:bg-white/[0.12] font-medium"
      : variant === "footer"
        ? "text-white/60 hover:text-white hover:bg-white/10 font-medium"
        : "text-white/85 hover:bg-white/[0.08] hover:text-white font-medium";

  // Active: exact golden amber rounded pill matching devotee design with white text & icon.
  const activeClass = "bg-[#C48437] text-white font-semibold shadow-[0_2px_8px_rgba(0,0,0,0.16)]";

  const className = [
    "group relative flex w-full items-center overflow-hidden rounded-xl px-3.5",
    "transition-all duration-150 outline-none select-none",
    "focus-visible:ring-2 focus-visible:ring-[#F2B84B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B2F25]",
    height,
    text,
    active ? activeClass : resting,
  ].join(" ");

  const inner = (
    <>
      <span className="relative flex h-5 w-5 shrink-0 items-center justify-center">
        <Icon
          className={`h-[18px] w-[18px] shrink-0 transition-transform duration-150 ${
            active ? "text-white" : "text-white/85 group-hover:text-white group-hover:scale-105"
          } ${isEmergency && !active ? "text-[#F87171]" : ""}`}
          aria-hidden
        />
        {/* Unread indicator */}
        {entry.badge && (
          <span className="absolute -right-1 -top-0.5 flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#F2B84B] opacity-70" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#F2B84B] ring-1 ring-[#0B2F25]" />
          </span>
        )}
      </span>

      <span
        className={`ml-3.5 min-w-0 flex-1 text-left transition-all duration-200 ease-in-out ${
          expanded
            ? "max-w-[170px] translate-x-0 opacity-100"
            : "pointer-events-none max-w-0 -translate-x-2 opacity-0"
        }`}
      >
        <span className="block truncate tracking-normal">{label}</span>
        {showDescription && description && (
          <span
            className={`mt-0.5 block truncate text-[11px] font-normal ${
              active ? "text-white/80" : "text-white/50"
            }`}
          >
            {description}
          </span>
        )}
      </span>
    </>
  );

  // No route yet — render a non-interactive row rather than a dead link.
  if (!entry.to) {
    return (
      <div
        className={`${className} cursor-not-allowed opacity-55`}
        title={expanded ? description : `${label} — ${t("Coming soon")}`}
        aria-disabled="true"
      >
        {inner}
        {expanded && (
          <span className="ml-2 shrink-0 rounded-full bg-white/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white/60">
            {t("Soon")}
          </span>
        )}
      </div>
    );
  }

  return (
    <Link
      to={entry.to}
      search={entry.search as never}
      onClick={onNavigate}
      title={expanded ? description : label}
      aria-current={active ? "page" : undefined}
      className={className}
    >
      {inner}
    </Link>
  );
});
