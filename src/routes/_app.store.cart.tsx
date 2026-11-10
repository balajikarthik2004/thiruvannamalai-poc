import { createFileRoute, Link } from "@tanstack/react-router";
import { useCart } from "@/features/store/context/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { formatINR } from "@/lib/currency";
import { ProductImage } from "@/features/store/components/ProductImage";
import { Separator } from "@/components/ui/separator";
import { Trash2, ArrowLeft, CreditCard, CheckCircle2, ShieldCheck, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/_app/store/cart")({
  component: CartPage,
});

function CartPage() {
  const { t } = useTranslation();
  const { cart, updateQuantity, removeFromCart, totalPrice, clearCart } = useCart();
  const [deliveryMethod, setDeliveryMethod] = useState("pickup");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Payment State
  const [name, setName] = useState("");
  const [card, setCard] = useState("");
  const [exp, setExp] = useState("");
  const [cvv, setCvv] = useState("");
  const [address, setAddress] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const tax = Math.round(totalPrice * 0.05); // 5% GST on devotional articles
  const shipping = deliveryMethod === "pickup" ? 0 : 149;
  const finalTotal = totalPrice + tax + shipping;

  const handleCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value.replace(/\D/g, "").substring(0, 16);
    setCard(v.replace(/(\d{4})(?=\d)/g, "$1 "));
    if (errors.card) setErrors((p) => ({ ...p, card: "" }));
  };

  const handleExpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value.replace(/\D/g, "").substring(0, 4);
    if (v.length >= 3) {
      setExp(`${v.substring(0, 2)}/${v.substring(2)}`);
    } else {
      setExp(v);
    }
    if (errors.exp) setErrors((p) => ({ ...p, exp: "" }));
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCvv(e.target.value.replace(/\D/g, "").substring(0, 4));
    if (errors.cvv) setErrors((p) => ({ ...p, cvv: "" }));
  };

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();

    if (deliveryMethod === "shipping" && !address.trim()) {
      setErrors((p) => ({ ...p, address: t("Address is required for shipping") }));
      return;
    }

    setIsProcessing(true);
    
    // Simulate GPay style 1-1.5s real payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      clearCart();
      toast.success(t("Order Confirmed"), {
        description: deliveryMethod === "shipping" ? t("Your order successfully placed.") : t("Your receipt has been sent to your email.")
      });
    }, 1500);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-[#FAF6F0] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-32 h-32 bg-[#0B2F25]/10 text-[#0B2F25] rounded-full flex items-center justify-center mb-8 animate-in zoom-in duration-500 shadow-xl shadow-[#0B2F25]/20">
          <CheckCircle2 className="w-16 h-16 animate-in slide-in-from-bottom-4 duration-700" />
        </div>
        <h1 className="text-4xl font-serif font-bold mb-4 text-[#0B2F25]">{t("Order Confirmed")}</h1>
        <p className="text-lg text-muted-foreground max-w-md mb-10">
          {t("Thank you, ")}{name || 'Devotee'}{t("! Your payment was successful.")} 
          {deliveryMethod === "pickup" ? t(" Please show your confirmation at the temple store counter.") : t(" It will be shipped to your address shortly.")}
        </p>
        <Link to="/store">
          <Button size="lg" className="px-10 h-14 text-lg bg-[#0B2F25] hover:bg-[#073C2C] text-white shadow-lg">
            {t("Continue Shopping")}
          </Button>
        </Link>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#FAF6F0] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-24 h-24 bg-muted text-muted-foreground rounded-full flex items-center justify-center mb-6">
          <ShoppingCartIcon className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-semibold mb-2">{t("Your cart is empty")}</h2>
        <p className="text-muted-foreground mb-8">{t("Looks like you haven't added anything yet.")}</p>
        <Link to="/store">
          <Button size="lg" className="bg-[#0B2F25] hover:bg-[#073C2C] text-white">{t("Browse Stores")}</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF6F0] pb-10 relative">
      
      <div className="bg-primary/5 py-8 px-6 lg:px-12 border-b border-border/50">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <Link to="/store" className="p-2 hover:bg-white/50 rounded-full transition-colors text-foreground">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="font-serif text-2xl lg:text-3xl font-bold text-slate-900">{t("Secure Checkout")}</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-8 grid lg:grid-cols-12 gap-12">
        
        {/* Cart Items */}
        <div className="lg:col-span-7 space-y-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">{t("Cart Items")}</h2>
          <div className="space-y-4">
            {cart.map((item) => (
              <div key={item.id} className="flex gap-4 p-4 bg-white rounded-3xl border border-rose-100 shadow-sm transition-all hover:shadow-md">
                <div className="w-24 h-24 bg-muted rounded-lg overflow-hidden shrink-0">
                  <ProductImage product={item} className="w-full h-full" />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-semibold text-foreground line-clamp-1">{t(item.name)}</h3>
                    <p className="text-sm text-muted-foreground">{t(item.category)}</p>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <div className="font-bold text-primary text-lg">{formatINR(item.price)}</div>
                    <div className="flex items-center gap-3 bg-muted/50 rounded-lg p-1">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center rounded-md bg-background shadow-sm hover:bg-muted text-foreground transition-colors font-medium"
                      >
                        -
                      </button>
                      <span className="font-semibold text-sm w-4 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center rounded-md bg-background shadow-sm hover:bg-muted text-foreground transition-colors font-medium"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => removeFromCart(item.id)}
                  className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors h-fit"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Checkout Form & Summary */}
        <div className="lg:col-span-5">
          <form onSubmit={handleCheckout} className="bg-white rounded-3xl p-6 lg:p-8 border border-rose-100 shadow-sm sticky top-24 relative overflow-hidden">
            
            {/* Localized GPay Style Processing Overlay */}
            {isProcessing && (
              <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-card/95 backdrop-blur-md animate-in fade-in duration-300 border border-blue-100/50 rounded-2xl">
                <div className="w-24 h-24 bg-blue-50/50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-6 relative shadow-sm">
                  <div className="absolute inset-0 rounded-full border-[4px] border-blue-100 dark:border-blue-900/50" />
                  <div className="absolute inset-0 rounded-full border-[4px] border-blue-600 border-t-transparent animate-spin duration-1000" />
                  <ShieldCheck className="w-10 h-10 text-blue-600 animate-pulse" />
                </div>
                <h2 className="text-2xl font-semibold text-foreground tracking-tight mb-2">{t("Processing Payment")}</h2>
                <p className="text-muted-foreground text-sm text-center px-6">{t("Securely confirming with your bank...")}</p>
              </div>
            )}

            <h2 className="text-xl font-semibold text-foreground mb-6">{t("Order Summary")}</h2>
            
            <div className="space-y-3 text-sm mb-6 bg-muted/30 p-4 rounded-xl">
              <div className="flex justify-between text-muted-foreground">
                <span>{t("Subtotal")}</span>
                <span className="font-medium text-foreground">{formatINR(totalPrice)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>{t("GST (5%)")}</span>
                <span className="font-medium text-foreground">{formatINR(tax)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>{t("Shipping / Pickup")}</span>
                <span className="font-medium text-foreground">{shipping === 0 ? t("Free") : formatINR(shipping)}</span>
              </div>
              <Separator className="my-3 bg-border/80" />
              <div className="flex justify-between text-xl font-bold text-foreground">
                <span>{t("Total")}</span>
                <span className="text-primary">{formatINR(finalTotal)}</span>
              </div>
            </div>

            <div className="space-y-8">
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">{t("Delivery Method")}</h3>
                <RadioGroup value={deliveryMethod} onValueChange={setDeliveryMethod} className="grid grid-cols-2 gap-3">
                  <div className={`flex items-center space-x-2 border-2 p-3 rounded-xl cursor-pointer transition-all ${deliveryMethod === "pickup" ? "border-primary bg-primary/5 shadow-sm" : "border-border/50 hover:border-border"}`}>
                    <RadioGroupItem value="pickup" id="pickup" className="sr-only" />
                    <Label htmlFor="pickup" className="flex-1 cursor-pointer font-medium text-center text-sm">{t("Pickup")}<br/><span className="text-xs text-muted-foreground font-normal">{t("Free")}</span></Label>
                  </div>
                  <div className={`flex items-center space-x-2 border-2 p-3 rounded-xl cursor-pointer transition-all ${deliveryMethod === "shipping" ? "border-primary bg-primary/5 shadow-sm" : "border-border/50 hover:border-border"}`}>
                    <RadioGroupItem value="shipping" id="shipping" className="sr-only" />
                    <Label htmlFor="shipping" className="flex-1 cursor-pointer font-medium text-center text-sm">{t("Shipping")}<br/><span className="text-xs text-muted-foreground font-normal">₹149</span></Label>
                  </div>
                </RadioGroup>
                
                {deliveryMethod === "shipping" && (
                  <div className="grid gap-1.5 relative mt-4 animate-in fade-in slide-in-from-top-2">
                    <Label htmlFor="address" className="text-xs text-muted-foreground ml-1">{t("Shipping Address")}</Label>
                    <textarea 
                      id="address" 
                      placeholder={t("Enter your full delivery address")} 
                      value={address}
                      onChange={(e) => {
                        setAddress(e.target.value);
                        if (errors.address) setErrors((p) => ({ ...p, address: "" }));
                      }}
                      required={deliveryMethod === "shipping"}
                      className={`min-h-[80px] p-3 text-sm rounded-md border bg-background shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary ${errors.address ? 'border-red-500 focus-visible:ring-red-500' : 'border-input'}`}
                    />
                    {errors.address && <p className="text-xs text-red-500 ml-1">{errors.address}</p>}
                  </div>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">{t("Payment Details")}</h3>
                  <div className="flex items-center gap-1 text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-md">
                    <ShieldCheck className="w-3.5 h-3.5" /> {t("Secure")}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="grid gap-1.5 relative">
                    <Label htmlFor="name" className="text-xs text-muted-foreground ml-1">{t("Cardholder Name")}</Label>
                    <Input 
                      id="name" 
                      placeholder={t("e.g. Balaji Krishnan")} 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required 
                      className="h-12 bg-background shadow-sm transition-colors focus-visible:ring-primary"
                    />
                  </div>
                  
                  <div className="grid gap-1.5 relative">
                    <Label htmlFor="card" className="text-xs text-muted-foreground ml-1">{t("Card Number")}</Label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input 
                        id="card" 
                        placeholder="0000 0000 0000 0000" 
                        value={card}
                        onChange={handleCardChange}
                        maxLength={19} 
                        required 
                        className={`h-12 pl-10 bg-background shadow-sm transition-colors focus-visible:ring-primary ${errors.card ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                      />
                    </div>
                    {errors.card && <p className="text-xs text-red-500 ml-1">{errors.card}</p>}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-1.5">
                      <Label htmlFor="exp" className="text-xs text-muted-foreground ml-1">{t("Expiry Date")}</Label>
                      <Input 
                        id="exp" 
                        placeholder={t("MM/YY")} 
                        value={exp}
                        onChange={handleExpChange}
                        maxLength={5} 
                        required 
                        className={`h-12 text-center bg-background shadow-sm transition-colors focus-visible:ring-primary ${errors.exp ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                      />
                      {errors.exp && <p className="text-xs text-red-500 ml-1">{errors.exp}</p>}
                    </div>
                    <div className="grid gap-1.5">
                      <Label htmlFor="cvv" className="text-xs text-muted-foreground ml-1">{t("CVV")}</Label>
                      <Input 
                        id="cvv" 
                        placeholder="123" 
                        type="password"
                        value={cvv}
                        onChange={handleCvvChange}
                        maxLength={4} 
                        required 
                        className={`h-12 text-center tracking-widest bg-background shadow-sm transition-colors focus-visible:ring-primary ${errors.cvv ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                      />
                      {errors.cvv && <p className="text-xs text-red-500 ml-1">{errors.cvv}</p>}
                    </div>
                  </div>
                </div>
              </div>

              <Button 
                type="submit" 
                size="lg" 
                className="w-full h-14 rounded-full text-lg font-bold bg-[#0B2F25] hover:bg-[#073C2C] text-white shadow-md shadow-[#0B2F25]/20 transition-all active:scale-[0.98]"
              >
                {t("Pay ")}{formatINR(finalTotal)}
              </Button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}

// Just a tiny helper component for the empty state
function ShoppingCartIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="8" cy="21" r="1" />
      <circle cx="19" cy="21" r="1" />
      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
    </svg>
  );
}
