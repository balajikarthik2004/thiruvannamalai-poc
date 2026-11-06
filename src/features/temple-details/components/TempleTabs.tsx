import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Info, MapPin, Star, Accessibility, ChevronRight, Flame, Mountain, Landmark } from "lucide-react";
import { tiruvannamalaiFacts, ashtaLingams, tiruvannamalaiGallery } from "@/data/tiruvannamalai";

export function TempleTabs({ t }: any) {
  const { t: tStr } = useTranslation();

  const tabs = [
    { name: tStr("About"), icon: <Info className="w-3.5 h-3.5" />, colorClass: "text-blue-500" },
    { name: tStr("Facilities"), icon: <Accessibility className="w-3.5 h-3.5" />, colorClass: "text-emerald-500" },
    { name: tStr("Nearby"), icon: <MapPin className="w-3.5 h-3.5" />, colorClass: "text-rose-500" },
    { name: tStr("Reviews"), icon: <Star className="w-3.5 h-3.5" />, colorClass: "text-amber-500" }
  ];
  const [tab, setTab] = useState(0);

  const getRealDescription = (slug: string) => {
    switch (slug) {
      case 'palani-murugan':
        return tStr("Palani Murugan Temple is one of the Six Abodes of Lord Murugan (Arupadaiveedu), situated majestically on the Palani Hills. The idol of the presiding deity, Lord Dhandayuthapani Swamy, is uniquely made out of an amalgam of nine poisonous herbs (Navapashanam) by the ancient Siddhar Bogar. Known for its spiritually charged atmosphere, the temple attracts millions of devotees seeking blessings and profound peace.");
      case 'madurai-meenakshi':
        return tStr("Meenakshi Amman Temple is a historic Hindu temple located on the southern bank of the Vaigai River in Madurai. It is dedicated to Goddess Meenakshi, a form of Parvati, and her consort, Sundareshwarar. The temple is famed for its stunning Dravidian architecture, towering gopurams adorned with thousands of colorful figures, and the legendary Hall of Thousand Pillars.");
      default:
        return t.description ? tStr(t.description) : `${tStr(t.name)} ${tStr("is a renowned spiritual destination located in the heart of")} ${tStr(t.city)}, ${tStr(t.state)}. ${tStr("Dedicated to")} ${tStr(t.deity)}, ${tStr("it is an architectural marvel that attracts thousands of devotees daily.")}`;
    }
  };

  const description = getRealDescription(t.slug);

  const mockReviews = [
    { initials: "RK", name: "Ramesh K", date: "2 days ago", rating: 5, color: "bg-orange-100 text-orange-700", text: "Very peaceful in the morning hours. The arrangements were quite orderly, allowing for a good darshan experience." },
    { initials: "PS", name: "Priya S", date: "1 week ago", rating: 4, color: "bg-emerald-100 text-emerald-700", text: "Queue was manageable at 4 PM. Highly recommend visiting during weekdays to avoid the heavy weekend rush." },
    { initials: "MK", name: "Manoj Kumar", date: "2 weeks ago", rating: 5, color: "bg-blue-100 text-blue-700", text: "Amazing architecture and divine atmosphere. The temple administration is doing a great job maintaining cleanliness." },
    { initials: "AL", name: "Anitha L", date: "1 month ago", rating: 3, color: "bg-rose-100 text-rose-700", text: "Darshan was wonderful but parking was a bit chaotic. Better to use public transport during festival days." },
    { initials: "VN", name: "Venkatesh N", date: "2 months ago", rating: 5, color: "bg-indigo-100 text-indigo-700", text: "A truly spiritually uplifting experience. The Annadhanam provided was hygienic and tasty. Will definitely visit again." },
  ];

  return (
    <div className="bg-white border border-slate-100/60 rounded-2xl p-5 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_4px_25px_rgb(0,0,0,0.06)] transition-all duration-300">
      <div className="flex flex-wrap gap-2 border-b border-slate-100 pb-4">
        {tabs.map((tb, i) => (
          <button
            key={tb.name}
            onClick={() => setTab(i)}
            className={`flex items-center gap-1.5 whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 ${tab === i ? "bg-gradient-to-r from-orange-500 to-rose-500 text-white shadow-md shadow-orange-500/20" : "text-slate-600 hover:bg-orange-50 hover:text-orange-600"}`}
          >
            <span className={tab === i ? "text-white" : tb.colorClass}>{tb.icon}</span>
            {tb.name}
          </button>
        ))}
      </div>

      <div className="pt-5">
        {tab === 0 && (
          <div className="space-y-5">
            <div className="flex flex-col md:flex-row gap-3 bg-gradient-to-br from-orange-50/50 to-rose-50/30 p-4 rounded-xl border border-orange-100/50 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-3 opacity-10 pointer-events-none">
                <Landmark className="w-16 h-16 text-orange-600" />
              </div>
              <div className="relative z-10 flex flex-col justify-center">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-orange-600/80 mb-0.5">{tStr("Presiding Deity")}</span>
                <span className="text-lg md:text-xl font-serif font-bold text-slate-900 break-words leading-tight">{tStr(t.deity)}</span>
              </div>
            </div>

            <div className="text-sm text-slate-700 leading-relaxed font-medium whitespace-pre-wrap inline">
              {description}
              <span className="text-blue-600 font-bold cursor-pointer ml-1 hover:underline">{tStr("See more")}</span>
            </div>

            {t.slug === 'tiruvannamalai' && (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {tiruvannamalaiFacts.map(f => (
                    <div key={f.label} className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{tStr(f.label)}</div>
                      <div className="text-xs font-bold text-slate-800 mt-0.5">{tStr(f.value)}</div>
                    </div>
                  ))}
                </div>

                <div className="bg-rose-50/50 p-4 rounded-xl border border-rose-100/50">
                  <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-1.5"><Flame className="w-4 h-4 text-rose-500" /> {tStr("Upcoming Festival")}</h3>
                  <div className="bg-white rounded-lg p-3 border border-rose-100 shadow-sm flex items-center justify-between gap-3">
                    <div>
                      <div className="font-bold text-rose-700 text-sm">{tStr("Karthigai Deepam · Bharani & Maha Deepam")}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{tStr("Bharani Deepam at 4 AM in the temple; Maha Deepam lit on the Arunachala summit at 6 PM. Dates per published calendars — confirm with the temple.")}</div>
                    </div>
                    <div className="bg-rose-100 text-rose-800 text-xs font-bold px-3 py-1.5 rounded-lg text-center shrink-0 shadow-inner">
                      {tStr("Nov 24")}<br />2026
                    </div>
                  </div>
                </div>

                <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-100/60">
                  <h3 className="font-bold text-slate-800 mb-1 flex items-center gap-1.5"><Mountain className="w-4 h-4 text-amber-600" /> {tStr("Girivalam · Ashta Lingams")}</h3>
                  <p className="text-xs text-slate-500 mb-3">{tStr("The 14 km barefoot walk around Arunachala passes these eight lingams, clockwise from the East.")}</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {ashtaLingams.map((l, i) => (
                      <div key={l.name} className="bg-white rounded-lg border border-amber-100 p-2 text-center">
                        <div className="text-[10px] font-bold text-amber-600">{i + 1} · {tStr(l.direction)}</div>
                        <div className="text-xs font-bold text-slate-800">{tStr(l.name)}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-slate-800 mb-2">{tStr("Photo Gallery")}</h3>
                  <div className="flex gap-3 overflow-x-auto pb-2 snap-x">
                    {tiruvannamalaiGallery.map(img => (
                      <figure key={img.src} className="shrink-0 w-48 snap-start">
                        <img src={img.src} alt={img.caption} loading="lazy" className="w-48 h-32 object-cover rounded-xl border border-slate-100" />
                        <figcaption className="text-[10px] text-slate-500 mt-1 leading-snug">
                          {tStr(img.caption)} · <a href={img.sourceUrl} target="_blank" rel="noreferrer" className="underline hover:text-slate-700">{img.author}, {img.license}</a>
                        </figcaption>
                      </figure>
                    ))}
                  </div>
                </div>
              </>
            )}

            {t.slug === 'palani-murugan' && (
              <>
                <div className="mt-4 bg-rose-50/50 p-4 rounded-xl border border-rose-100/50">
                  <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-1.5"><Flame className="w-4 h-4 text-rose-500" /> {tStr("Upcoming Festivals")}</h3>
                  <div className="bg-white rounded-lg p-3 border border-rose-100 shadow-sm flex items-center justify-between">
                    <div>
                      <div className="font-bold text-rose-700 text-sm">{tStr("kanda Sashti & Soora Samharam")}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{tStr("The most significant annual observance of Lord Murugan's victory.")}</div>
                    </div>
                    <div className="bg-rose-100 text-rose-800 text-xs font-bold px-3 py-1.5 rounded-lg text-center shrink-0 shadow-inner">
                      {tStr("Nov 10")}<br />2026
                    </div>
                  </div>
                </div>
              </>
            )}

          </div>
        )}

        {tab === 1 && (
          <div className="grid grid-cols-2 gap-3">
            {[
              { n: "Wheelchair", i: "♿" }, { n: "Restrooms", i: "🚻" },
              { n: "Prasad", i: "🥛" }, { n: "Footwear", i: "👟" },
              { n: "First Aid", i: "💊" }, { n: "Bathing Ghat", i: "🚿" },
              { n: "No Photography", i: "📵" }, { n: "Free Parking", i: "🅿" }
            ].map(f => (
              <div key={f.n} className="flex flex-col items-center justify-center bg-white border border-slate-100 hover:border-slate-200 hover:bg-orange-50/30 rounded-xl p-3 text-center transition-colors shadow-sm">
                <span className="text-2xl mb-1.5">{f.i}</span>
                <span className="text-[11px] font-bold text-slate-700">{tStr(f.n)}</span>
              </div>
            ))}
          </div>
        )}

        {tab === 2 && (
          <div className="grid md:grid-cols-2 gap-3">
            {[
              { n: "Choultries", d: "0.3 km", i: "🏨" },
              { n: "Veg Restaurants", d: "0.5 km", i: "🍽" },
              { n: "ATM", d: "0.2 km", i: "🏧" },
              { n: "Hospital", d: "1.1 km", i: "🏥" }
            ].map(n => (
              <div key={n.n} className="flex items-center p-3 bg-slate-50 hover:bg-orange-50/50 rounded-xl border border-slate-100/80 transition-colors">
                <div className="w-10 h-10 bg-white rounded-lg shadow-sm flex items-center justify-center text-xl shrink-0 mr-3">{n.i}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-slate-800 truncate">{tStr(n.n)}</div>
                  <div className="text-[10px] font-semibold text-slate-500 mt-0.5">{tStr("Distance")}: {n.d}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 3 && (
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-orange-50/50 rounded-xl border border-orange-100/50">
              <div className="text-3xl font-serif font-bold text-slate-900 tracking-tight">4.3</div>
              <div>
                <div className="flex text-amber-500 mb-0.5">
                  {[1, 2, 3, 4].map(i => <Star key={i} className="w-3.5 h-3.5 fill-amber-500" />)}
                  <Star className="w-3.5 h-3.5 text-slate-200 fill-slate-200" />
                </div>
                <div className="text-xs font-bold text-slate-500">{tStr("Based on 2,841 reviews")}</div>
              </div>
            </div>

            <div className="grid gap-3 max-h-[190px] overflow-y-auto pr-2 pb-2">
              {mockReviews.map((rev, idx) => (
                <div key={idx} className="border border-slate-100 rounded-xl p-4 bg-white shadow-[0_2px_10px_rgb(0,0,0,0.02)] hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-[11px] ${rev.color}`}>
                        {rev.initials}
                      </div>
                      <div>
                        <div className="text-xs font-extrabold text-slate-800">{rev.name}</div>
                        <div className="text-[10px] font-medium text-slate-400 mt-0.5">{rev.date}</div>
                      </div>
                    </div>
                    <div className="flex text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3 h-3 ${i < rev.rating ? "fill-amber-500" : "text-slate-200 fill-slate-200"}`} />
                      ))}
                    </div>
                  </div>
                  <div className="text-[12px] font-medium text-slate-600 leading-relaxed">"{rev.text}"</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
