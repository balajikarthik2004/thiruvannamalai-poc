import { Link } from "@tanstack/react-router";
import { ArrowLeft, Share2, Bookmark, MapPin, X, MessageCircle, Twitter, Facebook, Instagram, Link2, CheckCircle2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useState } from "react";

import muruganImg from "@/assets/murugan.png";
import meenakshiImg from "@/assets/meenakshi.png";
import dallasMariammanImg from "@/assets/dallas-mariamman.png";

const bgImages: Record<string, string> = {
  "tiruvannamalai": "/temples/tiruvannamalai/panorama.jpg",
  "palani-murugan": muruganImg,
  "madurai-meenakshi": meenakshiImg,
  "dallas-arulmigu-mariamman-usa": dallasMariammanImg,
};

// Per-temple object-position overrides (helps low-res images show the best area)
const bgPositions: Record<string, string> = {
  "tiruvannamalai": "center 40%",
  "palani-murugan": "center 20%",
  "madurai-meenakshi": "center 20%",
  "dallas-arulmigu-mariamman-usa": "center 20%",
};

export function TempleHero({ t }: any) {
  const { t: tStr } = useTranslation();
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const hasBgImg = !!bgImages[t.slug];

  const copyLink = () => {
    navigator.clipboard.writeText(`https://omg-devotee.vercel.app/temple/${t.slug}`);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <>
      <div
        className="relative h-[240px] lg:h-[260px] overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${t.gradientFrom}, ${t.color})` }}
      >
        {/* Banner image */}
        {hasBgImg && (
          <img
            src={bgImages[t.slug]}
            alt={t.name}
            className="absolute inset-0 w-full h-full object-cover"
            style={{ objectPosition: bgPositions[t.slug] ?? "center 20%" }}
          />
        )}
        {hasBgImg && <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10" />}
        {!hasBgImg && <svg viewBox="0 0 100 100" className="absolute -right-10 -bottom-10 w-48 h-48 text-white opacity-[0.08]"><text x="50" y="72" textAnchor="middle" fontSize="80" fill="currentColor" fontFamily="Noto Serif">ॐ</text></svg>}

        <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4 z-10">
          <Link to="/" className="w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-white hover:bg-white/30 transition-colors"><ArrowLeft className="w-5 h-5" /></Link>
          <div className="flex gap-2">
            <button onClick={() => setIsShareOpen(true)} className="w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-white hover:bg-white/30 transition-colors"><Share2 className="w-4 h-4" /></button>
            <button className="w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-white hover:bg-white/30 transition-colors"><Bookmark className="w-4 h-4" /></button>
          </div>
        </div>
        <div className="absolute bottom-0 inset-x-0 p-5 lg:p-8 text-white z-10">
          <h1 className="font-serif text-3xl lg:text-4xl font-semibold leading-tight drop-shadow-lg">{tStr(t.name)}</h1>
          <div className="text-sm opacity-90 mt-1 drop-shadow-md">{tStr(t.established || "Ancient temple")} · {tStr(t.tier || "Major Kshetram")}</div>
          <div className="text-sm opacity-90 flex items-center gap-1 mt-1 drop-shadow-md"><MapPin className="w-4 h-4" /> {tStr(t.city)}, {tStr(t.district)} {tStr("District")}</div>
        </div>
      </div>

      {/* Share Modal */}
      {isShareOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsShareOpen(false)}>
          <div className="bg-white rounded-[32px] w-full max-w-sm overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-serif text-xl font-bold text-slate-900">{tStr("Share Temple")}</h3>
                <button onClick={() => setIsShareOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-4 gap-4">
                <button className="flex flex-col items-center gap-2 group">
                  <div className="w-14 h-14 rounded-full bg-green-50 text-green-600 flex items-center justify-center group-hover:bg-green-500 group-hover:text-white transition-all shadow-sm border border-green-100">
                    <MessageCircle className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-600">WhatsApp</span>
                </button>

                <button className="flex flex-col items-center gap-2 group">
                  <div className="w-14 h-14 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm border border-blue-100">
                    <Facebook className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-600">Facebook</span>
                </button>

                <button className="flex flex-col items-center gap-2 group">
                  <div className="w-14 h-14 rounded-full bg-slate-50 text-slate-700 flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-all shadow-sm border border-slate-200">
                    <Twitter className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-600">Twitter</span>
                </button>

                <button className="flex flex-col items-center gap-2 group">
                  <div className="w-14 h-14 rounded-full bg-pink-50 text-pink-600 flex items-center justify-center group-hover:bg-gradient-to-tr from-orange-500 via-pink-500 to-purple-500 group-hover:text-white group-hover:border-transparent transition-all shadow-sm border border-pink-100">
                    <Instagram className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-600">Instagram</span>
                </button>
              </div>

              <div className="mt-6 p-1 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2">
                <div className="truncate text-xs text-slate-500 pl-3 flex-1 font-medium select-all">
                  https://omg-devotee.vercel.app/temple/{t.slug}
                </div>
                <button onClick={copyLink} className="shrink-0 bg-white text-slate-700 text-xs font-bold px-4 py-2.5 rounded-lg border border-slate-200 shadow-sm hover:border-saffron hover:text-saffron transition-colors flex items-center gap-1.5 w-24 justify-center">
                  {isCopied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : <Link2 className="w-3.5 h-3.5" />}
                  {isCopied ? tStr("Copied!") : tStr("Copy")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Popup */}
      {isCopied && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[110] bg-slate-900/90 backdrop-blur-md text-white px-5 py-3 rounded-full shadow-2xl flex items-center gap-2 animate-in slide-in-from-bottom-5 fade-in duration-300">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span className="text-sm font-bold tracking-wide">{tStr("Link copied to clipboard")}</span>
        </div>
      )}
    </>
  );
}
