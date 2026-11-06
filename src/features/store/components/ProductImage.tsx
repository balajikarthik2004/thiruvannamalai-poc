import { memo, useState } from "react";
import { Flame, Image as ImageIcon, Shirt, Gem, Leaf, Sparkles, Package } from "lucide-react";
import type { Product } from "@/data/store";
import { useTranslation } from "react-i18next";

/**
 * Product photo with a devotional fallback.
 *
 * Every catalogue item ships a photo, but a missing or slow file used to leave
 * an empty grey square. When the image fails we draw a category-coloured
 * gradient with the matching icon and the product name, so the card still reads
 * as a product rather than a hole in the grid.
 */

type Category = Product["category"];

const CATEGORY_ART: Record<Category, { from: string; to: string; icon: typeof Flame }> = {
  Lamps: { from: "#fb923c", to: "#b45309", icon: Flame },
  Photos: { from: "#818cf8", to: "#3730a3", icon: ImageIcon },
  Apparel: { from: "#38bdf8", to: "#0369a1", icon: Shirt },
  Idols: { from: "#f59e0b", to: "#92400e", icon: Gem },
  Sachets: { from: "#f87171", to: "#991b1b", icon: Leaf },
  Hangings: { from: "#34d399", to: "#065f46", icon: Sparkles },
  Merchandise: { from: "#a78bfa", to: "#5b21b6", icon: Package },
};

export const ProductImage = memo(function ProductImage({
  product,
  className = "",
  eager = false,
}: {
  product: Product;
  className?: string;
  eager?: boolean;
}) {
  const { t } = useTranslation();
  const [failed, setFailed] = useState(false);
  const art = CATEGORY_ART[product.category] ?? CATEGORY_ART.Merchandise;
  const Icon = art.icon;

  if (failed || !product.image) {
    return (
      <div
        className={`flex flex-col items-center justify-center text-center p-4 ${className}`}
        style={{ background: `linear-gradient(140deg, ${art.from}, ${art.to})` }}
        role="img"
        aria-label={t(product.name)}
      >
        <Icon className="w-10 h-10 text-white/90 drop-shadow mb-2" strokeWidth={1.5} />
        <span className="text-white text-xs font-bold leading-tight line-clamp-3 drop-shadow">
          {t(product.name)}
        </span>
      </div>
    );
  }

  return (
    <img
      src={product.image}
      alt={t(product.name)}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      onError={() => setFailed(true)}
      className={`object-cover bg-rose-50 ${className}`}
    />
  );
});
