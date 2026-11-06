import { useTranslation } from "react-i18next";
import { Link } from "@tanstack/react-router";
import { Navigation2, MapPin, ArrowRight, BedDouble, Ticket, Users, ThermometerSun, Bell, Heart, Car, Train, Bus, Plane, BrainCircuit, Crown } from "lucide-react";

export function PlanResult({
  t, date, fromLocation, travelHours, travelMins, trans, hotels, setFullMap
}: any) {
  const { t: tStr } = useTranslation();

  return (
    <div className="mt-6 fade-in rounded-2xl p-[1px] gradient-saffron mb-10 print:p-0 print:bg-none print:shadow-none print:m-0">
      <div className="bg-card rounded-2xl p-4 lg:p-6 print:hidden">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-1.5 text-saffron font-semibold text-sm"><BrainCircuit className="w-4 h-4" /> {tStr("Your Temple Visit Plan")}</div>
            <h2 className="font-serif text-2xl font-bold mt-1.5">{tStr(t.name)}</h2>
          </div>
          <div className="flex items-center gap-2.5 bg-gradient-to-b from-white to-slate-50/80 px-3.5 py-2 rounded-xl border border-slate-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.04)] shrink-0">
            <div className="bg-indigo-50 border border-indigo-100/50 w-8 h-8 rounded-lg flex items-center justify-center shrink-0">
              <span className="text-sm leading-none drop-shadow-sm">📅</span>
            </div>
            <div>
              <div className="text-[9px] uppercase tracking-widest text-slate-400 font-bold leading-tight mb-0.5">{tStr("Travel Date")}</div>
              <div className="text-xs font-extrabold text-slate-800 leading-tight tracking-tight">{date || tStr("Upcoming")}</div>
            </div>
          </div>
        </div>

        {/* HERO BANNER FOR BEST DARSHAN */}
        <div className="mb-6 bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700 rounded-2xl p-4 lg:p-5 text-white shadow-xl shadow-emerald-500/20 relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-3 group">
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full duration-1000 ease-in-out transition-transform"></div>
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
          
          <div className="relative z-10 flex items-center gap-3.5">
            <div className="bg-white/20 backdrop-blur-md border border-white/30 w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-inner">
              <BrainCircuit className="w-5 h-5 text-emerald-50 drop-shadow-md" />
            </div>
            <div>
              <div className="text-emerald-100 text-[10px] uppercase tracking-widest font-bold mb-0.5">{tStr("Best Time for Darshan")}</div>
              <div className="text-xl lg:text-2xl font-black tracking-tight drop-shadow-md">{tStr("3:30 PM – 5:00 PM")}</div>
            </div>
          </div>
          <div className="relative z-10 flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-1.5 border-t sm:border-t-0 border-white/10 pt-2 sm:pt-0">
             <div className="text-emerald-100 text-[11px] font-medium">{tStr("Less Rush Expected")}</div>
             <div className="text-white font-bold text-xs bg-white/20 px-3 py-1 rounded-full backdrop-blur-md border border-white/30 inline-block shadow-sm">
               ~18 {tStr("mins wait")}
             </div>
          </div>
        </div>

        {/* Travel & Logistics */}
        <div className="mt-4 border border-border/60 bg-secondary/20 rounded-2xl p-3 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-saffron/10 rounded-full blur-2xl pointer-events-none"></div>
          <div className="flex items-center gap-1.5 mb-3">
            <Navigation2 className="w-4 h-4 text-saffron" />
            <div className="text-sm font-semibold">{tStr("Travel & Logistics")}</div>
          </div>

          <div className="flex items-center gap-4 bg-background border border-border/60 rounded-2xl p-3 shadow-sm mb-3 relative z-10">
            <div className="flex-1 min-w-0">
              <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-0.5">{tStr("Origin")}</div>
              <div className="font-medium text-sm truncate">{fromLocation || tStr("Your Location")}</div>
            </div>
            <div className="flex flex-col items-center justify-center shrink-0 w-16">
              <div className="text-[10px] font-bold text-saffron mb-0.5">{travelHours}{tStr("h")} {travelMins}{tStr("m")}</div>
              <div className="w-full h-px bg-border relative">
                <ArrowRight className="w-3.5 h-3.5 text-saffron absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-0.5" />
              </div>
              <div className="text-[10px] font-medium text-muted-foreground mt-1 uppercase tracking-wider">{trans.isInternational ? tStr("by Air") : tStr("by Road")}</div>
            </div>
            <div className="flex-1 text-right min-w-0">
              <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-0.5">{tStr("Destination")}</div>
              <div className="font-medium text-sm truncate">{tStr(t.city)}</div>
            </div>
          </div>

          <div className="mt-4 space-y-3 relative z-10 mb-5">
            <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">{tStr("Recommended Transport Modes")}</div>
            {/* Flight Option */}
            {trans.isInternational && trans.flights && trans.flights.length > 0 && (
              <div className="bg-background border border-border/60 rounded-2xl p-4 shadow-sm hover:border-saffron/40 transition-colors border-l-4 border-l-blue-500">
                <div className="flex justify-between items-start mb-2">
                  <div className="text-sm font-semibold text-foreground flex items-center gap-2"><Plane className="w-4 h-4 text-blue-500" /> {tStr("By Air (International)")}</div>
                  <div className="text-xs font-bold text-blue-500">{trans.roadTime}</div>
                </div>
                <div className="space-y-2 text-xs">
                  {trans.flights.map((f: any, i: number) => (
                    <div key={i} className="bg-secondary/30 rounded-xl p-3 border border-border/40 hover:border-blue-500/30 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-full bg-blue-500/10 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0 border border-blue-500/20">{f.code}</div>
                         <div className="flex-1">
                            <div className="flex items-center justify-between gap-2">
                              <div className="font-bold text-[14px] text-foreground truncate">{tStr(f.airline)}</div>
                              <div className="text-[10px] bg-blue-50 text-blue-600 border border-blue-100 px-2 py-0.5 rounded-full font-bold whitespace-nowrap shrink-0">{tStr("Layover:")} {tStr(f.layover)}</div>
                            </div>
                            <div className="flex flex-wrap items-center gap-1.5 mt-2 bg-white/50 border border-slate-200/60 px-2.5 py-1.5 rounded-lg w-fit shadow-sm">
                               <span className="text-[11px] font-bold text-slate-700">{tStr(f.route[0])}</span>
                               <ArrowRight className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                               <span className="text-[11px] font-bold text-slate-700">{tStr(f.route[1])}</span>
                               <ArrowRight className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                               <span className="text-[11px] font-bold text-slate-700">{tStr(f.route[2])}</span>
                            </div>
                         </div>
                      </div>
                      <div className="flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 border-border/50 pt-2 sm:pt-0">
                         <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold mb-0.5">{tStr("Total Duration")}</div>
                         <div className="font-bold text-[13px] text-foreground bg-background border border-border/50 px-2.5 py-1 rounded-lg shadow-sm whitespace-nowrap">{tStr("~ " + f.duration)}</div>
                      </div>
                    </div>
                  ))}
                </div>
                {trans.airportCab && (
                  <div className="mt-4 bg-slate-50/50 border border-slate-200/60 rounded-2xl p-4 flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/40 pb-3">
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-full bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0 border border-blue-500/20">
                            <Car className="w-5 h-5" />
                         </div>
                         <div>
                            <div className="font-bold text-foreground text-[14px] leading-tight">{tStr("Last Mile: Airport Transfer")}</div>
                            <div className="text-muted-foreground text-[11px] font-medium mt-0.5">{tStr(trans.airportCab.route)}</div>
                         </div>
                      </div>
                      <div className="flex flex-wrap gap-1.5 ml-12 sm:ml-0">
                        <span className="bg-black text-white px-2 py-1 rounded-md text-[9px] font-bold tracking-widest uppercase shadow-sm">{tStr("Uber")}</span>
                        <span className="bg-[#c2e434] text-black px-2 py-1 rounded-md text-[9px] font-bold tracking-widest uppercase shadow-sm">{tStr("Ola")}</span>
                        <span className="bg-white text-slate-700 border border-slate-200 px-2 py-1 rounded-md text-[9px] font-bold tracking-widest uppercase shadow-sm">{tStr("Pre-paid Taxi")}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center pl-1 sm:pl-12">
                      <div className="flex gap-6">
                        <div className="flex flex-col gap-0.5"><span className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest">{tStr("Est. Time")}</span><span className="font-bold text-foreground text-xs">{tStr(trans.airportCab.time)}</span></div>
                        <div className="flex flex-col gap-0.5"><span className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest">{tStr("Distance")}</span><span className="font-bold text-foreground text-xs">{tStr(trans.airportCab.distance)}</span></div>
                      </div>
                      <div className="flex flex-col items-end gap-0.5"><span className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest">{tStr("Est. Fare")}</span><span className="text-emerald-600 font-bold text-[13px] bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">{tStr(trans.airportCab.price)}</span></div>
                    </div>
                  </div>
                )}
              </div>
            )}
            {/* Train Option */}
            {!trans.isInternational && trans.trains && trans.trains.length > 0 && (
              <div className="bg-background border border-border/60 rounded-2xl p-4 shadow-sm hover:border-saffron/40 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <div className="text-sm font-semibold text-foreground flex items-center gap-2"><Train className="w-4 h-4 text-saffron" /> {tStr("By Train")}</div>
                  <div className="text-xs font-bold text-saffron">~ {travelHours - 1 > 0 ? travelHours - 1 : 1}{tStr("h")} 45{tStr("m")}</div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {trans.trains.map((tr: any, i: number) => (
                    <div key={i} className="bg-secondary/50 rounded-xl p-2.5 flex justify-between items-center border border-border/20">
                      <div>
                        <div className="font-bold text-[13px] mb-0.5 text-foreground leading-tight">{tr.name}</div>
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          {tr.time.split(',').map((tStrStr: string, idx: number) => (
                            <div key={idx} className="font-bold text-[10px] text-black bg-white/40 border border-white/20 px-2 py-0.5 rounded-md uppercase tracking-widest inline-block shadow-sm">{tStrStr.trim()}</div>
                          ))}
                        </div>
                      </div>
                      <div className="font-bold text-[11px] text-foreground bg-background border border-border/50 px-2.5 py-1 rounded-lg shadow-sm whitespace-nowrap">{tr.price.replace("Duration:", tStr("Duration:"))}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-2 text-xs text-muted-foreground flex items-center gap-1.5 border-t border-border/50 pt-2">
                  <Car className="w-3.5 h-3.5 shrink-0" /> <div className="leading-snug"><span className="font-medium text-foreground">{tStr("Last Mile Transit:")}</span> {tStr("Auto & Cabs available from")} {tStr(t.city)} {tStr("Junction.")} <strong className="text-foreground/90 font-semibold">~15-20 {tStr("m")}</strong> {tStr("to temple.")} {tStr("Fare: Auto")} <strong className="text-emerald-600 font-bold">{tStr("Rs. 150")}</strong> · {tStr("Cab")} <strong className="text-emerald-600 font-bold">{tStr("Rs. 300")}</strong></div>
                </div>
              </div>
            )}
            {/* Bus Option */}
            {!trans.isInternational && trans.buses && trans.buses.length > 0 && (
              <div className="bg-background border border-border/60 rounded-2xl p-4 shadow-sm hover:border-saffron/40 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <div className="text-sm font-semibold text-foreground flex items-center gap-2"><Bus className="w-4 h-4 text-saffron" /> {tStr("By Bus")}</div>
                  <div className="text-xs font-bold text-muted-foreground">~ {travelHours + 1}{tStr("h")} {travelMins}{tStr("m")}</div>
                </div>
                <div className="text-xs text-muted-foreground mb-2">{tStr("Frequent reliable bus services from your origin terminus to")} {tStr(t.city)}.</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {trans.buses.map((b: any, i: number) => (
                    <div key={i} className="bg-secondary/50 rounded-xl p-2.5 flex justify-between items-center border border-border/20">
                      <div>
                        <div className="font-bold text-[13px] mb-0.5 text-foreground leading-tight">{b.name}</div>
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          {b.time.split(',').map((tStrStr: string, idx: number) => (
                            <div key={idx} className="font-bold text-[10px] text-black bg-white/40 border border-white/20 px-2 py-0.5 rounded-md uppercase tracking-widest inline-block shadow-sm">{tStrStr.trim()}</div>
                          ))}
                        </div>
                      </div>
                      <div className="font-bold text-[11px] text-foreground bg-background border border-border/50 px-2.5 py-1 rounded-lg shadow-sm whitespace-nowrap">{b.price.replace("Duration:", tStr("Duration:"))}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-2 text-xs text-muted-foreground flex items-center gap-1.5 border-t border-border/50 pt-2">
                  <Navigation2 className="w-3.5 h-3.5 shrink-0" /> <div className="leading-snug"><span className="font-medium text-foreground">{tStr("Last Mile Transit:")}</span> {tStr("Share-autos and mini-buses ply from")} {tStr(t.city)} {tStr("Bus Stand.")} <strong className="text-foreground/90 font-semibold">~10-15 {tStr("m")}</strong> {tStr("to temple.")} {tStr("Fare: Share-Auto")} <strong className="text-emerald-600 font-bold">{tStr("Rs. 30")}</strong> · {tStr("Private Auto")} <strong className="text-emerald-600 font-bold">{tStr("Rs. 100")}</strong></div>
                </div>
              </div>
            )}
            {/* Car Option */}
            {!trans.isInternational && (
              <div className="bg-background border border-border/60 rounded-2xl p-4 shadow-sm hover:border-saffron/40 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <div className="text-sm font-semibold text-foreground flex items-center gap-2"><Car className="w-4 h-4 text-saffron" /> {tStr("Personal Car / Outstation Cab")}</div>
                  <div className="text-xs font-bold text-muted-foreground">~ {travelHours}{tStr("h")} {travelMins}{tStr("m")}</div>
                </div>
                <div className="text-xs text-muted-foreground mb-2">{tStr("Fastest and most flexible. Safe highway conditions. Ola, Uber, and local travel agencies offer outstation drops to")} {tStr(t.city)}.</div>
                <div className="text-xs text-muted-foreground flex items-center gap-1.5 border-t border-border/50 pt-2">
                  <MapPin className="w-3.5 h-3.5 shrink-0 text-saffron" /> <div><strong>{tStr("Suggested Route:")}</strong> {trans.route}</div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 border-t border-border/50 pt-4 relative z-10">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <BedDouble className="w-4 h-4 text-muted-foreground" />
                <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{tStr("Recommended Stays Nearby")}</div>
              </div>
              <button className="text-[10px] font-semibold text-saffron hover:underline">{tStr("View all")}</button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {hotels.map((h: any) => (
                <div key={h.name} className="bg-background rounded-2xl p-3 border border-border shadow-sm hover:border-saffron/40 transition-colors">
                  <div className="text-xs font-semibold truncate mb-1 text-foreground">{h.name}</div>
                  <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                    <span className="flex items-center gap-0.5 font-medium text-amber-500">⭐ {h.rating}</span>
                    <span>{h.dist} {tStr("km away")}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* En-Route Temples for Specific Routes */}
          {(() => {
            const origin = (fromLocation || "").toLowerCase();
            const dest = t.slug;
            let enRoute = null;
            if ((origin.includes("chennai") || origin.includes("madras")) && dest === "madurai-meenakshi") {
              enRoute = [
                { name: "Srirangam Ranganathaswamy", city: "Trichy", timeAdded: "+2h", desc: "Massive 108-divya desam temple complex, perfect midway halt." },
                { name: "Rockfort Ucchi Pillayar", city: "Trichy", timeAdded: "+1.5h", desc: "Iconic hilltop temple offering panoramic city views." }
              ];
            } else if ((origin.includes("chennai") || origin.includes("madras")) && dest === "tiruvannamalai") {
              enRoute = [
                { name: "Gingee Fort & Venkataramana Temple", city: "Gingee", timeAdded: "+1.5h", desc: "Historic hill fort and Vijayanagara-era temple right on the Tindivanam–Tiruvannamalai road." },
                { name: "Melmalayanur Angalamman", city: "Gingee", timeAdded: "+1h", desc: "Powerful Amman temple a short detour from Gingee." }
              ];
            } else if ((origin.includes("chennai") || origin.includes("madras")) && dest === "palani-murugan") {
              enRoute = [
                { name: "Srirangam Ranganathaswamy", city: "Trichy", timeAdded: "+2h", desc: "Highly recommended midway halt before turning towards Dindigul." },
                { name: "Samayapuram Mariamman", city: "Trichy", timeAdded: "+1h", desc: "Powerful Goddess temple easily accessible from the NH38 highway." }
              ];
            } else if ((origin.includes("bangalore") || origin.includes("bengaluru")) && dest === "madurai-meenakshi") {
              enRoute = [
                { name: "Anjaneyar Temple", city: "Namakkal", timeAdded: "+45m", desc: "Famous for its 18-feet tall Hanuman statue right on the highway route." },
                { name: "Tharamangalam Kailasanathar", city: "Salem", timeAdded: "+1h", desc: "Known for exquisite ancient stone carvings and unique architecture." }
              ];
            } else if ((origin.includes("bangalore") || origin.includes("bengaluru")) && dest === "palani-murugan") {
              enRoute = [
                { name: "Bhavani Sangameswarar", city: "Erode", timeAdded: "+1h", desc: "Sacred confluence of rivers, a highly auspicious stop." },
                { name: "Chennimalai Murugan", city: "Erode", timeAdded: "+1.5h", desc: "Beautiful hilltop Murugan temple on the way to Palani." }
              ];
            }

            if (!enRoute) return null;

            return (
              <div className="mt-4 border-t border-border/50 pt-4 relative z-10">
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  <div className="text-xs font-bold uppercase tracking-wider text-emerald-700">{tStr("AI Suggested: En-Route Spiritual Stops")}</div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {enRoute.map((rt: any) => (
                    <div key={rt.name} className="bg-emerald-50/50 rounded-2xl p-3 border border-emerald-100 shadow-sm hover:border-emerald-300 transition-colors">
                      <div className="flex justify-between items-start mb-1">
                        <div className="text-xs font-bold text-slate-800">{tStr(rt.name)}</div>
                        <div className="text-[10px] font-bold text-emerald-600 bg-emerald-100 px-1.5 py-0.5 rounded uppercase tracking-wider">{rt.timeAdded} {tStr("detour")}</div>
                      </div>
                      <div className="text-[10px] text-emerald-700 font-medium mb-1 flex items-center gap-1"><Navigation2 className="w-3 h-3" /> {tStr(rt.city)}</div>
                      <div className="text-[10px] text-slate-500 leading-snug">{tStr(rt.desc)}</div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}
        </div>

        <div className="mt-6">
          <div className="flex items-center gap-2 mb-4">
            <BrainCircuit className="w-5 h-5 text-saffron" />
            <div className="text-base font-semibold">{tStr("Why did AI pick this time?")}</div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { icon: Users, title: tStr("Lowest Crowd"), desc: tStr("Drops to 30% capacity at 3:30 PM"), color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20" },
              { icon: ThermometerSun, title: tStr("Comfortable Weather"), desc: tStr("Temperature cools down to 28°C"), color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/20" },
              { icon: Bell, title: tStr("Highly Auspicious"), desc: tStr("Aligns with Sayaratchai Pooja at 3:00 PM"), color: "text-saffron", bg: "bg-saffron/10", border: "border-saffron/20" },
              { icon: Heart, title: tStr("Senior citizen Friendly"), desc: tStr("Less rush, wheelchair ramps easily accessible"), color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
              { icon: Car, title: tStr("Easy Parking"), desc: tStr("Lot B will be 40% free at 3:30 PM"), color: "text-indigo-500", bg: "bg-indigo-500/10", border: "border-indigo-500/20" },
            ].map((r, i) => (
              <div key={i} className={`flex gap-3 bg-background p-3 rounded-2xl border ${r.border} shadow-sm hover:shadow-md transition-shadow`}>
                <div className={`w-8 h-8 rounded-full ${r.bg} ${r.color} flex items-center justify-center shrink-0`}>
                  <r.icon className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] font-bold text-foreground uppercase tracking-wider">{r.title}</div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">{r.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <div className="flex items-center gap-2 mb-3">
            <Ticket className="w-4 h-4 text-saffron" />
            <div className="text-sm font-semibold">{tStr("Darshan Ticket Insights")}</div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-secondary/40 border border-border/50 rounded-2xl p-3 relative overflow-hidden group hover:border-border transition-colors">
              <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">{tStr("General Free")}</div>
              <div className="font-serif font-semibold text-lg text-foreground">45 - 60 {tStr("m")}</div>
              <div className="text-[10px] font-medium text-foreground/80 mt-1 leading-snug">{tStr("Normal queue via Main Entrance. High crowd expected.")}</div>
            </div>
            <div className="bg-saffron/5 border border-saffron/20 rounded-2xl p-3 relative overflow-hidden group hover:border-saffron/40 transition-colors">
              <div className="text-[10px] font-bold uppercase tracking-wider text-saffron mb-1">{tStr("Special (Rs. 100)")}</div>
              <div className="font-serif font-semibold text-lg text-saffron">30 {tStr("m")}</div>
              <div className="text-[10px] font-medium text-foreground/80 mt-1 flex items-center gap-1 leading-snug">{tStr("Dedicated queue line B.")}</div>
            </div>
            <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-3 relative overflow-hidden group hover:border-emerald-500/40 transition-colors">
              <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 mb-1 flex items-center gap-1"><Crown className="w-3.5 h-3.5" /> {tStr("VIP Pass (Rs. 500)")}</div>
              <div className="font-serif font-semibold text-lg text-emerald-600">15 {tStr("m")}</div>
              <div className="text-[10px] font-medium text-foreground/80 mt-1 leading-snug">{tStr("Fastest route. Direct access to Sanctum approach.")}</div>
            </div>
          </div>
        </div>

        <div className="mt-4 bg-saffron/10 border border-saffron/20 rounded-lg p-2.5 text-xs text-saffron font-medium">
          ⚠ {t.specialDay} {tStr("is a special puja day — carry valid ID for VIP darshan.")}
        </div>

        <div className="mt-5 flex flex-wrap gap-3 print:hidden">
          <button onClick={() => window.print()} className="rounded-full bg-saffron text-white shadow-md shadow-saffron/20 px-5 py-2.5 text-sm font-bold transition-transform hover:-translate-y-0.5">
            {tStr("Export as PDF")}
          </button>
          <button className="rounded-full bg-white border border-border px-5 py-2.5 text-sm font-semibold transition-transform hover:-translate-y-0.5">{tStr("🔔 Set crowd alert")}</button>
          <Link to="/temple/$slug" params={{ slug: t.slug }} className="rounded-full bg-white border border-border px-5 py-2.5 text-sm font-semibold transition-transform hover:-translate-y-0.5">{tStr("View temple map →")}</Link>
        </div>

        <div className="mt-6 border-t border-border pt-4 print:hidden">
          <div className="text-sm font-semibold mb-2">{tStr("Compare time slots for selected date")}</div>
          <div className="space-y-1.5">
            {[
              { t: "6:00 – 8:00 AM", crowd: 20, wait: 12, stars: 5 },
              { t: "8:00 – 10:00 AM", crowd: 75, wait: 58, stars: 2 },
              { t: "10:00 – 12:00 PM", crowd: 60, wait: 42, stars: 3 },
              { t: "3:00 – 5:00 PM", crowd: 35, wait: 18, stars: 5, pick: true },
              { t: "5:00 – 7:00 PM", crowd: 55, wait: 35, stars: 3 },
              { t: "7:00 – 9:00 PM", crowd: 40, wait: 22, stars: 4 },
            ].map(s => (
              <div key={s.t} className={`flex items-center gap-2 text-xs p-2 rounded-lg transition-colors ${s.pick ? "bg-saffron/10 border border-saffron/30" : "border border-transparent hover:border-border"}`}>
                <div className="w-28 shrink-0 font-medium">{s.t}</div>
                <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden"><div className="h-full transition-all" style={{ width: `${s.crowd}%`, background: s.crowd < 40 ? "var(--status-low)" : s.crowd < 70 ? "var(--status-mod)" : "var(--status-high)" }} /></div>
                <div className="w-10 text-right text-muted-foreground">{s.wait}{tStr("m")}</div>
                <div className="w-14 text-right text-gold">{"⭐".repeat(s.stars)}</div>
                {s.pick && <span className="text-[10px] text-saffron font-bold uppercase tracking-wider">{tStr("AI Pick")}</span>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* PRINT ONLY TEXT-BASED LAYOUT */}
      <div className="hidden print:block bg-white text-black p-8 font-sans print:m-0">
        <div className="border-b-2 border-slate-800 pb-4 mb-6">
          <h1 className="text-3xl font-bold uppercase tracking-wide">Temple Visit Itinerary</h1>
          <h2 className="text-xl font-semibold mt-1">{tStr(t.name)}</h2>
        </div>
        
        <div className="grid grid-cols-2 gap-8 mb-8 text-sm">
          <div>
            <p className="text-gray-500 uppercase font-bold text-xs">Travel Date</p>
            <p className="font-semibold text-lg">{date || "Upcoming"}</p>
          </div>
          <div>
            <p className="text-gray-500 uppercase font-bold text-xs">Route</p>
            <p className="font-semibold text-lg">{fromLocation || "Your Location"} → {tStr(t.city)}</p>
          </div>
        </div>

        <div className="bg-gray-100 p-4 mb-8 border border-gray-200">
          <p className="text-gray-500 uppercase font-bold text-xs mb-1">Best Darshan Slot</p>
          <p className="font-bold text-xl text-emerald-700">3:30 PM – 5:00 PM</p>
          <p className="text-sm mt-1">Expected Wait: ~18 mins. Recommended for lowest crowd and easy parking.</p>
        </div>

        <h3 className="text-lg font-bold border-b border-gray-300 pb-2 mb-4 uppercase">Transportation Options</h3>
        {trans.isInternational && trans.flights && trans.flights.length > 0 && (
          <div className="mb-6">
            <h4 className="font-bold mb-2">Flights</h4>
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 p-2">Airline</th>
                  <th className="border border-gray-300 p-2">Route</th>
                  <th className="border border-gray-300 p-2">Layover</th>
                  <th className="border border-gray-300 p-2">Total Duration</th>
                </tr>
              </thead>
              <tbody>
                {trans.flights.map((f: any, i: number) => (
                  <tr key={i}>
                    <td className="border border-gray-300 p-2 font-semibold">{f.airline} ({f.code})</td>
                    <td className="border border-gray-300 p-2">{f.route.join(" → ")}</td>
                    <td className="border border-gray-300 p-2">{f.layover}</td>
                    <td className="border border-gray-300 p-2">{f.duration}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {trans.airportCab && (
          <div className="mb-6">
             <h4 className="font-bold mb-2">Airport Transfer: {trans.airportCab.route}</h4>
             <table className="w-full text-left text-sm border-collapse">
               <thead>
                 <tr className="bg-gray-100">
                   <th className="border border-gray-300 p-2">Available Cabs</th>
                   <th className="border border-gray-300 p-2">Distance</th>
                   <th className="border border-gray-300 p-2">Est. Time</th>
                   <th className="border border-gray-300 p-2">Est. Fare</th>
                 </tr>
               </thead>
               <tbody>
                 <tr>
                   <td className="border border-gray-300 p-2">Uber, Ola, Pre-paid Taxi</td>
                   <td className="border border-gray-300 p-2">{trans.airportCab.distance}</td>
                   <td className="border border-gray-300 p-2">{trans.airportCab.time}</td>
                   <td className="border border-gray-300 p-2">{trans.airportCab.price}</td>
                 </tr>
               </tbody>
             </table>
          </div>
        )}

        <h3 className="text-lg font-bold border-b border-gray-300 pb-2 mb-4 uppercase mt-8">Recommended Stays Nearby</h3>
        <table className="w-full text-left text-sm border-collapse mb-8">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2">Hotel Name</th>
              <th className="border border-gray-300 p-2">Rating</th>
              <th className="border border-gray-300 p-2">Distance from Temple</th>
            </tr>
          </thead>
          <tbody>
            {hotels.map((h: any, i: number) => (
              <tr key={i}>
                <td className="border border-gray-300 p-2 font-semibold">{h.name}</td>
                <td className="border border-gray-300 p-2">{h.rating} / 5.0</td>
                <td className="border border-gray-300 p-2">{h.dist} km</td>
              </tr>
            ))}
          </tbody>
        </table>
        
        <p className="text-xs text-gray-500 text-center mt-12 border-t border-gray-200 pt-4">Generated by OMG Devotee AI Smart Planner</p>
      </div>

    </div>
  );
}
