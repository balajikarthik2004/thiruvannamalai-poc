import { Link } from "@tanstack/react-router";
import { MapPin, ArrowRight, Package } from "lucide-react";
import type { Store } from "@/data/store";
import { useTranslation } from "react-i18next";

export function StoreCard({ store }: { store: Store }) {
  const { t } = useTranslation();
  const name = store.name.replace(/ Official Store$/, "");

  return (
    <Link
      to="/store/$storeId"
      params={{ storeId: store.id }}
      className="group flex flex-col h-full bg-white border border-rose-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-md hover:border-saffron/40 transition-all"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-rose-50">
        <img
          src={store.image}
          alt={t(name)}
          loading="lazy"
          className="w-full h-full object-cover object-[center_35%] transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-full bg-white/90 backdrop-blur-sm px-2.5 py-1 text-xs font-bold text-slate-800 shadow-sm">
          <Package className="w-3.5 h-3.5 text-saffron" /> {store.products.length} {t("items")}
        </span>
      </div>
      <div className="flex flex-col flex-1 p-4">
        <h3 className="font-serif font-bold text-[15px] text-slate-900 leading-snug line-clamp-2 group-hover:text-saffron transition-colors">{t(name)}</h3>
        <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
          <MapPin className="w-3.5 h-3.5 text-saffron shrink-0" /> {t(store.city)}, {t(store.state)}
        </div>
        <p className="text-xs text-slate-500 mt-2 line-clamp-2 flex-1">{t("Prasadam, pooja items and devotional merchandise with temple pickup.")}</p>
        <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-saffron">
          {t("Visit Store")} <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}
