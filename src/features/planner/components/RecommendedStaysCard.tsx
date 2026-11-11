import { memo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  BedDouble,
  Star,
  MapPin,
  Calendar,
  Users,
  Check,
  X,
  Sparkles,
  ShieldCheck,
  Phone,
  ArrowRight,
  ExternalLink,
} from "lucide-react";

export interface StayItem {
  id: string;
  name: string;
  rating: string;
  reviewsCount: string;
  dist: string;
  pricePerNight: number;
  image: string;
  desc: string;
  tags: string[];
}

export const STAYS_DATA: StayItem[] = [
  {
    id: "ramakrishna",
    name: "Hotel Ramakrishna",
    rating: "4.1",
    reviewsCount: "1,420+",
    dist: "0.6 km away",
    pricePerNight: 1400,
    image: "/stay_hotel_ramakrishna_hd.jpg",
    desc: "Budget & pilgrim favorite with clean AC rooms and renowned pure vegetarian restaurant right near the temple.",
    tags: ["Pure Veg Restaurant", "Walk to Temple", "AC Rooms", "24/7 Desk"],
  },
  {
    id: "sparsa",
    name: "Sparsa Resort",
    rating: "4.4",
    reviewsCount: "2,180+",
    dist: "3.5 km away",
    pricePerNight: 4800,
    image: "/stay_sparsa_resort_hd.jpg",
    desc: "Eco-luxury heritage resort nestled at the holy base of Mount Arunachala with serene gardens, spa, and pool.",
    tags: ["Arunachala Mountain View", "Eco-Luxury", "Swimming Pool", "Spa & Wellness"],
  },
  {
    id: "ttdc",
    name: "TTDC Hotel Tamil Nadu",
    rating: "3.9",
    reviewsCount: "980+",
    dist: "1.5 km away",
    pricePerNight: 1200,
    image: "/stay_ttdc_tamil_nadu_hd.jpg",
    desc: "Government operated Tamil Nadu Tourism hotel offering spacious family suites, ample parking, and peaceful lawns.",
    tags: ["Govt. Operated", "Ample Car Parking", "Family Suites", "Garden Lawn"],
  },
  {
    id: "athena",
    name: "Athena Hotel",
    rating: "4.2",
    reviewsCount: "860+",
    dist: "2.2 km away",
    pricePerNight: 2800,
    image: "/stay_hotel_ramakrishna_hd.jpg",
    desc: "Contemporary boutique hotel offering modern amenities, conference halls, and rooftop views of Tiruvannamalai.",
    tags: ["Rooftop View", "Modern Amenities", "Multi-Cuisine", "Elevator"],
  },
];

interface Props {
  travelDate?: string;
  adults?: number;
  childrenCount?: number;
  seniorsCount?: number;
}

