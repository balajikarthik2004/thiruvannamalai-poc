import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Flower2,
  Leaf,
  Utensils,
  CalendarDays,
  Infinity as InfinityIcon,
  Check,
  Clock,
  ArrowRight,
  ShieldCheck,
  Zap,
  CreditCard,
  Info,
  ChevronDown,
  Building2,
  Flame,
  X,
  Phone,
  User,
  CheckCircle2,
} from "lucide-react";
import {
  TIRUVANNAMALAI_DAILY_POOJAS,
  UPCOMING_FESTIVALS,
  ARCHANA_OFFERINGS,
  PRASADAM_OFFERINGS,
  NITHYA_SEVA_OFFERINGS,
  type DailyPooja,
  type PoojaFestival,
  type OfferingItem,
} from "@/data/poojas-data";

export const Route = createFileRoute("/_app/poojas")({
  validateSearch: (search: Record<string, unknown>) => {
    return {
      temple: (search.temple as string) || "tiruvannamalai",
      tab: (search.tab as string) || "poojas",
    };
  },
  head: () => ({ meta: [{ title: "Pooja & Seva — Thiruvanamalai Arunachaleswarar Temple" }] }),
  component: PoojaPage,
});

type TabType = "poojas" | "archana" | "prasadam" | "festivals" | "nithya";

