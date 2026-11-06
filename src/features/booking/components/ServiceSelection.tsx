import { useTranslation } from "react-i18next";
import { PackageOpen, Flower2, Leaf, Bed, Tent, Flame, Store, Building, Check, Minus, Plus } from "lucide-react";
import { useState, type ReactNode } from "react";
import type { BookingCart } from "../constants";

// Sample catalogue — replace with live pricing from the temple backend.
const POOJAS = [
  { id: "p1", name: "Kala Santhi Pooja", price: 250, icon: Flame },
  { id: "p2", name: "Uchikalam Pooja", price: 300, icon: Flame },
  { id: "p3", name: "Sayarakshai Pooja", price: 400, icon: Flame },
];

const PRASADAM_ITEMS = [
  { id: "pr1", name: "Special Laddoo", price: 50 },
  { id: "pr2", name: "Tamarind Rice (Puliyodarai)", price: 80 },
  { id: "pr3", name: "Sweet Pongal (Sakkara Pongal)", price: 60 },
];

const ACCOMMODATIONS = [
  { id: "a1", name: "Standard Non-AC Room", price: 500, icon: Bed },
  { id: "a2", name: "Deluxe AC Room", price: 1200, icon: Bed },
  { id: "a3", name: "Family Cottage", price: 2500, icon: Tent },
];

const VENUES = [
  { id: "v1", name: "Kalyana Mandapam (Marriage Hall)", price: 25000, icon: Building },
  { id: "v2", name: "Mini Party Hall (Annadhanam)", price: 5000, icon: Store },
];

const ARCHANA_PRICE = 150;
const ARCHANA_WITH_FLOWERS_PRICE = 250;

type Tab = "poojas" | "prasadam" | "accommodations" | "venues";

