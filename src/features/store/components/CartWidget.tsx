import { Link } from "@tanstack/react-router";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/features/store/context/CartContext";
import { useEffect, useState } from "react";

export function CartWidget() {
  const { totalItems } = useCart();
  const [bump, setBump] = useState(false);

  useEffect(() => {
    if (totalItems > 0) {
      setBump(true);
      const timer = setTimeout(() => setBump(false), 300);
      return () => clearTimeout(timer);
    }
  }, [totalItems]);

  if (totalItems === 0) return null;

  return (
    <Link 
      to="/store/cart"
      className={`fixed bottom-20 right-6 lg:bottom-10 lg:right-10 z-50 flex items-center justify-center w-14 h-14 bg-[#e32c26] text-white rounded-full shadow-[0_8px_30px_rgb(227,44,38,0.4)] hover:bg-[#c9221d] hover:scale-105 transition-all duration-300 ring-4 ring-white ${bump ? 'animate-bounce' : ''}`}
    >
      <div className="relative">
        <ShoppingBag className="w-6 h-6" />
        <div className="absolute -top-2 -right-2 bg-white text-[#e32c26] text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-sm ring-2 ring-[#e32c26]">
          {totalItems}
        </div>
      </div>
    </Link>
  );
}
