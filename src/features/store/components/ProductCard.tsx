import { Link } from "@tanstack/react-router";
import { ShoppingCart, Plus, Check } from "lucide-react";
import { memo, useState } from "react";
import type { Product } from "@/data/store";
import { useCart } from "@/features/store/context/CartContext";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { formatINR } from "@/lib/currency";
import { ProductImage } from "./ProductImage";

interface ProductCardProps {
  storeId: string;
  product: Product;
}

/**
 * Memoised: the store grid renders 20+ of these and re-rendered all of them
 * whenever the cart or a filter changed.
 */
export const ProductCard = memo(function ProductCard({ storeId, product }: ProductCardProps) {
  const { t } = useTranslation();
  const { addToCart } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  const handleAddToCart = () => {
    addToCart(product, 1);
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1600);
    toast.success(t("Added to cart"), {
      description: `${t(product.name)} — ${formatINR(product.price)}`,
      icon: <ShoppingCart className="w-4 h-4" />,
    });
  };

  const lowStock = product.stock > 0 && product.stock <= 15;

  return (
    <div className="group relative flex flex-col h-full bg-white border border-rose-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-lg hover:shadow-saffron/5 hover:border-saffron/40 hover:-translate-y-0.5 transition-all duration-300">
      <Link
        to="/store/$storeId/item/$itemId"
        params={{ storeId, itemId: product.id }}
        className="flex flex-col flex-1"
      >
        <div className="relative aspect-square overflow-hidden">
          <ProductImage
            product={product}
            className="w-full h-full transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/25 to-transparent pointer-events-none" />
          <span className="absolute top-3 left-3 rounded-full bg-white/95 backdrop-blur-sm px-2.5 py-1 text-[11px] font-bold text-slate-700 shadow-sm">
            {t(product.category)}
          </span>
          {lowStock && (
            <span className="absolute top-3 right-3 rounded-full bg-amber-500 px-2.5 py-1 text-[11px] font-bold text-white shadow-sm">
              {t("Only")} {product.stock} {t("left")}
            </span>
          )}
        </div>
        <div className="flex flex-col flex-1 p-4 pb-3">
          <div className="flex justify-between items-start gap-2">
            <h3 className="font-bold text-sm text-slate-900 leading-snug line-clamp-2 group-hover:text-saffron transition-colors">
              {t(product.name)}
            </h3>
            <span className="font-black text-saffron text-base tabular-nums shrink-0">
              {formatINR(product.price)}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1.5 line-clamp-2">{t(product.description)}</p>
        </div>
      </Link>
      <div className="px-4 pb-4">
        <button
          type="button"
          onClick={handleAddToCart}
          aria-label={`${t("Add to Cart")} — ${t(product.name)}`}
          className={`w-full h-10 rounded-full border text-sm font-bold flex items-center justify-center gap-1.5 transition-colors ${
            justAdded
              ? "bg-emerald-500 border-emerald-500 text-white"
              : "border-saffron/30 bg-rose-50 text-saffron hover:bg-saffron hover:text-white hover:border-saffron"
          }`}
        >
          {justAdded ? (
            <>
              <Check className="w-4 h-4" /> {t("Added")}
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" /> {t("Add to Cart")}
            </>
          )}
        </button>
      </div>
    </div>
  );
});
