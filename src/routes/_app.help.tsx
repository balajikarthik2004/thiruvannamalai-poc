import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { QUICK_HELP, type NavEntry } from "@/components/layout/nav-config";
import {
  ChevronRight,
  LifeBuoy,
  Phone,
  Mail,
  MessageCircle,
  ChevronDown,
  HeartPulse,
  ShieldAlert,
  Baby,
  MapPin,
  Clock,
  ArrowRight,
} from "lucide-react";

export const Route = createFileRoute("/_app/help")({
  head: () => ({
    meta: [
      { title: "Help & Support — OMG Devotee" },
      { name: "description", content: "Emergency numbers, temple contacts and answers to common devotee questions." },
    ],
  }),
  component: HelpPage,
});

const EMERGENCY = [
  { icon: HeartPulse, label: "Medical emergency", detail: "Ambulance & first aid", number: "108", tone: "text-rose-600 bg-rose-50 border-rose-200" },
  { icon: ShieldAlert, label: "Police control room", detail: "Crowd & security", number: "100", tone: "text-blue-700 bg-blue-50 border-blue-200" },
  { icon: Baby, label: "Lost & Found", detail: "Lost child or belongings", number: "1098", tone: "text-amber-700 bg-amber-50 border-amber-200" },
  { icon: Phone, label: "Fire & rescue", detail: "Fire emergencies", number: "101", tone: "text-orange-700 bg-orange-50 border-orange-200" },
];

const CONTACTS = [
  { icon: Phone, label: "Temple office", value: "04175 252 438", note: "6:00 AM – 9:00 PM daily" },
  { icon: Mail, label: "Email", value: "arunachaleswarar@tnhrce.gov.in", note: "Replies within 2 working days" },
  { icon: MapPin, label: "HR&CE office", value: "Tiruvannamalai, Tamil Nadu 606601", note: "Mon–Fri, 10 AM – 5 PM" },
];

const FAQS = [
  {
    q: "How long does the Girivalam walk take?",
    a: "Most devotees complete the 14 km circuit in 4 to 5 hours at a steady walking pace. Allow longer on Pournami nights, when the route is far more crowded and the queues at each lingam are longer.",
  },
  {
    q: "What is the best time to start Girivalam?",
    a: "Between 4:00 AM and 6:00 AM, or after 8:00 PM. The granite path becomes painfully hot for bare feet after 10 AM, and the midday temperature can reach 34°C.",
  },
  {
    q: "Can I book a darshan slot in advance?",
    a: "Yes. Open Darshan Booking from the sidebar, choose your date and time slot, enter the devotee details and pay. You receive a QR entry pass that is scanned at the gate — it works offline.",
  },
  {
    q: "Is there free food on the route?",
    a: "Annadhanam is served free at seven points along the Girivalam route, and through the night at the Varuna Lingam point on Pournami days.",
  },
  {
    q: "What should I carry for the walk?",
    a: "Drinking water, a torch if you walk before dawn, and comfortable footwear for the approach. The circuit itself is walked barefoot. Water stations are marked on the Facilities tab.",
  },
  {
    q: "How is the crowd level calculated?",
    a: "Each gate, zone and route segment has a maximum safe occupancy set by the HR&CE crowd-safety plan. The percentage you see is the current count against that maximum, updated through the day.",
  },
];

