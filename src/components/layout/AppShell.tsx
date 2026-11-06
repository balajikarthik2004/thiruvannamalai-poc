import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ArrowLeft,
  Bell,
  Menu,
  X,
  PhoneCall,
} from "lucide-react";

import { LanguageSwitcher } from "../layout/LanguageSwitcher";
import { OmWatermark } from "./OmWatermark";
import { SidebarNavItem } from "./SidebarNavItem";
import { TopBar } from "./TopBar";
import { TopBarSlotProvider } from "./topbar-slot";
import { MAIN_NAV, MOBILE_BOTTOM_NAV, type NavEntry } from "./nav-config";
import omLogo from "../../assets/om_logo.png";
import sidebarArt from "../../assets/sidebar.png";
import { CartWidget } from "@/features/store/components/CartWidget";

/** Exact dark forest green background from the devotee specification. */
const SIDEBAR_BG = "#0B2F25";

export function AppShell() {
  const { t } = useTranslation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  // The live DOM node the top bar lends to pages that need their own controls.
  const [topBarSlot, setTopBarSlot] = useState<HTMLDivElement | null>(null);
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const searchStr = useRouterState({ select: (r) => r.location.searchStr });

  const isActive = useCallback(
    (entry: NavEntry) => {
      if (!entry.to) return false;
      const pathMatch = entry.exact
        ? pathname === entry.to
        : pathname === entry.to || pathname.startsWith(entry.to + "/");
      if (!pathMatch) return false;
      // Deep links differ only by their search params, so compare those too.
      if (entry.search) {
        return Object.entries(entry.search).every(([k, v]) =>
          new URLSearchParams(searchStr).get(k) === v
        );
      }
      return true;
    },
    [pathname, searchStr]
  );

  // Close the mobile drawer on navigation and on Escape.
  useEffect(() => setDrawerOpen(false), [pathname, searchStr]);
  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setDrawerOpen(false);
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  const railContent = (inDrawer: boolean) => {
    return (
      <div className="flex h-full w-full flex-col">
        {/* A. Brand header */}
        <div className="relative z-10 flex shrink-0 items-center justify-between px-4 pt-5 pb-3">
          <Link
            to="/"
            onClick={() => setDrawerOpen(false)}
            className="group flex min-w-0 items-center gap-3 transition-opacity hover:opacity-95"
            title="OMG Devotee — DEVI"
          >
            <img
              src={omLogo}
              alt="Om"
              className="h-9 w-9 shrink-0 object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]"
            />
            <div className="flex min-w-0 flex-col">
              <span className="font-sans text-[17px] font-bold leading-tight tracking-normal text-white">
                OMG Devotee
              </span>
              <span className="mt-0.5 text-[12px] font-semibold uppercase tracking-[0.14em] text-emerald-100/70">
                {t("DEVI")}
              </span>
            </div>
          </Link>

          {inDrawer && (
            <button
              type="button"
              onClick={() => setDrawerOpen(false)}
              aria-label={t("Close menu")}
              className="ml-auto flex h-8 w-8 items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Subtle divider */}
        <div className="mx-4 mb-2 h-px bg-white/10 shrink-0" />

        {/* B. Navigation list */}
        <nav
          aria-label={t("Main navigation")}
          className="relative z-10 flex-1 space-y-1 overflow-y-auto px-3 py-1 [-ms-overflow-style:none] scrollbar-none [&::-webkit-scrollbar]:hidden"
        >
          {MAIN_NAV.map((entry) => (
            <SidebarNavItem
              key={entry.label}
              entry={entry}
              active={isActive(entry)}
              expanded={true}
              onNavigate={() => setDrawerOpen(false)}
            />
          ))}
        </nav>

        {/* C. Bottom decorative section — Tiruvannamalai gopuram & Arunachala mountain */}
        <div className="relative mt-auto w-full shrink-0 overflow-hidden" aria-hidden>
          <img
            src={sidebarArt}
            alt=""
            loading="lazy"
            decoding="async"
            className="h-56 w-full object-cover object-bottom"
          />
          {/* Smooth top fade into the dark forest green sidebar background */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#0B2F25] via-[#0B2F25]/60 to-transparent" />
        </div>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* Desktop rail */}
      <aside
        aria-label={t("Sidebar")}
        className="z-50 hidden shrink-0 flex-col text-white print:hidden lg:flex w-[236px]"
        style={{ background: SIDEBAR_BG, boxShadow: "4px 0 24px rgba(0,0,0,0.14)" }}
      >
        <div className="sticky top-0 flex h-screen w-full flex-col overflow-hidden">
          {railContent(false)}
        </div>
      </aside>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-[80] lg:hidden" role="dialog" aria-modal="true" aria-label={t("Menu")}>
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setDrawerOpen(false)}
          />
          <div
            className="absolute inset-y-0 left-0 flex w-[260px] max-w-[85vw] flex-col text-white shadow-2xl animate-in slide-in-from-left duration-250 overflow-hidden"
            style={{ background: SIDEBAR_BG }}
          >
            {railContent(true)}
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="relative flex min-h-screen min-w-0 flex-1 flex-col pb-16 lg:pb-0">
        {/* Mobile header */}
        <header
          className="sticky top-0 z-40 flex h-14 shrink-0 items-center justify-between overflow-hidden border-b border-white/10 px-3 shadow-md print:hidden lg:hidden"
          style={{ background: SIDEBAR_BG }}
        >
          <div className="flex min-w-0 items-center gap-1.5">
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              aria-label={t("Open menu")}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white/90 transition-colors hover:bg-white/10"
            >
              <Menu className="h-5 w-5" />
            </button>
            {pathname !== "/" && (
              <Link
                to="/"
                aria-label={t("Back")}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/10 hover:text-white"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
            )}
            <Link to="/" className="group flex min-w-0 items-center gap-2.5">
              <img src={omLogo} alt="Om" className="h-7 w-7 shrink-0 object-contain" />
              <span className="truncate font-sans text-base font-bold tracking-tight text-white">
                {t("OMG Devotee")}
              </span>
            </Link>
          </div>

          <div className="flex shrink-0 items-center gap-1">
            {/* Emergency stays one tap away on mobile */}
            <Link
              to="/help"
              aria-label={t("Emergency Help")}
              title={t("Emergency Help")}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-[#DC2626] text-white shadow-md transition-transform hover:scale-105"
            >
              <PhoneCall className="h-4 w-4" />
            </Link>
            <LanguageSwitcher className="h-9 w-9 text-white/80" />
            <Link
              to="/notifications"
              aria-label={t("Notifications")}
              className="relative flex h-9 w-9 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/10"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#F2B84B]" />
            </Link>
          </div>
        </header>

        {/* The single app-wide header. Pages add their own controls through
            TopBarPortal rather than rendering a second bar. */}
        <TopBarSlotProvider value={topBarSlot}>
          <TopBar slotRef={setTopBarSlot} />

          <div className="relative flex-1">
            <Outlet />
          </div>
        </TopBarSlotProvider>
        <CartWidget />
        <OmWatermark className="pointer-events-none fixed bottom-4 right-4 hidden h-28 w-28 text-foreground opacity-[0.03] lg:block" />
      </main>

      {/* Mobile bottom bar */}
      <nav
        aria-label={t("Primary")}
        className="fixed inset-x-0 bottom-0 z-50 grid h-14 grid-cols-5 border-t border-[#E9E2D8] bg-[#FFFDFC] shadow-lg print:hidden lg:hidden"
      >
        {MOBILE_BOTTOM_NAV.map((entry) => {
          const Icon = entry.icon;
          const active = isActive(entry);
          return (
            <Link
              key={entry.label}
              to={entry.to!}
              className={`relative flex flex-col items-center justify-center gap-0.5 text-[10px] transition-all ${
                active ? "text-[#0B2F25]" : "text-[#77736C] hover:text-[#202124]"
              }`}
            >
              {active && (
                <span className="absolute top-0 left-1/2 h-0.5 w-6 -translate-x-1/2 rounded-b-full bg-[#C48437]" />
              )}
              <span className={`rounded-lg p-1 transition-all ${active ? "bg-[#0B2F25]/10" : ""}`}>
                <Icon className="h-5 w-5" />
              </span>
              <span className={`max-w-full truncate px-0.5 font-medium ${active ? "opacity-100" : "opacity-75"}`}>
                {t(entry.label)}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
