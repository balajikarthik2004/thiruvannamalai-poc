import { Link, useRouterState } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { Home, ChevronRight, MapPin, Bell, ShieldCheck, Settings, Award, MessageCircle, LogOut, User } from "lucide-react";

import { LanguageSwitcher } from "./LanguageSwitcher";
import { MAIN_NAV, QUICK_HELP } from "./nav-config";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/** Extra labels for routes that are not in the sidebar lists. */
const EXTRA_LABELS: Record<string, string> = {
  "/profile": "Settings",
  "/membership": "Membership",
  "/chat": "Ask AI",
  "/admin": "Temple Operations Centre",
  "/notifications": "Announcements",
  "/nearby": "Plan your journey",
  "/temple": "Temple",
  "/booking": "Darshan Booking",
  "/store": "Temple Store",
  "/festivals": "Festival Calendar",
};

/** Best-matching human label for the current path. */
function labelForPath(pathname: string): string | null {
  if (pathname === "/") return null;
  const all = [...MAIN_NAV, ...QUICK_HELP].filter((e) => e.to && e.to !== "/");
  // Longest matching route wins, so /store/cart beats /store.
  const match = all
    .filter((e) => pathname === e.to || pathname.startsWith(e.to + "/"))
    .sort((a, b) => (b.to!.length - a.to!.length))[0];
  if (match) return match.label;

  const base = "/" + pathname.split("/").filter(Boolean)[0];
  return EXTRA_LABELS[base] ?? null;
}

/**
 * App-wide header: where you are on the left, and the devotee's own controls —
 * place, language, alerts and profile — on the right.
 */
export function TopBar({ slotRef }: { slotRef: (node: HTMLDivElement | null) => void }) {
  const { t } = useTranslation();
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const label = labelForPath(pathname);
  // The dashboard fills the slot with its State / District / Temple pickers;
  // every other page shows the breadcrumb instead.
  const isHome = pathname === "/";

  return (
    <header className="sticky top-0 z-30 hidden h-16 shrink-0 items-center justify-between gap-3 border-b border-[#E9E2D8] bg-[#FAF7F0]/92 px-4 backdrop-blur-md print:hidden lg:flex lg:px-7">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        {/* Page-supplied controls */}
        <div ref={slotRef} className="flex min-w-0 items-center gap-2 lg:gap-3" />

        {!isHome && (
          <nav aria-label={t("Breadcrumb")} className="flex min-w-0 items-center gap-1.5 text-sm">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 font-medium text-[#77736C] transition-colors hover:text-[#003D2E]"
            >
              <Home className="h-4 w-4" />
              {t("Home")}
            </Link>
            {label && (
              <>
                <ChevronRight className="h-3.5 w-3.5 shrink-0 text-[#c9c2b6]" />
                <span className="truncate font-bold text-[#003D2E]">{t(label)}</span>
              </>
            )}
          </nav>
        )}
      </div>

      {/* Devotee controls */}
      <div className="flex shrink-0 items-center gap-2">
        <span className="hidden items-center gap-1.5 rounded-full border border-[#E9E2D8] bg-[#FFFDFC] px-3 py-1.5 text-xs font-semibold text-[#202124] shadow-sm xl:inline-flex">
          <MapPin className="h-3.5 w-3.5 text-[#D99A32]" />
          {t("Thiruvannamalai")}
        </span>

        <div className="rounded-full border border-[#E9E2D8] bg-[#FFFDFC] px-1 shadow-sm">
          <LanguageSwitcher className="!px-2 !py-1.5 text-[#202124]" variant="labelled" />
        </div>

        <Link
          to="/notifications"
          aria-label={t("Announcements")}
          title={t("Announcements")}
          className="relative flex h-9 w-9 items-center justify-center rounded-full border border-[#E9E2D8] bg-[#FFFDFC] text-[#77736C] shadow-sm transition-colors hover:text-[#003D2E]"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#DC2626] text-[9px] font-bold text-white">
            1
          </span>
        </Link>

        <ProfileMenu />
      </div>
    </header>
  );
}

function ProfileMenu() {
  const { t } = useTranslation();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={t("Profile")}
          className="flex h-9 w-9 overflow-hidden rounded-full border-2 border-[#D99A32] shadow-sm transition-transform hover:scale-105 focus-visible:ring-2 focus-visible:ring-[#F2B84B] focus-visible:ring-offset-2"
        >
          <img src="/store/devotee.png" alt="Profile" className="h-full w-full object-cover" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex items-center gap-2.5 py-2.5">
          <img src="/store/devotee.png" alt="Profile" className="h-9 w-9 shrink-0 rounded-full object-cover border border-[#D99A32]/40" />
          <span className="min-w-0">
            <span className="block truncate text-sm font-bold text-[#202124]">Ramesh Anandan</span>
            <span className="block truncate text-[11px] font-normal text-[#77736C]">
              {t("Devotee since 2024")}
            </span>
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link to="/profile" className="cursor-pointer gap-2">
            <User className="h-4 w-4" /> {t("My Profile")}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/journey" className="cursor-pointer gap-2">
            <Award className="h-4 w-4" /> {t("My Journey")}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/membership" className="cursor-pointer gap-2">
            <Award className="h-4 w-4" /> {t("Membership")}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/chat" className="cursor-pointer gap-2">
            <MessageCircle className="h-4 w-4" /> {t("Ask AI")}
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/profile" className="cursor-pointer gap-2">
            <Settings className="h-4 w-4" /> {t("Settings")}
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        {/* Temple staff console — kept out of the devotee sidebar. */}
        <DropdownMenuItem asChild>
          <Link to="/admin" className="cursor-pointer gap-2 text-[#8a6410]">
            <ShieldCheck className="h-4 w-4" /> {t("Temple Operations")}
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer gap-2 text-[#DC2626] focus:text-[#DC2626]">
          <LogOut className="h-4 w-4" /> {t("Sign out")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
