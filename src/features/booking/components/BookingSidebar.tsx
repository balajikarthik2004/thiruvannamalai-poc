import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  CalendarDays,
  ChevronRight,
  Bookmark,
  Building2,
  Users,
  Clock,
  Info,
  Shirt,
  CreditCard,
  CameraOff,
} from "lucide-react";
import { format } from "date-fns";
import type { Temple } from "@/data/temples";
import type { DarshanCategory, DevoteeMember, AddonService } from "../constants";

interface Props {
  temple: Temple;
  category: DarshanCategory;
  visitDate: Date;
  visitTime: string;
  devotees: DevoteeMember[];
  selectedServices: Array<{ service: AddonService; qty: number }>;
  onSelectEventDate?: (date: Date) => void;
}

const EVENTS = [
  {
    id: "karthigai-deepam",
    title: "Karthigai Deepam Brahmotsavam",
    dateBadge: "Nov 15 - Nov 24, 2026",
    description: "10-day grand Brahmotsavam with daily processions and special poojas.",
    image: "/pooja_fest_karthigai_hd.jpg",
    festivalDate: new Date(2026, 10, 24), // Nov 24, 2026
  },
  {
    id: "pournami-girivalam",
    title: "Chitra Pournami Girivalam",
    dateBadge: "Every Full Moon",
    description: "Auspicious 14 km circumambulation around Arunachala hill with millions of devotees.",
    image: "/pooja_fest_girivalam_hd.jpg",
    festivalDate: new Date(2026, 10, 15),
  },
  {
    id: "aarudra-darshanam",
    title: "Aarudra Darshanam",
    dateBadge: "Jan 9, 2027",
    description: "Cosmic dance celebration of Nataraja with special maha abhishekam.",
    image: "/pooja_fest_arudra_hd.jpg",
    festivalDate: new Date(2027, 0, 9),
  },
];

