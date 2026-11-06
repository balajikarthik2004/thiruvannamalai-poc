import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { getStoreById } from "@/data/store";
import { ProductCard } from "@/features/store/components/ProductCard";
import { ArrowLeft, ShoppingBag, MapPin, Package, Store as StoreIcon, ShieldCheck } from "lucide-react";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/_app/store/$storeId/")({
  loader: ({ params }) => {
    const store = getStoreById(params.storeId);
    if (!store) throw notFound();
    return { store };
  },
  component: StoreDetails,
});

function StoreDetails() {
  const { t } = useTranslation();
  const { store } = Route.useLoaderData();
  const [category, setCategory] = useState("All");
  const name = store.name.replace(/ Official Store$/, "");

  const categories = useMemo(() => ["All", ...Array.from(new Set(store.products.map((p) => p.category)))], [store]);
  const products = category === "All" ? store.products : store.products.filter((p) => p.category === category);
  const count = (c: string) => (c === "All" ? store.products.length : store.products.filter((p) => p.category === c).length);

  return (
    <div className="min-h-screen bg-[#fdf8f6] pb-10">
      {/* Header banner */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-y-0 right-0 w-full md:w-1/2 pointer-events-none" aria-hidden>
          <img src={store.heroImage} alt="" className="w-full h-full object-cover object-center opacity-40 md:opacity-100" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#fdf8f6] via-[#fdf8f6]/30 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#fdf8f6] to-transparent" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 lg:px-8 pt-6 pb-10">
          <Link to="/store" className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-saffron bg-white border border-rose-100 rounded-full px-3 py-1.5 shadow-sm">
            <ArrowLeft className="w-4 h-4" /> {t("Back to Stores")}
          </Link>
          <span className="mt-5 flex w-fit items-center gap-2 rounded-full bg-rose-50 border border-rose-100 px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-saffron">
            <StoreIcon className="w-4 h-4" /> {t("Official Temple Store")}
          </span>
          <h1 className="font-serif text-3xl lg:text-4xl font-bold text-slate-900 mt-3 max-w-xl">{t(name)}</h1>
          <p className="text-sm text-slate-600 mt-2 max-w-md">{t("Purchase authentic prasadam, merchandise, and pooja items directly from the temple. Includes a temple pickup option for your convenience.")}</p>
          <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-slate-700">
            <span className="inline-flex items-center gap-1.5 bg-white border border-rose-100 rounded-full px-3 py-1.5"><MapPin className="w-3.5 h-3.5 text-saffron" /> {t(store.city)}, {t(store.state)}</span>
            <span className="inline-flex items-center gap-1.5 bg-white border border-rose-100 rounded-full px-3 py-1.5"><Package className="w-3.5 h-3.5 text-saffron" /> {store.products.length} {t("products")}</span>
            <span className="inline-flex items-center gap-1.5 bg-white border border-rose-100 rounded-full px-3 py-1.5"><ShieldCheck className="w-3.5 h-3.5 text-saffron" /> {t("Temple pickup available")}</span>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <h2 className="flex items-center gap-2 font-serif text-xl font-bold text-slate-900">
            <ShoppingBag className="w-5 h-5 text-saffron" /> {t("Available Items")}
          </h2>
          <div role="tablist" aria-label={t("Category")} className="flex gap-2 overflow-x-auto scrollbar-hide">
            {categories.map((c) => {
              const active = category === c;
              return (
                <button
                  key={c}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setCategory(c)}
                  className={`shrink-0 h-9 px-4 rounded-full text-sm font-semibold border transition-all ${
                    active ? "bg-saffron text-white border-saffron shadow-md shadow-saffron/20" : "bg-white text-slate-600 border-rose-100 hover:border-saffron/50 hover:text-saffron"
                  }`}
                >
                  {c === "All" ? t("All") : t(c)} ({count(c)})
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} storeId={store.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