function CheckBox({ checked }: { checked: boolean }) {
  return (
    <span className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors ${checked ? "bg-saffron border-saffron text-white" : "border-slate-300 bg-white"}`}>
      {checked && <Check className="w-3.5 h-3.5" strokeWidth={3} />}
    </span>
  );
}

function OptionCard({ selected, onClick, children, className = "" }: { selected: boolean; onClick: () => void; children: ReactNode; className?: string }) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`text-left p-4 rounded-2xl border-2 transition-all ${selected ? "border-saffron bg-rose-50/60 shadow-sm" : "border-slate-100 bg-white hover:border-saffron/40"} ${className}`}
    >
      {children}
    </button>
  );
}

function Stepper({ value, onDec, onInc, label }: { value: number; onDec: () => void; onInc: () => void; label: string }) {
  return (
    <div className="flex items-center gap-1 bg-white p-1 rounded-full border border-rose-100" aria-label={label}>
      <button type="button" onClick={onDec} aria-label="Decrease" className="w-8 h-8 rounded-full flex items-center justify-center text-slate-600 hover:bg-rose-50 hover:text-saffron"><Minus className="w-4 h-4" /></button>
      <span className="font-bold w-6 text-center text-sm tabular-nums">{value}</span>
      <button type="button" onClick={onInc} aria-label="Increase" className="w-8 h-8 rounded-full flex items-center justify-center text-slate-600 hover:bg-rose-50 hover:text-saffron"><Plus className="w-4 h-4" /></button>
    </div>
  );
}

export function ServiceSelection({ cart, setCart }: { cart: BookingCart; setCart: (c: BookingCart) => void; [k: string]: any }) {
  const { t: tStr } = useTranslation();
  const [activeTab, setActiveTab] = useState<Tab>("poojas");

  const togglePooja = (p: (typeof POOJAS)[number]) => {
    const exists = cart.poojas.some((x) => x.id === p.id);
    setCart({ ...cart, poojas: exists ? cart.poojas.filter((x) => x.id !== p.id) : [...cart.poojas, { id: p.id, name: p.name, price: p.price }] });
  };

  const updatePrasadam = (p: (typeof PRASADAM_ITEMS)[number], delta: number) => {
    const existing = cart.prasadam.find((x) => x.id === p.id);
    let items = cart.prasadam;
    if (existing) {
      const qty = existing.qty + delta;
      items = qty <= 0 ? items.filter((x) => x.id !== p.id) : items.map((x) => (x.id === p.id ? { ...x, qty } : x));
    } else if (delta > 0) {
      items = [...items, { ...p, qty: 1 }];
    }
    setCart({ ...cart, prasadam: items });
  };

  const prasadamQty = (id: string) => cart.prasadam.find((x) => x.id === id)?.qty ?? 0;

  const toggleArchana = () => {
    const optIn = !cart.archana.optIn;
    setCart({ ...cart, archana: { optIn, partnerDelivery: false, price: optIn ? ARCHANA_PRICE : 0 } });
  };

  const togglePartnerDelivery = () => {
    const partnerDelivery = !cart.archana.partnerDelivery;
    setCart({ ...cart, archana: { ...cart.archana, partnerDelivery, price: partnerDelivery ? ARCHANA_WITH_FLOWERS_PRICE : ARCHANA_PRICE } });
  };

  const selectAccommodation = (a: (typeof ACCOMMODATIONS)[number]) => {
    setCart({
      ...cart,
      accommodations: cart.accommodations.type === a.name ? { type: "", nights: 1, price: 0, checkIn: null } : { type: a.name, nights: 1, price: a.price, checkIn: new Date() },
    });
  };

  const setNights = (n: number) => setCart({ ...cart, accommodations: { ...cart.accommodations, nights: Math.min(14, Math.max(1, n)) } });

  const selectVenue = (v: (typeof VENUES)[number]) => {
    setCart({ ...cart, venues: cart.venues.type === v.name ? { type: "", price: 0, date: null } : { type: v.name, price: v.price, date: new Date() } });
  };

  const tabs: { id: Tab; label: string }[] = [
    { id: "poojas", label: tStr("Poojas & Archana") },
    { id: "prasadam", label: tStr("Prasadam") },
    { id: "accommodations", label: tStr("Rooms") },
    { id: "venues", label: tStr("Venues") },
  ];

  return (
    <div>
      {/* Tabs */}
      <div role="tablist" className="flex overflow-x-auto gap-2 pb-1 mb-6 hide-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-2.5 rounded-full font-semibold text-sm whitespace-nowrap transition-all border ${
              activeTab === tab.id ? "bg-saffron text-white border-saffron shadow-md shadow-saffron/20" : "bg-white text-slate-600 border-slate-200 hover:border-saffron/50 hover:text-saffron"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "poojas" && (
        <div className="animate-in fade-in duration-300">
          <h3 className="font-serif text-lg font-bold text-slate-900 mb-3">{tStr("Special Poojas")}</h3>
          <div className="grid sm:grid-cols-3 gap-3 mb-7">
            {POOJAS.map((p) => {
              const selected = cart.poojas.some((x) => x.id === p.id);
              return (
                <OptionCard key={p.id} selected={selected} onClick={() => togglePooja(p)} className="flex items-start gap-3">
                  <CheckBox checked={selected} />
                  <div>
                    <div className="font-bold text-sm text-slate-800 leading-tight">{tStr(p.name)}</div>
                    <div className="text-sm font-bold text-saffron mt-1.5">₹{p.price}</div>
                  </div>
                </OptionCard>
              );
            })}
          </div>

          <h3 className="font-serif text-lg font-bold text-slate-900 mb-3">{tStr("Archana Thattu & Offerings")}</h3>
          <div className={`rounded-2xl border-2 p-4 transition-colors ${cart.archana.optIn ? "border-saffron bg-rose-50/60" : "border-slate-100 bg-white"}`}>
            <button type="button" onClick={toggleArchana} aria-pressed={cart.archana.optIn} className="w-full flex items-start gap-3 text-left">
              <CheckBox checked={cart.archana.optIn} />
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-bold text-slate-800">{tStr("Add Archana Thattu")}</span>
                  <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">
                    <Leaf className="w-3 h-3" /> {tStr("Zero Plastic")}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {tStr("Includes coconut, betel leaves, camphor, and fruits. Packaged in a 100% biodegradable bag. Pick up empty-handed at the temple counter.")}
                </p>
              </div>
              <span className="font-bold text-saffron shrink-0">₹{ARCHANA_PRICE}</span>
            </button>

            {cart.archana.optIn && (
              <button type="button" onClick={togglePartnerDelivery} aria-pressed={cart.archana.partnerDelivery} className="mt-4 pt-4 border-t border-rose-100 w-full flex items-start gap-3 text-left animate-in fade-in">
                <CheckBox checked={cart.archana.partnerDelivery} />
                <div className="flex-1">
                  <div className="font-semibold text-sm text-slate-800 flex items-center gap-1.5"><Flower2 className="w-4 h-4 text-saffron" /> {tStr("Add Fresh Flower Garland & Rice")}</div>
                  <p className="text-xs text-slate-500 mt-0.5">{tStr("Sourced from local temple vendors and delivered directly to your pickup counter.")}</p>
                </div>
                <span className="font-bold text-saffron text-sm shrink-0">+ ₹{ARCHANA_WITH_FLOWERS_PRICE - ARCHANA_PRICE}</span>
              </button>
            )}
          </div>
        </div>
      )}

      {activeTab === "prasadam" && (
        <div className="animate-in fade-in duration-300">
          <div className="flex items-start gap-3 mb-5 bg-rose-50/60 text-slate-700 p-4 rounded-2xl border border-rose-100">
            <PackageOpen className="w-5 h-5 shrink-0 text-saffron mt-0.5" />
            <p className="text-sm">
              <span className="font-bold block text-slate-900">{tStr("Skip the Queue!")}</span>
              {tStr("Pre-book your Prasadam online. Collect directly at the dedicated Online Pickup Counter inside the temple.")}
            </p>
          </div>
          <div className="grid gap-3">
            {PRASADAM_ITEMS.map((p) => (
              <div key={p.id} className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-colors ${prasadamQty(p.id) > 0 ? "border-saffron bg-rose-50/60" : "border-slate-100 bg-white"}`}>
                <div>
                  <div className="font-bold text-sm text-slate-800">{tStr(p.name)}</div>
                  <div className="text-saffron font-bold text-sm mt-0.5">₹{p.price}</div>
                </div>
                <Stepper label={tStr(p.name)} value={prasadamQty(p.id)} onDec={() => updatePrasadam(p, -1)} onInc={() => updatePrasadam(p, 1)} />
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "accommodations" && (
        <div className="animate-in fade-in duration-300">
          <h3 className="font-serif text-lg font-bold text-slate-900">{tStr("Temple Accommodations")}</h3>
          <p className="text-sm text-slate-500 mb-4">{tStr("Book rooms located inside the serene temple campus for your stay.")}</p>
          <div className="grid sm:grid-cols-3 gap-3 mb-5">
            {ACCOMMODATIONS.map((a) => {
              const selected = cart.accommodations.type === a.name;
              return (
                <OptionCard key={a.id} selected={selected} onClick={() => selectAccommodation(a)}>
                  <div className="flex items-center justify-between mb-3">
                    <a.icon className={`w-6 h-6 ${selected ? "text-saffron" : "text-slate-400"}`} />
                    <CheckBox checked={selected} />
                  </div>
                  <div className="font-bold text-sm text-slate-800">{tStr(a.name)}</div>
                  <div className="text-sm font-bold text-saffron mt-1">₹{a.price.toLocaleString("en-IN")} <span className="font-medium text-slate-500">{tStr("/ night")}</span></div>
                </OptionCard>
              );
            })}
          </div>
          {cart.accommodations.type && (
            <div className="flex items-center justify-between gap-4 bg-rose-50/60 p-4 rounded-2xl border border-rose-100 animate-in fade-in">
              <span className="font-bold text-sm text-slate-700">{tStr("Number of Nights")}</span>
              <Stepper label={tStr("Number of Nights")} value={cart.accommodations.nights} onDec={() => setNights(cart.accommodations.nights - 1)} onInc={() => setNights(cart.accommodations.nights + 1)} />
            </div>
          )}
        </div>
      )}

      {activeTab === "venues" && (
        <div className="animate-in fade-in duration-300">
          <h3 className="font-serif text-lg font-bold text-slate-900">{tStr("Marriage & Party Halls")}</h3>
          <p className="text-sm text-slate-500 mb-4">{tStr("Reserve divine venues for your auspicious events.")}</p>
          <div className="grid sm:grid-cols-2 gap-3">
            {VENUES.map((v) => {
              const selected = cart.venues.type === v.name;
              return (
                <OptionCard key={v.id} selected={selected} onClick={() => selectVenue(v)} className="flex gap-4 items-center">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${selected ? "bg-saffron text-white" : "bg-rose-50 text-saffron"}`}>
                    <v.icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-sm text-slate-800">{tStr(v.name)}</div>
                    <div className="text-sm font-bold text-saffron mt-1">₹{v.price.toLocaleString("en-IN")} <span className="font-medium text-slate-500">{tStr("/ day")}</span></div>
                  </div>
                  <CheckBox checked={selected} />
                </OptionCard>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