export const RecommendedStaysCard = memo(function RecommendedStaysCard({
  travelDate = "Nov 09, 2026",
  adults = 2,
  childrenCount = 1,
  seniorsCount = 0,
}: Props) {
  const { t } = useTranslation();
  const [showAll, setShowAll] = useState(false);
  const [activeBookingStay, setActiveBookingStay] = useState<StayItem | null>(null);
  const [roomType, setRoomType] = useState<"standard" | "deluxe" | "suite">("standard");
  const [guestName, setGuestName] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  const displayedStays = showAll ? STAYS_DATA : STAYS_DATA.slice(0, 3);
  const totalGuests = adults + childrenCount + seniorsCount;

  const handleOpenBooking = (stay: StayItem) => {
    setActiveBookingStay(stay);
    setBookingConfirmed(false);
  };

  const handleConfirmReservation = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingConfirmed(true);
  };

  const calculateTotal = (stay: StayItem) => {
    const base = stay.pricePerNight;
    const multiplier = roomType === "suite" ? 1.8 : roomType === "deluxe" ? 1.35 : 1;
    return Math.round(base * multiplier);
  };

  return (
    <section className="bg-white border border-[#E8E2D5] rounded-3xl p-5 sm:p-7 shadow-xs overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between pb-5 border-b border-[#E8E2D5]/80">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#C48437]">
            <BedDouble className="w-3.5 h-3.5" />
            <span>{t("Verified Devotee Lodging")}</span>
          </div>
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#0B2F25] mt-1">
            {t("Recommended Stays Nearby")}
          </h2>
        </div>

        <button
          type="button"
          onClick={() => setShowAll((prev) => !prev)}
          className="text-xs font-bold text-[#C48437] hover:text-[#A96E28] hover:underline cursor-pointer transition-colors"
        >
          {showAll ? t("Show less") : t("View all")} ({STAYS_DATA.length})
        </button>
      </div>

      {/* Stays Grid */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-5">
        {displayedStays.map((hotel) => (
          <div
            key={hotel.id}
            className="group flex flex-col justify-between rounded-2xl border border-[#E8E2D5] bg-[#FAF6F0]/40 overflow-hidden transition-all hover:border-[#C48437]/40 hover:bg-[#FAF6F0] hover:shadow-sm"
          >
            {/* Hotel Image & Badge */}
            <div className="relative h-44 w-full overflow-hidden bg-slate-200">
              <img
                src={hotel.image}
                alt={hotel.name}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                onError={(e) => {
                  (e.target as HTMLElement).src = "/temples/tiruvannamalai/temple-hill.jpg";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

              {/* Rating badge */}
              <div className="absolute top-3 left-3 flex items-center gap-1 rounded-full bg-white/95 backdrop-blur-xs px-2.5 py-1 text-xs font-bold text-slate-900 shadow-xs">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{hotel.rating}</span>
                <span className="text-[10px] text-slate-500 font-normal">
                  ({hotel.reviewsCount})
                </span>
              </div>

              {/* Distance badge */}
              <div className="absolute bottom-3 left-3 flex items-center gap-1 text-xs font-semibold text-white">
                <MapPin className="w-3.5 h-3.5 text-[#C48437]" />
                <span>{hotel.dist}</span>
              </div>

              {/* Price Tag */}
              <div className="absolute bottom-3 right-3 text-right">
                <div className="text-xs font-bold text-white bg-black/60 backdrop-blur-xs px-2.5 py-0.5 rounded-md">
                  ₹{hotel.pricePerNight} <span className="text-[10px] font-normal">/ night</span>
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-base text-slate-900 group-hover:text-[#0B2F25] transition-colors">
                  {hotel.name}
                </h3>
                <p className="mt-1 text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {hotel.desc}
                </p>

                {/* Amenities pills */}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {hotel.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md bg-white border border-[#E8E2D5] px-2 py-0.5 text-[11px] font-medium text-slate-600"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Book Stay CTA */}
              <div className="mt-4 pt-3 border-t border-[#E8E2D5]/80 flex items-center justify-between">
                <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  <span>Free Cancellation</span>
                </span>

                <button
                  type="button"
                  onClick={() => handleOpenBooking(hotel)}
                  className="inline-flex items-center gap-1 rounded-xl bg-[#0B2F25] px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-[#073C2C] active:scale-[0.98] transition-all cursor-pointer"
                >
                  <span>{t("Book Stay")}</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Booking Modal */}
      {activeBookingStay && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200"
        >
          <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 sm:p-7 shadow-2xl border border-[#E8E2D5] max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setActiveBookingStay(null)}
              className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {!bookingConfirmed ? (
              <form onSubmit={handleConfirmReservation} className="space-y-4">
                {/* Modal Title */}
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#C48437]">
                    {t("Instant Devotee Reservation")}
                  </span>
                  <h3 className="font-serif text-xl font-bold text-[#0B2F25] mt-0.5">
                    {activeBookingStay.name}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                    <span className="flex items-center gap-0.5 font-bold text-amber-500">
                      ⭐ {activeBookingStay.rating}
                    </span>
                    <span>·</span>
                    <span>{activeBookingStay.dist}</span>
                  </div>
                </div>

                {/* Pre-filled Details Strip */}
                <div className="rounded-xl border border-[#E8E2D5] bg-[#FAF6F0] p-3 text-xs text-slate-700 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#C48437]" />
                    <span>Check-in: <strong>{travelDate}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-[#C48437]" />
                    <span>{totalGuests} Devotees</span>
                  </div>
                </div>

                {/* Room Type Selector */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    {t("Select Room Category")}
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: "standard", name: "Standard AC", price: activeBookingStay.pricePerNight },
                      {
                        id: "deluxe",
                        name: "Deluxe Family",
                        price: Math.round(activeBookingStay.pricePerNight * 1.35),
                      },
                      {
                        id: "suite",
                        name: "Temple View",
                        price: Math.round(activeBookingStay.pricePerNight * 1.8),
                      },
                    ].map((room) => (
                      <button
                        key={room.id}
                        type="button"
                        onClick={() => setRoomType(room.id as any)}
                        className={`rounded-xl p-2.5 text-left border text-xs transition-all cursor-pointer ${
                          roomType === room.id
                            ? "border-[#0B2F25] bg-[#0B2F25]/5 ring-1 ring-[#0B2F25]"
                            : "border-[#E8E2D5] bg-white hover:bg-slate-50"
                        }`}
                      >
                        <div className="font-bold text-slate-900">{room.name}</div>
                        <div className="text-[#C48437] font-semibold mt-0.5">₹{room.price}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Devotee Info */}
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Devotee Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      placeholder="e.g. Balaji Ramanathan"
                      className="w-full h-10 px-3 rounded-xl border border-[#E8E2D5] text-xs outline-none focus:border-[#C48437]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Mobile Number (For WhatsApp / SMS confirmation)
                    </label>
                    <input
                      type="tel"
                      required
                      value={guestPhone}
                      onChange={(e) => setGuestPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full h-10 px-3 rounded-xl border border-[#E8E2D5] text-xs outline-none focus:border-[#C48437]"
                    />
                  </div>
                </div>

                {/* Total & Action */}
                <div className="pt-3 border-t border-[#E8E2D5] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase">
                      Total Payable at Check-in
                    </span>
                    <div className="text-lg font-bold text-[#0B2F25]">
                      ₹{calculateTotal(activeBookingStay)}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="rounded-full bg-[#0B2F25] text-white px-5 py-2.5 text-xs font-bold hover:bg-[#073C2C] active:scale-[0.98] transition-all cursor-pointer shadow-md"
                  >
                    Confirm & Reserve (Pay at Hotel)
                  </button>
                </div>
              </form>
            ) : (
              /* Booking Success View */
              <div className="py-6 text-center space-y-3">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  <Check className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-xl font-bold text-[#0B2F25]">
                  Reservation Confirmed!
                </h3>
                <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                  Your stay at <strong>{activeBookingStay.name}</strong> for {travelDate} has been confirmed. Confirmation details have been sent to your mobile.
                </p>

                <div className="my-4 rounded-xl border border-[#E8E2D5] bg-[#FAF6F0] p-4 text-left text-xs space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Booking ID:</span>
                    <strong className="font-mono text-slate-900">
                      STAY-ARU-{Math.floor(1000 + Math.random() * 9000)}
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Check-in Date:</span>
                    <strong className="text-slate-900">{travelDate}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Room Category:</span>
                    <strong className="text-slate-900 capitalize">{roomType} Room</strong>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-[#E8E2D5]">
                    <span className="text-slate-500">Total Due at Hotel:</span>
                    <strong className="text-emerald-700 text-sm">
                      ₹{calculateTotal(activeBookingStay)}
                    </strong>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveBookingStay(null)}
                  className="rounded-full bg-[#0B2F25] text-white px-6 py-2 text-xs font-bold hover:bg-[#073C2C] transition-colors cursor-pointer"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
});