function PoojaPage() {
  const { t } = useTranslation();
  const search = Route.useSearch();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<TabType>(
    (search.tab as TabType) || "poojas"
  );
  const [selectedDateLabel, setSelectedDateLabel] = useState("Today, 21 Nov 2026");
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Selected pooja for the right sidebar card
  const [selectedPooja, setSelectedPooja] = useState<DailyPooja>(
    TIRUVANNAMALAI_DAILY_POOJAS.find((p) => p.id === "uchikalam") ||
      TIRUVANNAMALAI_DAILY_POOJAS[2]
  );

  // Quick booking modal state
  const [bookingModalItem, setBookingModalItem] = useState<{
    name: string;
    tamilName?: string;
    price: number;
    category: string;
  } | null>(null);
  const [devoteeName, setDevoteeName] = useState("");
  const [devoteePhone, setDevoteePhone] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const handleOpenBooking = (item: {
    name: string;
    tamilName?: string;
    price: number;
    category: string;
  }) => {
    setBookingModalItem(item);
    setBookingSuccess(false);
  };

  const handleConfirmPoojaBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingSuccess(true);
    setTimeout(() => {
      setBookingModalItem(null);
      setBookingSuccess(false);
    }, 2500);
  };

  const availableDates = [
    "Today, 21 Nov 2026",
    "Tomorrow, 22 Nov 2026",
    "Somavaram, 23 Nov 2026",
    "Karthigai Deepam, 24 Nov 2026",
    "Pradosham, 28 Nov 2026",
    "Pournami, 15 Dec 2026",
  ];

  return (
    <div className="min-h-screen bg-[#FAF6F0] pb-16">
      {/* 1. Header Banner */}
      <header className="relative w-full overflow-hidden border-b border-[#E8E2D5] bg-[#FAF6F0]">
        {/* Right background panoramic artwork in HD (1920x1280) */}
        <div
          className="pointer-events-none absolute inset-y-0 right-0 w-full sm:w-3/5 lg:w-1/2"
          aria-hidden
        >
          <img
            src="/temples/tiruvannamalai/temple-hill.jpg"
            alt=""
            className="h-full w-full object-cover object-right brightness-95"
            onError={(e) => {
              (e.target as HTMLElement).src = "/pooja_banner_bg.jpg";
            }}
          />
          {/* Subtle gradient blending left into the warm background */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#FAF6F0] via-[#FAF6F0]/70 to-transparent" />
        </div>

        <div className="relative mx-auto max-w-[1440px] px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 sm:gap-5">
            {/* Golden Trishul icon in HD */}
            <div className="flex h-14 w-12 sm:h-16 sm:w-14 shrink-0 items-center justify-center">
              <img
                src="/trishul_gold_hd.png"
                alt="Trishul"
                className="h-13 sm:h-15 w-auto object-contain drop-shadow-[0_2px_8px_rgba(217,119,6,0.35)]"
                onError={(e) => {
                  (e.target as HTMLElement).src = "/trishul_gold.png";
                }}
              />
            </div>

            {/* Title & Description */}
            <div className="min-w-0">
              <h1 className="font-serif text-2xl font-bold leading-tight tracking-tight text-[#073C2C] sm:text-3xl lg:text-4xl">
                {t("Pooja & Seva")}
              </h1>
              <p className="mt-1 text-xs font-medium text-slate-600 sm:text-sm">
                {t("Book temple poojas, sevas and offerings at Thiruvanamalai Arunachaleswarar Temple")}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="mx-auto max-w-[1440px] px-4 pt-4 sm:px-6 lg:px-8">
        {/* 2. Category Filter Tabs Row */}
        <nav
          aria-label={t("Pooja categories")}
          className="mb-5 flex items-center gap-2.5 overflow-x-auto pb-1 [-ms-overflow-style:none] scrollbar-none [&::-webkit-scrollbar]:hidden"
        >
          <button
            type="button"
            onClick={() => setActiveTab("poojas")}
            className={`inline-flex shrink-0 items-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold transition-all ${
              activeTab === "poojas"
                ? "bg-[#073C2C] text-white shadow-xs"
                : "border border-slate-200 bg-white text-slate-700 hover:border-slate-300"
            }`}
          >
            <Flower2 className="h-4 w-4" />
            {t("Temple Poojas & Sevas")}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("archana")}
            className={`inline-flex shrink-0 items-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold transition-all ${
              activeTab === "archana"
                ? "bg-[#073C2C] text-white shadow-xs"
                : "border border-slate-200 bg-white text-slate-700 hover:border-slate-300"
            }`}
          >
            <Leaf className="h-4 w-4 text-emerald-600" />
            {t("Archana & Offerings")}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("prasadam")}
            className={`inline-flex shrink-0 items-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold transition-all ${
              activeTab === "prasadam"
                ? "bg-[#073C2C] text-white shadow-xs"
                : "border border-slate-200 bg-white text-slate-700 hover:border-slate-300"
            }`}
          >
            <Utensils className="h-4 w-4 text-amber-600" />
            {t("Prasadam")}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("festivals")}
            className={`inline-flex shrink-0 items-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold transition-all ${
              activeTab === "festivals"
                ? "bg-[#073C2C] text-white shadow-xs"
                : "border border-slate-200 bg-white text-slate-700 hover:border-slate-300"
            }`}
          >
            <CalendarDays className="h-4 w-4 text-rose-600" />
            {t("Temple Festivals")}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("nithya")}
            className={`inline-flex shrink-0 items-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold transition-all ${
              activeTab === "nithya"
                ? "bg-[#073C2C] text-white shadow-xs"
                : "border border-slate-200 bg-white text-slate-700 hover:border-slate-300"
            }`}
          >
            <InfinityIcon className="h-4 w-4 text-blue-600" />
            {t("Nithya Seva")}
          </button>
        </nav>

        {/* 3. Main Grid Layout */}
        <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_340px] xl:grid-cols-[minmax(0,1fr)_360px]">
          {/* Left Column */}
          <div className="min-w-0 space-y-5">
            {/* Tab 1: Default - Daily Pooja Schedule & Festivals */}
            {activeTab === "poojas" && (
              <>
                {/* Daily Pooja Schedule Card */}
                <section className="rounded-2xl border border-[#E8E2D5] bg-white p-4 sm:p-5 shadow-xs">
                  {/* Card Header */}
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-[#A86221]">
                        <Building2 className="h-5 w-5 text-[#A86221]" />
                      </div>
                      <div>
                        <h2 className="font-serif text-base font-bold text-[#073C2C] sm:text-lg">
                          {t("Daily Pooja Schedule")}
                        </h2>
                        <p className="text-[11px] font-medium text-slate-500">
                          {t("Regular poojas at Thiruvanamalai Arunachaleswarar Temple")}
                        </p>
                      </div>
                    </div>

                    {/* Date Selector Dropdown */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setShowDatePicker(!showDatePicker)}
                        className="inline-flex items-center gap-2 rounded-lg border border-[#16A34A]/40 bg-[#F0FDF4] px-3 py-1.5 text-xs font-bold text-[#166534] transition-colors hover:bg-[#DCFCE7]"
                      >
                        <CalendarDays className="h-3.5 w-3.5 text-[#16A34A]" />
                        <span>{selectedDateLabel}</span>
                        <ChevronDown className="h-3.5 w-3.5" />
                      </button>

                      {showDatePicker && (
                        <div className="absolute right-0 top-full z-20 mt-1.5 w-52 rounded-xl border border-slate-200 bg-white py-1 shadow-lg">
                          {availableDates.map((dateStr) => (
                            <button
                              key={dateStr}
                              type="button"
                              onClick={() => {
                                setSelectedDateLabel(dateStr);
                                setShowDatePicker(false);
                              }}
                              className={`w-full px-3 py-2 text-left text-xs transition-colors hover:bg-slate-50 ${
                                selectedDateLabel === dateStr
                                  ? "bg-[#F0FDF4] font-bold text-[#166534]"
                                  : "text-slate-700"
                              }`}
                            >
                              {dateStr}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Pooja Schedule Timeline List */}
                  <div className="space-y-2">
                    {TIRUVANNAMALAI_DAILY_POOJAS.map((pooja) => {
                      const isSelected = selectedPooja.id === pooja.id;
                      const isNext = pooja.status === "next";
                      const isCompleted = pooja.status === "completed";

                      return (
                        <div
                          key={pooja.id}
                          onClick={() => setSelectedPooja(pooja)}
                          className={`group flex cursor-pointer items-center justify-between gap-3 rounded-xl border p-2.5 transition-all sm:p-3 ${
                            isNext
                              ? "border-[#FDE68A] bg-[#FFFBEB] shadow-xs"
                              : isSelected
                              ? "border-[#16A34A] bg-[#F0FDF4]/50"
                              : "border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50/50"
                          }`}
                        >
                          {/* Time & Timeline dot */}
                          <div className="flex items-center gap-2.5 sm:gap-3">
                            <span
                              className={`h-2.5 w-2.5 shrink-0 rounded-full ${
                                isCompleted
                                  ? "bg-[#16A34A]"
                                  : isNext
                                  ? "bg-[#D97706] ring-4 ring-[#FEF3C7]"
                                  : "bg-slate-300"
                              }`}
                            />
                            <span className="w-16 shrink-0 text-xs font-bold text-slate-800 sm:w-20 sm:text-sm">
                              {pooja.time}
                            </span>

                            {/* Small thumbnail */}
                            <div className="h-9 w-12 shrink-0 overflow-hidden rounded-md border border-slate-200 bg-slate-100">
                              <img
                                src={pooja.image}
                                alt={pooja.name}
                                className="h-full w-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLElement).style.display = "none";
                                }}
                              />
                            </div>

                            {/* Name & description */}
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <h3 className="truncate text-xs font-bold text-slate-900 group-hover:text-[#073C2C] sm:text-sm">
                                  {t(pooja.name)}
                                </h3>
                                <span className="hidden truncate text-[11px] font-medium text-slate-500 md:inline">
                                  {pooja.tamilName}
                                </span>
                              </div>
                              <p className="hidden truncate text-[11px] text-slate-500 sm:block">
                                {t(pooja.description)}
                              </p>
                            </div>
                          </div>

                          {/* Status Badge */}
                          <div className="shrink-0">
                            {isCompleted && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-[#F0FDF4] px-2.5 py-1 text-[11px] font-bold text-[#166534] border border-[#DCFCE7]">
                                <Check className="h-3 w-3 stroke-[3]" />
                                {t("Completed")}
                              </span>
                            )}

                            {isNext && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-[#FEF3C7] px-3 py-1 text-[11px] font-bold text-[#92400E] border border-[#FDE68A] animate-pulse">
                                <Clock className="h-3 w-3" />
                                {t("Next Pooja")} &gt;
                              </span>
                            )}

                            {pooja.status === "upcoming" && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
                                <Check className="h-3 w-3" />
                                {t("Upcoming")}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>

                {/* Upcoming Temple Festivals Card */}
                <section className="rounded-2xl border border-[#E8E2D5] bg-white p-4 sm:p-5 shadow-xs">
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="flex items-center gap-2 font-serif text-base font-bold text-[#073C2C]">
                      <CalendarDays className="h-4.5 w-4.5 text-[#A86221]" />
                      {t("Upcoming Temple Festivals")}
                    </h2>
                    <Link
                      to="/festivals"
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#A86221] hover:underline"
                    >
                      {t("View Festival Calendar")}
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>

                  {/* 3 Festival Cards Grid */}
                  <div className="grid gap-3.5 sm:grid-cols-3">
                    {UPCOMING_FESTIVALS.map((fest) => (
                      <div
                        key={fest.id}
                        className="group flex flex-col justify-between overflow-hidden rounded-xl border border-slate-200 bg-white p-3 transition-all hover:border-[#16A34A]/50 hover:shadow-xs"
                      >
                        <div>
                          {/* Image */}
                          <div className="mb-2.5 h-24 w-full overflow-hidden rounded-lg bg-slate-100">
                            <img
                              src={fest.image}
                              alt={fest.name}
                              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = "none";
                              }}
                            />
                          </div>

                          <h3 className="font-serif text-xs font-bold text-slate-900 group-hover:text-[#073C2C]">
                            {t(fest.name)}
                          </h3>
                          <div className="my-1.5 inline-flex items-center gap-1 rounded-md bg-[#FFF1F2] px-2 py-0.5 text-[10px] font-bold text-[#BE123C]">
                            <CalendarDays className="h-3 w-3" />
                            {fest.dateBadge}
                          </div>
                          <p className="text-[11px] font-medium text-slate-500 line-clamp-2 leading-tight">
                            {t(fest.description)}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            handleOpenBooking({
                              name: fest.name,
                              price: 500,
                              category: "Festival Seva",
                            })
                          }
                          className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-[#FDE68A] bg-[#FEF3C7] py-1.5 text-xs font-bold text-[#92400E] transition-colors hover:bg-[#FDE68A]"
                        >
                          {t("View & Book")}
                          <ArrowRight className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </section>
              </>
            )}

            {/* Tab 2: Archana & Offerings */}
            {activeTab === "archana" && (
              <section className="rounded-2xl border border-[#E8E2D5] bg-white p-5 shadow-xs">
                <div className="mb-4 flex items-center gap-2">
                  <Leaf className="h-5 w-5 text-emerald-600" />
                  <h2 className="font-serif text-lg font-bold text-[#073C2C]">
                    {t("Archana & Special Offerings")}
                  </h2>
                </div>
                <div className="grid gap-3.5 sm:grid-cols-2">
                  {ARCHANA_OFFERINGS.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-4 transition-all hover:border-[#16A34A]/50 hover:shadow-xs"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <h3 className="font-serif text-sm font-bold text-slate-900">
                            {t(item.name)}
                          </h3>
                          <span className="text-xs font-bold text-[#16A34A]">
                            ₹{item.price}
                          </span>
                        </div>
                        <span className="text-[11px] font-medium text-slate-500">
                          {item.tamilName} · {item.unit}
                        </span>
                        <p className="mt-2 text-xs text-slate-600">
                          {t(item.description)}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          handleOpenBooking({
                            name: item.name,
                            tamilName: item.tamilName,
                            price: item.price,
                            category: "Archana",
                          })
                        }
                        className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-lg bg-[#073C2C] py-2 text-xs font-bold text-white transition-colors hover:bg-[#06432A]"
                      >
                        {t("Book Archana")}
                        <ArrowRight className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Tab 3: Prasadam */}
            {activeTab === "prasadam" && (
              <section className="rounded-2xl border border-[#E8E2D5] bg-white p-5 shadow-xs">
                <div className="mb-4 flex items-center gap-2">
                  <Utensils className="h-5 w-5 text-amber-600" />
                  <h2 className="font-serif text-lg font-bold text-[#073C2C]">
                    {t("Temple Consecrated Prasadam")}
                  </h2>
                </div>
                <div className="grid gap-3.5 sm:grid-cols-2">
                  {PRASADAM_OFFERINGS.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-4 transition-all hover:border-[#16A34A]/50 hover:shadow-xs"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <h3 className="font-serif text-sm font-bold text-slate-900">
                            {t(item.name)}
                          </h3>
                          <span className="text-xs font-bold text-[#16A34A]">
                            ₹{item.price}
                          </span>
                        </div>
                        <span className="text-[11px] font-medium text-slate-500">
                          {item.tamilName} · {item.unit}
                        </span>
                        <p className="mt-2 text-xs text-slate-600">
                          {t(item.description)}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          handleOpenBooking({
                            name: item.name,
                            tamilName: item.tamilName,
                            price: item.price,
                            category: "Prasadam",
                          })
                        }
                        className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-lg bg-[#073C2C] py-2 text-xs font-bold text-white transition-colors hover:bg-[#06432A]"
                      >
                        {t("Order Prasadam")}
                        <ArrowRight className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Tab 4: Festivals */}
            {activeTab === "festivals" && (
              <section className="rounded-2xl border border-[#E8E2D5] bg-white p-5 shadow-xs">
                <div className="mb-4 flex items-center gap-2">
                  <CalendarDays className="h-5 w-5 text-rose-600" />
                  <h2 className="font-serif text-lg font-bold text-[#073C2C]">
                    {t("Annual Temple Brahmotsavams & Festivals")}
                  </h2>
                </div>
                <div className="space-y-3.5">
                  {UPCOMING_FESTIVALS.map((fest) => (
                    <div
                      key={fest.id}
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4"
                    >
                      <div className="flex items-center gap-3.5">
                        <img
                          src={fest.image}
                          alt={fest.name}
                          className="h-16 w-20 shrink-0 rounded-lg object-cover"
                        />
                        <div>
                          <h3 className="font-serif text-sm font-bold text-slate-900">
                            {t(fest.name)}
                          </h3>
                          <span className="text-xs font-semibold text-[#BE123C]">
                            {fest.dateBadge}
                          </span>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {t(fest.description)}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          handleOpenBooking({
                            name: fest.name,
                            price: 500,
                            category: "Festival Special",
                          })
                        }
                        className="w-full sm:w-auto shrink-0 rounded-lg bg-[#073C2C] px-5 py-2 text-xs font-bold text-white transition-colors hover:bg-[#06432A]"
                      >
                        {t("Book Festival Seva")}
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Tab 5: Nithya Seva */}
            {activeTab === "nithya" && (
              <section className="rounded-2xl border border-[#E8E2D5] bg-white p-5 shadow-xs">
                <div className="mb-4 flex items-center gap-2">
                  <InfinityIcon className="h-5 w-5 text-blue-600" />
                  <h2 className="font-serif text-lg font-bold text-[#073C2C]">
                    {t("Nithya Seva (Recurring Endowments)")}
                  </h2>
                </div>
                <div className="space-y-3.5">
                  {NITHYA_SEVA_OFFERINGS.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-serif text-sm font-bold text-slate-900">
                            {t(item.name)}
                          </h3>
                          <span className="text-xs font-bold text-[#16A34A]">
                            ₹{item.price} / {item.unit}
                          </span>
                        </div>
                        <span className="text-[11px] font-medium text-slate-500">
                          {item.tamilName}
                        </span>
                        <p className="text-xs text-slate-600 mt-1">
                          {t(item.description)}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          handleOpenBooking({
                            name: item.name,
                            tamilName: item.tamilName,
                            price: item.price,
                            category: "Nithya Seva",
                          })
                        }
                        className="w-full sm:w-auto shrink-0 rounded-lg bg-[#073C2C] px-5 py-2 text-xs font-bold text-white transition-colors hover:bg-[#06432A]"
                      >
                        {t("Subscribe Seva")}
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right Column */}
          <aside className="space-y-4 lg:sticky lg:top-4">
            {/* Card 1: Book a Pooja / Seva */}
            <section className="rounded-2xl border border-[#E8E2D5] bg-white p-4 sm:p-5 shadow-xs">
              <div className="mb-3.5">
                <h3 className="flex items-center gap-2 font-serif text-sm font-bold text-[#073C2C]">
                  <Flame className="h-4 w-4 text-[#A86221]" />
                  {t("Book a Pooja / Seva")}
                </h3>
                <p className="mt-0.5 text-[11px] font-medium text-slate-500">
                  {t("Select a pooja or seva, choose a date and book online.")}
                </p>
              </div>

              {/* Active Highlighted Pooja Photo & Details */}
              <div className="overflow-hidden rounded-xl border border-slate-100 bg-[#FAF6F0]/40 p-3">
                <div className="mb-3 aspect-4/3 w-full overflow-hidden rounded-lg bg-slate-100 shadow-inner">
                  <img
                    src={selectedPooja.featuredImage || selectedPooja.image}
                    alt={selectedPooja.name}
                    className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = "none";
                    }}
                  />
                </div>

                <div className="space-y-1">
                  <h4 className="font-serif text-sm font-bold text-slate-900">
                    {t(selectedPooja.name)}
                  </h4>
                  <p className="text-xs font-semibold text-[#A86221]">
                    {selectedPooja.tamilName}
                  </p>
                  <p className="text-[11px] text-slate-600 line-clamp-2">
                    {t(selectedPooja.description)}
                  </p>

                  <div className="pt-2 flex items-baseline justify-between">
                    <span className="text-lg font-black text-[#16A34A]">
                      ₹{selectedPooja.price}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    handleOpenBooking({
                      name: selectedPooja.name,
                      tamilName: selectedPooja.tamilName,
                      price: selectedPooja.price,
                      category: "Daily Kaala Pooja",
                    })
                  }
                  className="mt-3.5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#073C2C] py-2.5 text-xs font-bold text-white shadow-xs transition-all hover:bg-[#06432A] hover:shadow-md"
                >
                  {t("Book Now")}
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Carousel indicator dots */}
              <div className="mt-3 flex items-center justify-center gap-1.5">
                <button
                  type="button"
                  aria-label="Pooja 1"
                  onClick={() => setSelectedPooja(TIRUVANNAMALAI_DAILY_POOJAS[2])}
                  className="h-1.5 w-4 rounded-full bg-[#16A34A]"
                />
                <button
                  type="button"
                  aria-label="Pooja 2"
                  onClick={() => setSelectedPooja(TIRUVANNAMALAI_DAILY_POOJAS[1])}
                  className="h-1.5 w-1.5 rounded-full bg-slate-300 hover:bg-slate-400"
                />
              </div>
            </section>

            {/* Card 2: Pooja Booking Guidelines */}
            <section className="rounded-2xl border border-[#E8E2D5] bg-white p-4 sm:p-5 shadow-xs">
              <h3 className="mb-3.5 flex items-center gap-2 font-serif text-sm font-bold text-[#A86221]">
                <Info className="h-4 w-4 text-[#A86221]" />
                {t("Pooja Booking Guidelines")}
              </h3>

              <ul className="space-y-3 text-xs text-slate-700">
                <li className="flex items-start gap-2.5">
                  <CalendarDays className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#A86221]" />
                  <span>
                    <strong className="font-bold text-slate-900">
                      {t("Book at least 1 day in advance")}
                    </strong>{" "}
                    {t("(subject to availability).")}
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CreditCard className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#A86221]" />
                  <span>
                    <strong className="font-bold text-slate-900">
                      {t("Carry a valid ID proof")}
                    </strong>{" "}
                    {t("(as per temple rules).")}
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <User className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#A86221]" />
                  <span>
                    <strong className="font-bold text-slate-900">
                      {t("Only registered devotees")}
                    </strong>{" "}
                    {t("can participate in select poojas.")}
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Flame className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#A86221]" />
                  <span>
                    <strong className="font-bold text-slate-900">
                      {t("Timings are subject to change")}
                    </strong>{" "}
                    {t("on festival days.")}
                  </span>
                </li>
              </ul>
            </section>
          </aside>
        </div>

        {/* 4. Bottom Trust Badges */}
        <div className="mt-8 grid grid-cols-1 gap-4 rounded-2xl border border-[#E8E2D5] bg-white p-4 shadow-xs sm:grid-cols-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-[#16A34A]">
              <ShieldCheck className="h-5 w-5 text-[#16A34A]" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">
                {t("Authorized Temple Booking")}
              </h4>
              <p className="text-[11px] font-medium text-slate-500">
                {t("Book official poojas and sevas directly.")}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 border-t border-slate-100 pt-3 sm:border-l sm:border-t-0 sm:pl-4 sm:pt-0">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <Zap className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">
                {t("Real-time Availability")}
              </h4>
              <p className="text-[11px] font-medium text-slate-500">
                {t("Check current slots and timings.")}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 border-t border-slate-100 pt-3 sm:border-l sm:border-t-0 sm:pl-4 sm:pt-0">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <CreditCard className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">
                {t("Secure & Easy Payment")}
              </h4>
              <p className="text-[11px] font-medium text-slate-500">
                {t("UPI, Card, Net Banking and more.")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Booking Modal */}
      {bookingModalItem && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs"
        >
          <div className="w-full max-w-md rounded-2xl border border-[#E8E2D5] bg-white p-5 shadow-2xl animate-in zoom-in-95">
            <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-serif text-base font-bold text-[#073C2C]">
                  {t("Book Pooja / Seva")}
                </h3>
                <span className="text-[11px] font-medium text-slate-500">
                  {bookingModalItem.category}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setBookingModalItem(null)}
                className="flex h-7 w-7 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {bookingSuccess ? (
              <div className="py-6 text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h4 className="font-serif text-lg font-bold text-slate-900">
                  {t("Pooja Booking Confirmed!")}
                </h4>
                <p className="mt-1 text-xs text-slate-500">
                  {t("Confirmation receipt and SMS sent to")} +91 {devoteePhone || "9876543210"}.
                </p>
              </div>
            ) : (
              <form onSubmit={handleConfirmPoojaBooking} className="space-y-3.5">
                <div className="rounded-xl bg-slate-50 p-3">
                  <div className="flex justify-between text-xs font-bold text-slate-800">
                    <span>{bookingModalItem.name}</span>
                    <span className="text-[#16A34A]">₹{bookingModalItem.price}</span>
                  </div>
                  {bookingModalItem.tamilName && (
                    <p className="text-[11px] font-medium text-slate-500">
                      {bookingModalItem.tamilName}
                    </p>
                  )}
                  <p className="mt-1 text-[11px] text-slate-500">
                    {t("Selected Date")}: {selectedDateLabel}
                  </p>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-700">
                    {t("Devotee Name")} <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={devoteeName}
                    onChange={(e) => setDevoteeName(e.target.value)}
                    placeholder="e.g. Balaji Krishnan"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold text-slate-700">
                    {t("Mobile Number (for Confirmation SMS)")} <span className="text-rose-500">*</span>
                  </label>
                  <div className="flex">
                    <span className="flex items-center rounded-l-lg border border-r-0 border-slate-200 bg-slate-50 px-2.5 text-xs text-slate-500">
                      +91
                    </span>
                    <input
                      type="tel"
                      required
                      value={devoteePhone}
                      onChange={(e) => setDevoteePhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                      placeholder="9876543210"
                      className="w-full rounded-r-lg border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#073C2C] py-2.5 text-xs font-bold text-white shadow-xs transition-all hover:bg-[#06432A]"
                  >
                    {t("Confirm & Pay")} (₹{bookingModalItem.price})
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