/** One Quick Help shortcut. Planned items render as a clearly inactive card. */
function QuickHelpCard({ entry }: { entry: NavEntry }) {
  const { t } = useTranslation();
  const Icon = entry.icon;
  const emergency = entry.emphasis === "emergency";

  const body = (
    <>
      <span
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
          emergency ? "bg-[#DC2626] text-white shadow-md shadow-[#DC2626]/25" : "bg-[#F1F7F3] text-[#003D2E]"
        }`}
      >
        <Icon className="h-5 w-5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2">
          <span className={`truncate font-bold ${emergency ? "text-[#7D2525]" : "text-[#202124]"}`}>
            {t(entry.label)}
          </span>
          {entry.badge && (
            <span className="shrink-0 rounded-full bg-[#F2B84B]/25 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-[#8a6410]">
              {t("Live")}
            </span>
          )}
          {!entry.to && (
            <span className="shrink-0 rounded-full bg-[#E9E2D8] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-[#77736C]">
              {t("Soon")}
            </span>
          )}
        </span>
        <span className="mt-0.5 block text-xs leading-snug text-[#77736C]">
          {entry.description ? t(entry.description) : null}
        </span>
      </span>
      {entry.to && <ChevronRight className="h-5 w-5 shrink-0 self-center text-[#c9c2b6]" />}
    </>
  );

  const shell = `flex h-full items-start gap-3 rounded-2xl border p-4 transition-all ${
    emergency
      ? "border-rose-200 bg-gradient-to-r from-rose-50 to-rose-100/40 hover:border-rose-300 hover:shadow-md"
      : "border-[#E9E2D8] bg-[#FFFDFC] hover:border-[#D99A32]/60 hover:shadow-md"
  }`;

  if (!entry.to) {
    return (
      <div className={`${shell} cursor-not-allowed opacity-60`} aria-disabled="true">
        {body}
      </div>
    );
  }

  // Emergency Help points at the numbers already on this page.
  if (emergency) {
    return (
      <a href="#emergency" className={shell}>
        {body}
      </a>
    );
  }

  return (
    <Link to={entry.to} search={entry.search as never} className={shell}>
      {body}
    </Link>
  );
}

function HelpPage() {
  const { t } = useTranslation();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="min-h-screen gv-surface pb-10">
      <header className="border-b border-[#e9e2d2] px-4 pb-7 pt-7 lg:px-7">
        <div className="mx-auto max-w-[1540px]">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#e0cf9a] bg-[#fdf6e3] px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-[#b8860b]">
            <LifeBuoy className="h-4 w-4" /> {t("Help & Support")}
          </span>
          <h1 className="mt-3 font-serif text-3xl font-bold text-[#14532d]">
            {t("We are here to help")}
          </h1>
          <p className="mt-2 max-w-xl text-sm text-slate-600">
            {t("Emergency numbers, temple contacts and answers to the questions devotees ask most.")}
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-[1540px] space-y-4 px-4 pt-5 lg:px-7">
        {/* Quick Help & Essentials — the devotee's six most-needed shortcuts */}
        <section>
          <h2 className="mb-1 font-serif text-lg font-bold text-[#003D2E]">
            {t("Quick Help & Essentials")}
          </h2>
          <p className="mb-3 text-sm text-[#77736C]">
            {t("Everything you may need in a hurry, in one place.")}
          </p>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {QUICK_HELP.map((entry) => (
              <li key={entry.label}>
                <QuickHelpCard entry={entry} />
              </li>
            ))}
          </ul>
        </section>

        {/* Emergency */}
        <section id="emergency" className="scroll-mt-20 rounded-2xl border border-rose-200 bg-gradient-to-r from-rose-50 to-rose-100/50 p-5">
          <h2 className="mb-3 flex items-center gap-2 font-serif text-lg font-bold text-rose-900">
            <Phone className="h-5 w-5" /> {t("Emergency numbers")}
          </h2>
          <ul className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
            {EMERGENCY.map((e) => (
              <li key={e.number}>
                <a
                  href={`tel:${e.number}`}
                  className="flex items-center gap-3 rounded-xl border border-white bg-white/80 p-3 transition-all hover:shadow-md"
                >
                  <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${e.tone}`}>
                    <e.icon className="h-5 w-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-bold text-slate-900">{t(e.label)}</span>
                    <span className="block truncate text-xs text-slate-500">{t(e.detail)}</span>
                  </span>
                  <span className="shrink-0 font-mono text-base font-black text-rose-700">{e.number}</span>
                </a>
              </li>
            ))}
          </ul>
        </section>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start">
          {/* FAQs */}
          <section className="gv-card p-5">
            <h2 className="mb-4 font-serif text-lg font-bold text-[#14532d]">
              {t("Frequently asked questions")}
            </h2>
            <ul className="divide-y divide-[#f3eee2]">
              {FAQS.map((f, i) => {
                const isOpen = open === i;
                return (
                  <li key={f.q}>
                    <button
                      type="button"
                      onClick={() => setOpen(isOpen ? null : i)}
                      aria-expanded={isOpen}
                      className="flex w-full items-center justify-between gap-3 py-3.5 text-left"
                    >
                      <span className="text-sm font-semibold text-slate-800">{t(f.q)}</span>
                      <ChevronDown
                        className={`h-4 w-4 shrink-0 text-[#b8860b] transition-transform ${isOpen ? "rotate-180" : ""}`}
                      />
                    </button>
                    {isOpen && (
                      <p className="animate-in fade-in pb-4 pr-6 text-sm leading-relaxed text-slate-600 duration-200">
                        {t(f.a)}
                      </p>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>

          <aside className="space-y-4">
            {/* Contacts */}
            <section className="gv-card p-5">
              <h2 className="mb-3 font-serif text-base font-bold text-[#14532d]">
                {t("Temple contacts")}
              </h2>
              <ul className="space-y-3">
                {CONTACTS.map((c) => (
                  <li key={c.label} className="flex gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#f1f7f3] text-[#217a4f]">
                      <c.icon className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <div className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
                        {t(c.label)}
                      </div>
                      <div className="break-words text-sm font-semibold text-slate-800">{c.value}</div>
                      <div className="flex items-center gap-1 text-[11px] text-slate-400">
                        <Clock className="h-3 w-3" /> {t(c.note)}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            {/* Ask AI */}
            <Link
              to="/chat"
              className="flex items-center gap-3.5 rounded-2xl border border-[#cfe3d6] bg-gradient-to-r from-[#eef7f1] to-[#e3f1e8] p-5 shadow-sm transition-all hover:border-[#217a4f]/40 hover:shadow-md"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#14532d] text-white shadow-md">
                <MessageCircle className="h-5 w-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-serif text-base font-bold text-[#14532d]">
                  {t("Ask the AI assistant")}
                </span>
                <span className="block text-xs text-[#2f6b4c]">
                  {t("Timings, poojas, travel and darshan questions — answered instantly.")}
                </span>
              </span>
              <ArrowRight className="h-5 w-5 shrink-0 text-[#217a4f]/60" />
            </Link>
          </aside>
        </div>
      </div>
    </div>
  );
}
