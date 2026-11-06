import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { getProductById, getStoreById } from "@/data/store";
import { ArrowLeft, ShoppingCart, CheckCircle2, ShieldCheck, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/features/store/context/CartContext";
import { toast } from "sonner";
import { useState } from "react";
import { formatINR } from "@/lib/currency";
import { ProductImage } from "@/features/store/components/ProductImage";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/_app/store/$storeId/item/$itemId")({
  loader: ({ params }) => {
    const store = getStoreById(params.storeId);
    const product = getProductById(params.storeId, params.itemId);
    if (!store || !product) throw notFound();
    return { store, product };
  },
  component: ItemDetail,
});

function ItemDetail() {
  const { t } = useTranslation();
  const { store, product } = Route.useLoaderData();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast.success(t("Added to cart"), {
      description: `${quantity}x ${product.name}${t(" has been added to your shopping cart.")}`,
      icon: <ShoppingCart className="w-4 h-4" />,
    });
  };

  return (
    <div className="min-h-screen bg-[#fdf8f6] pb-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-8">
        <Link 
          to="/store/$storeId"
          params={{ storeId: store.id }}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-saffron bg-white border border-rose-100 rounded-full px-3 py-1.5 shadow-sm mb-8 w-fit transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> {t("Back to ")}{t(store.name)}
        </Link>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-square rounded-3xl overflow-hidden bg-rose-50 border border-rose-100 shadow-sm">
              <ProductImage
                product={product}
                eager
                className="w-full h-full hover:scale-105 transition-transform duration-700"
              />
            </div>
            {product.credit && <p className="text-xs text-muted-foreground">{product.credit}</p>}
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <Badge className="w-fit mb-4 bg-rose-50 text-saffron border border-rose-100 hover:bg-rose-100">{t(product.category)}</Badge>
            <h1 className="font-serif text-3xl lg:text-4xl font-bold text-slate-900 mb-4 leading-tight">{t(product.name)}</h1>
            <div className="text-3xl font-black text-saffron mb-6 tabular-nums">{formatINR(product.price)}</div>
            
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              {t(product.description)}
            </p>

            <div className="bg-white border border-rose-100 rounded-3xl p-6 mb-8 space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="font-medium text-foreground">{t("Quantity")}</span>
                <div className="flex items-center gap-4 bg-muted/50 rounded-lg p-1">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 flex items-center justify-center rounded-md bg-background shadow-sm hover:bg-muted text-foreground transition-colors"
                  >
                    -
                  </button>
                  <span className="font-semibold w-4 text-center">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 flex items-center justify-center rounded-md bg-background shadow-sm hover:bg-muted text-foreground transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
              
              <div className="pt-4 border-t border-border/50">
                <Button 
                  size="lg" 
                  className="w-full text-base font-bold h-14 rounded-full bg-saffron hover:brightness-95 text-white shadow-lg shadow-saffron/25"
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="w-5 h-5 mr-2" /> {t("Add to Cart — ")}{formatINR(product.price * quantity)}
                </Button>
              </div>
            </div>

            {/* Features list */}
            <div className="grid sm:grid-cols-2 gap-4 mt-auto">
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-white border border-rose-100">
                <ShieldCheck className="w-6 h-6 text-saffron shrink-0" />
                <div>
                  <h4 className="font-medium text-foreground text-sm">{t("Authentic Product")}</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">{t("Sourced directly from temple.")}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-white border border-rose-100">
                <Truck className="w-6 h-6 text-saffron shrink-0" />
                <div>
                  <h4 className="font-medium text-foreground text-sm">{t("Temple Pickup")}</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">{t("Available for this item.")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