export function BookingSidebar({
  temple,
  category,
  visitDate,
  visitTime,
  devotees,
  selectedServices,
  onSelectEventDate,
}: Props) {
  const { t } = useTranslation();
  const [activeEventIndex, setActiveEventIndex] = useState(0);

  const currentEvent = EVENTS[activeEventIndex];

  // Calculate pricing
  const devoteeCount = Math.max(1, devotees.length);
  const darshanTotal = category.price * devoteeCount;
  const servicesTotal = selectedServices.reduce(
    (sum, s) => sum + s.service.price * s.qty,
    0
  );
  const grandTotal = darshanTotal + servicesTotal;

  return (
    <div className="space-y-4">
      {/* 1. Upcoming Temple Events */}
      <section className="rounded-2xl border border-[#E8E2D5] bg-white p-4 shadow-xs">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="flex items-center gap-2 font-serif text-sm font-bold text-[#073C2C]">
            <CalendarDays className="h-4 w-4 text-[#A86221]" />
            {t("Upcoming Temple Events")}
          </h3>
          <button
            type="button"
            className="text-xs font-bold text-[#A86221] hover:underline"
          >
            {t("View All")}
          </button>
        </div>

        {/* Event Card */}
        <div
          onClick={() => onSelectEventDate?.(currentEvent.festivalDate)}
          className="group flex cursor-pointer items-center gap-3 rounded-xl border border-slate-100 p-2.5 transition-all hover:border-[#16A34A]/50 hover:bg-[#F0FDF4]/30"
        >
          {/* Thumbnail */}
          <div className="h-16 w-20 shrink-0 overflow-hidden rounded-lg bg-slate-100">
            <img
              src={currentEvent.image}
              alt={currentEvent.title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              onError={(e) => {
                (e.target as HTMLElement).style.display = "none";
              }}
            />
          </div>

          {/* Details */}
          <div className="min-w-0 flex-1">
            <h4 className="text-xs font-bold text-slate-900 line-clamp-1 group-hover:text-[#073C2C]">
              {t(currentEvent.title)}
            </h4>
            <span className="my-1 inline-block rounded-md bg-[#FFF1F2] px-2 py-0.5 text-[10px] font-bold text-[#BE123C]">
              {currentEvent.dateBadge}
            </span>
            <p className="text-[11px] font-medium text-slate-500 line-clamp-2 leading-tight">
              {t(currentEvent.description)}
            </p>
          </div>

          <ChevronRight className="h-4 w-4 shrink-0 text-slate-400 group-hover:text-[#16A34A]" />
        </div>

        {/* Carousel indicator dots */}
        <div className="mt-3 flex items-center justify-center gap-1.5">
          {EVENTS.map((_, idx) => (
            <button
              key={idx}
              type="button"
              aria-label={`Event ${idx + 1}`}
              onClick={() => setActiveEventIndex(idx)}
              className={`h-1.5 rounded-full transition-all ${
                activeEventIndex === idx
                  ? "w-4 bg-[#16A34A]"
                  : "w-1.5 bg-slate-300 hover:bg-slate-400"
              }`}
            />
          ))}
        </div>
      </section>

      {/* 2. Your Selection Summary */}
      <section className="rounded-2xl border border-[#E8E2D5] bg-white p-4 shadow-xs">
        <h3 className="mb-3.5 flex items-center gap-2 font-serif text-sm font-bold text-[#073C2C]">
          <Bookmark className="h-4 w-4 text-[#A86221]" />
          {t("Your Selection Summary")}
        </h3>

        <div className="space-y-2.5 text-xs">
          {/* Temple */}
          <div className="flex items-start gap-2.5">
            <Building2 className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
            <div className="min-w-0 flex-1">
              <span className="block text-[11px] font-medium text-slate-500">
                {t("Temple")}
              </span>
              <span className="font-bold text-slate-900">
                {temple.slug === "tiruvannamalai"
                  ? "Tiruvannamalai Arunachaleswarar Temple"
                  : t(temple.name)}
              </span>
            </div>
          </div>

          {/* Darshan Category */}
          <div className="flex items-start gap-2.5">
            <Users className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
            <div className="min-w-0 flex-1">
              <span className="block text-[11px] font-medium text-slate-500">
                {t("Darshan Category")}
              </span>
              <span className="font-bold text-slate-900">
                {t(category.name)} ({category.price > 0 ? `₹${category.price}` : t("Free")})
              </span>
            </div>
          </div>

          {/* Visit Date */}
          <div className="flex items-start gap-2.5">
            <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
            <div className="min-w-0 flex-1">
              <span className="block text-[11px] font-medium text-slate-500">
                {t("Visit Date")}
              </span>
              <span className="font-bold text-slate-900">
                {format(visitDate, "d MMM yyyy")}
              </span>
            </div>
          </div>

          {/* Time Slot */}
          <div className="flex items-start gap-2.5">
            <Clock className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
            <div className="min-w-0 flex-1">
              <span className="block text-[11px] font-medium text-slate-500">
                {t("Time Slot")}
              </span>
              <span className="font-bold text-slate-900">
                {visitTime || t("Not selected")}
              </span>
            </div>
          </div>

          {/* Additional details if entered */}
          {devotees.length > 1 && (
            <div className="flex items-center justify-between border-t border-slate-100 pt-2 text-slate-600">
              <span>{t("Devotees")}</span>
              <span className="font-bold text-slate-800">{devotees.length} persons</span>
            </div>
          )}

          {selectedServices.length > 0 && (
            <div className="border-t border-slate-100 pt-2 space-y-1">
              <span className="block text-[11px] font-bold text-slate-600">
                {t("Add-on Services")}:
              </span>
              {selectedServices.map((s) => (
                <div key={s.service.id} className="flex justify-between text-[11px] text-slate-600">
                  <span>
                    {s.service.name} (x{s.qty})
                  </span>
                  <span className="font-semibold text-slate-800">
                    ₹{s.service.price * s.qty}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Price Total */}
          <div className="flex items-center justify-between border-t border-slate-200 pt-2.5 text-xs font-bold text-slate-900">
            <span>{t("Total Amount")}</span>
            <span className="text-base text-[#16A34A]">
              {grandTotal > 0 ? `₹${grandTotal}` : t("Free")}
            </span>
          </div>
        </div>
      </section>

      {/* 3. Important Guidelines */}
      <section className="rounded-2xl border border-[#FEE2E2] bg-[#FFF5F5] p-4 shadow-xs">
        <h3 className="mb-3 flex items-center gap-2 font-serif text-sm font-bold text-[#991B1B]">
          <Info className="h-4 w-4 text-[#991B1B]" />
          {t("Important Guidelines")}
        </h3>

        <ul className="space-y-2.5 text-xs text-slate-700">
          <li className="flex items-start gap-2.5">
            <Shirt className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#991B1B]" />
            <span>
              <strong className="font-bold text-slate-900">{t("Dress code:")}</strong>{" "}
              {t("Traditional & modest attire.")}
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <CreditCard className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#991B1B]" />
            <span>
              <strong className="font-bold text-slate-900">{t("Carry a valid ID proof")}</strong>{" "}
              {t("(as per temple rules).")}
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <Clock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#991B1B]" />
            <span>
              <strong className="font-bold text-slate-900">{t("Report")}</strong>{" "}
              {t("at least 15 minutes before the selected time.")}
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <CameraOff className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#991B1B]" />
            <span>
              <strong className="font-bold text-slate-900">{t("Photography is restricted")}</strong>{" "}
              {t("inside the temple.")}
            </span>
          </li>
        </ul>
      </section>
    </div>
  );
}

