import { useEffect, useMemo, useRef, useState } from "react";
import QRCode from "react-qr-code";
import {
  X,
  Lock,
  CreditCard,
  Building2,
  Wallet,
  CalendarClock,
  QrCode,
  ChevronRight,
  Loader2,
  CheckCircle2,
  ShieldCheck,
  Smartphone,
  ArrowLeft,
} from "lucide-react";
import { useTranslation } from "react-i18next";

type Method = "upi" | "card" | "netbanking" | "wallet" | "emi";
type Stage = "method" | "otp" | "processing" | "success";

const RZP_BLUE = "#3395FF";
const RZP_NAVY = "#02042B";

const BANKS = [
  { id: "hdfc", name: "HDFC Bank", short: "HDFC", color: "#004C8F" },
  { id: "icici", name: "ICICI Bank", short: "ICICI", color: "#AE275F" },
  { id: "sbi", name: "State Bank of India", short: "SBI", color: "#22409A" },
  { id: "axis", name: "Axis Bank", short: "AXIS", color: "#97144D" },
  { id: "kotak", name: "Kotak Mahindra Bank", short: "KOTAK", color: "#ED1C24" },
  { id: "iob", name: "Indian Overseas Bank", short: "IOB", color: "#0B4DA2" },
];

const ALL_BANKS = [
  "Bank of Baroda",
  "Canara Bank",
  "Federal Bank",
  "IDBI Bank",
  "IndusInd Bank",
  "Indian Bank",
  "Karur Vysya Bank",
  "Punjab National Bank",
  "RBL Bank",
  "South Indian Bank",
  "Tamilnad Mercantile Bank",
  "Union Bank of India",
  "Yes Bank",
];

const WALLETS = [
  { id: "paytm", name: "Paytm", color: "#00BAF2" },
  { id: "phonepe", name: "PhonePe", color: "#5F259F" },
  { id: "amazonpay", name: "Amazon Pay", color: "#FF9900" },
  { id: "mobikwik", name: "Mobikwik", color: "#2D3E50" },
  { id: "freecharge", name: "Freecharge", color: "#F05A28" },
];

const UPI_APPS = [
  { id: "gpay", name: "Google Pay", color: "#34A853" },
  { id: "phonepe", name: "PhonePe", color: "#5F259F" },
  { id: "paytm", name: "Paytm", color: "#00BAF2" },
  { id: "bhim", name: "BHIM", color: "#F26722" },
];

const UPI_HANDLES = ["@okhdfcbank", "@okicici", "@oksbi", "@okaxis", "@ybl", "@paytm", "@ibl"];

function luhn(digits: string) {
  let sum = 0;
  let alt = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let n = Number(digits[i]);
    if (alt) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    alt = !alt;
  }
  return sum % 10 === 0;
}

function cardBrand(digits: string) {
  if (/^4/.test(digits)) return { name: "VISA", color: "#1A1F71" };
  if (/^(5[1-5]|2[2-7])/.test(digits)) return { name: "Mastercard", color: "#EB001B" };
  if (/^(60|65|81|82|508)/.test(digits)) return { name: "RuPay", color: "#097B3B" };
  if (/^3[47]/.test(digits)) return { name: "AMEX", color: "#006FCF" };
  return null;
}

function randomId(prefix: string, len: number) {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let out = "";
  for (let i = 0; i < len; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return `${prefix}${out}`;
}

export interface PaymentResult {
  paymentId: string;
  orderId: string;
  method: string;
  instrument: string;
  emiTenure?: number;
}

export function RazorpayCheckout({
  open,
  amount,
  currency,
  merchant,
  description,
  contactEmail,
  contactPhone,
  allowEmi,
  onClose,
  onSuccess,
}: {
  open: boolean;
  amount: number;
  currency: string;
  merchant: string;
  description: string;
  contactEmail: string;
  contactPhone: string;
  allowEmi: boolean;
  onClose: () => void;
  onSuccess: (result: PaymentResult) => void;
}) {
  const { t } = useTranslation();
  const [method, setMethod] = useState<Method>("upi");
  const [stage, setStage] = useState<Stage>("method");
  const [secondsLeft, setSecondsLeft] = useState(420);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const pending = useRef<PaymentResult | null>(null);

  const symbol = currency === "USD" ? "$" : "₹";
  const money = `${symbol}${amount.toLocaleString(currency === "USD" ? "en-US" : "en-IN")}`;
  const orderId = useMemo(() => (open ? randomId("order_", 14) : ""), [open]);

  // Reset whenever the sheet is re-opened.
  useEffect(() => {
    if (open) {
      setMethod("upi");
      setStage("method");
      setSecondsLeft(420);
      setOtp("");
      setOtpError("");
      pending.current = null;
    }
  }, [open]);

  // Session countdown, exactly like the real checkout.
  useEffect(() => {
    if (!open || stage === "success" || stage === "processing") return;
    const id = setInterval(() => setSecondsLeft((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, [open, stage]);

  // Lock background scroll while the gateway is open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  const startPayment = (result: PaymentResult, needsOtp: boolean) => {
    pending.current = result;
    if (needsOtp) {
      setStage("processing");
      setTimeout(() => {
        setOtp("");
        setOtpError("");
        setStage("otp");
      }, 1400);
    } else {
      setStage("processing");
      setTimeout(() => finish(), 2200);
    }
  };

  const finish = () => {
    setStage("success");
    setTimeout(() => {
      if (pending.current) onSuccess(pending.current);
    }, 1500);
  };

  const submitOtp = () => {
    if (otp.length !== 6) {
      setOtpError(t("Please enter the 6-digit OTP"));
      return;
    }
    setStage("processing");
    setTimeout(() => finish(), 1800);
  };

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");

  const methods: { id: Method; label: string; sub: string; icon: any; badge?: string }[] = [
    { id: "upi", label: "UPI", sub: "GPay, PhonePe, Paytm", icon: QrCode, badge: "Recommended" },
    { id: "card", label: "Cards", sub: "Visa, Mastercard, RuPay", icon: CreditCard },
    { id: "netbanking", label: "Netbanking", sub: "All Indian banks", icon: Building2 },
    { id: "wallet", label: "Wallets", sub: "Paytm, PhonePe, Amazon", icon: Wallet },
    ...(allowEmi
      ? [{ id: "emi" as Method, label: "EMI", sub: "3, 6 or 12 months", icon: CalendarClock }]
      : []),
  ];

  const showRail = stage === "method";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full sm:max-w-[860px] h-full sm:h-auto sm:max-h-[92vh] sm:rounded-2xl overflow-hidden shadow-2xl flex flex-col animate-in zoom-in-95 duration-200">
        {/* ── Gateway header ── */}
        <div
          className="shrink-0 px-4 sm:px-5 py-3.5 flex items-center gap-3 text-white"
          style={{ background: RZP_NAVY }}
        >
          <div className="w-9 h-9 rounded-lg bg-white/10 backdrop-blur grid place-items-center shrink-0 ring-1 ring-white/15">
            <span className="font-serif font-bold text-sm">ॐ</span>
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-bold text-sm leading-tight truncate">{merchant}</div>
            <div className="text-[11px] text-white/55 truncate">{description}</div>
          </div>
          <div className="text-right shrink-0 hidden sm:block">
            <div className="text-[9px] font-bold uppercase tracking-widest text-white/45">
              {t("Amount")}
            </div>
            <div className="font-bold text-base leading-tight">{money}</div>
          </div>
          <button
            onClick={onClose}
            disabled={stage === "processing" || stage === "success"}
            className="shrink-0 w-8 h-8 rounded-full grid place-items-center hover:bg-white/10 transition-colors disabled:opacity-30 disabled:pointer-events-none"
            aria-label={t("Close")}
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* Contact strip */}
        <div className="shrink-0 px-4 sm:px-5 py-2 bg-[#F5F7FA] border-b border-gray-200 flex items-center justify-between gap-3 text-[11px]">
          <div className="text-gray-600 font-medium truncate">
            {contactPhone} <span className="text-gray-300 mx-1">|</span> {contactEmail}
          </div>
          <div className="shrink-0 flex items-center gap-1 font-semibold text-gray-500 tabular-nums">
            <span className="sm:hidden font-bold text-gray-800">{money}</span>
            <span className="sm:hidden text-gray-300 mx-0.5">|</span>
            {mm}:{ss}
          </div>
        </div>

        {/* ── Body ── */}
        <div className="flex-1 min-h-0 flex overflow-hidden">
          {showRail && (
            <div className="w-[92px] sm:w-[204px] shrink-0 bg-[#F5F7FA] border-r border-gray-200 overflow-y-auto py-2">
              <div className="hidden sm:block px-4 pt-2 pb-1.5 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                {t("Payment Methods")}
              </div>
              {methods.map((m) => {
                const Icon = m.icon;
                const on = method === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => setMethod(m.id)}
                    className={`w-full flex sm:flex-row flex-col items-center gap-1 sm:gap-3 px-2 sm:px-4 py-3 text-left transition-colors relative ${
                      on ? "bg-white" : "hover:bg-white/60"
                    }`}
                  >
                    {on && (
                      <span
                        className="absolute left-0 inset-y-0 w-[3px]"
                        style={{ background: RZP_BLUE }}
                      />
                    )}
                    <Icon
                      className="w-5 h-5 shrink-0"
                      style={{ color: on ? RZP_BLUE : "#6B7280" }}
                    />
                    <div className="min-w-0 text-center sm:text-left">
                      <div
                        className={`text-[11px] sm:text-[13px] font-bold ${on ? "text-gray-900" : "text-gray-600"}`}
                      >
                        {t(m.label)}
                      </div>
                      <div className="hidden sm:block text-[10px] text-gray-400 truncate">
                        {t(m.sub)}
                      </div>
                    </div>
                    {m.badge && (
                      <span
                        className="hidden sm:block absolute right-3 top-2 text-[8px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded"
                        style={{ background: `${RZP_BLUE}1A`, color: RZP_BLUE }}
                      >
                        {t(m.badge)}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          <div className="flex-1 min-w-0 overflow-y-auto">
            {stage === "method" && method === "upi" && (
              <UpiPanel
                money={money}
                amount={amount}
                currency={currency}
                merchant={merchant}
                onPay={(inst) =>
                  startPayment(
                    { paymentId: randomId("pay_", 14), orderId, method: "UPI", instrument: inst },
                    false,
                  )
                }
              />
            )}
            {stage === "method" && method === "card" && (
              <CardPanel
                money={money}
                onPay={(inst) =>
                  startPayment(
                    { paymentId: randomId("pay_", 14), orderId, method: "Card", instrument: inst },
                    true,
                  )
                }
              />
            )}
            {stage === "method" && method === "netbanking" && (
              <NetbankingPanel
                money={money}
                onPay={(inst) =>
                  startPayment(
                    {
                      paymentId: randomId("pay_", 14),
                      orderId,
                      method: "Netbanking",
                      instrument: inst,
                    },
                    true,
                  )
                }
              />
            )}
            {stage === "method" && method === "wallet" && (
              <WalletPanel
                money={money}
                onPay={(inst) =>
                  startPayment(
                    {
                      paymentId: randomId("pay_", 14),
                      orderId,
                      method: "Wallet",
                      instrument: inst,
                    },
                    false,
                  )
                }
              />
            )}
            {stage === "method" && method === "emi" && (
              <EmiPanel
                amount={amount}
                symbol={symbol}
                currency={currency}
                onPay={(inst, tenure) =>
                  startPayment(
                    {
                      paymentId: randomId("pay_", 14),
                      orderId,
                      method: "EMI",
                      instrument: inst,
                      emiTenure: tenure,
                    },
                    true,
                  )
                }
              />
            )}

            {stage === "otp" && (
              <OtpPanel
                money={money}
                instrument={pending.current?.instrument ?? ""}
                phone={contactPhone}
                otp={otp}
                setOtp={(v) => {
                  setOtp(v);
                  setOtpError("");
                }}
                error={otpError}
                onSubmit={submitOtp}
                onBack={() => setStage("method")}
              />
            )}

            {stage === "processing" && (
              <div className="h-full min-h-[340px] grid place-items-center p-8 text-center">
                <div>
                  <div
                    className="w-16 h-16 rounded-full grid place-items-center mx-auto mb-5"
                    style={{ background: `${RZP_BLUE}14` }}
                  >
                    <Loader2 className="w-8 h-8 animate-spin" style={{ color: RZP_BLUE }} />
                  </div>
                  <h3 className="text-base font-bold text-gray-900 mb-1.5">
                    {t("Processing your payment")}
                  </h3>
                  <p className="text-xs text-gray-500 max-w-[240px] mx-auto leading-relaxed">
                    {t("Do not press back or refresh this page. This may take a few seconds.")}
                  </p>
                </div>
              </div>
            )}

            {stage === "success" && (
              <div className="h-full min-h-[340px] grid place-items-center p-8 text-center">
                <div>
                  <div className="w-20 h-20 rounded-full bg-emerald-50 grid place-items-center mx-auto mb-5">
                    <CheckCircle2 className="w-11 h-11 text-emerald-500" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1.5">
                    {t("Payment Successful")}
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    {money} {t("paid to")} {merchant}
                  </p>
                  <div className="inline-block bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 font-mono text-[11px] text-gray-600">
                    {pending.current?.paymentId}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Gateway footer ── */}
        <div className="shrink-0 border-t border-gray-200 bg-[#F5F7FA] px-4 py-2.5 flex items-center justify-center gap-1.5">
          <Lock className="w-3 h-3 text-gray-400" />
          <span className="text-[11px] text-gray-500 font-medium">{t("Secured by")}</span>
          <span className="text-[13px] font-extrabold tracking-tight" style={{ color: RZP_BLUE }}>
            Razorpay
          </span>
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────────── UPI ────────────────────────────── */

function UpiPanel({
  money,
  amount,
  currency,
  merchant,
  onPay,
}: {
  money: string;
  amount: number;
  currency: string;
  merchant: string;
  onPay: (instrument: string) => void;
}) {
  const { t } = useTranslation();
  const [vpa, setVpa] = useState("");
  const valid = /^[a-zA-Z0-9._-]{3,}@[a-zA-Z]{3,}$/.test(vpa.trim());

  const upiUri = `upi://pay?pa=omgsmarttemple@hdfcbank&pn=${encodeURIComponent(merchant)}&am=${amount}&cu=${currency}&tn=Temple%20Membership`;

  return (
    <div className="p-5 sm:p-6">
      <PanelTitle title="Pay using UPI" sub="Scan the QR with any UPI app, or enter your UPI ID" />

      <div className="flex flex-col sm:flex-row gap-6">
        <div className="shrink-0 mx-auto sm:mx-0">
          <div className="p-3 bg-white border-2 border-gray-200 rounded-xl">
            <QRCode value={upiUri} size={148} bgColor="#FFFFFF" fgColor="#02042B" />
          </div>
          <div className="flex items-center justify-center gap-1.5 mt-2.5">
            {UPI_APPS.map((app) => (
              <span
                key={app.id}
                title={app.name}
                className="w-6 h-6 rounded-full grid place-items-center text-[9px] font-extrabold text-white"
                style={{ background: app.color }}
              >
                {app.name[0]}
              </span>
            ))}
          </div>
          <p className="text-[10px] text-center text-gray-400 font-medium mt-1.5">
            {t("Scan to pay")} {money}
          </p>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-4">
            <span className="h-px flex-1 bg-gray-200" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
              {t("or")}
            </span>
            <span className="h-px flex-1 bg-gray-200" />
          </div>

          <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-1.5">
            {t("Enter UPI ID")}
          </label>
          <input
            value={vpa}
            onChange={(e) => setVpa(e.target.value)}
            placeholder="devotee@okhdfcbank"
            className="w-full border-2 border-gray-200 rounded-xl px-3.5 py-3 text-sm font-semibold outline-none focus:border-[#3395FF] focus:ring-4 focus:ring-[#3395FF]/10 transition-all placeholder:font-normal placeholder:text-gray-400"
          />
          <div className="flex flex-wrap gap-1.5 mt-2">
            {UPI_HANDLES.map((h) => (
              <button
                key={h}
                onClick={() => setVpa((v) => `${v.split("@")[0]}${h}`)}
                className="text-[10px] font-semibold text-gray-500 bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded-md transition-colors"
              >
                {h}
              </button>
            ))}
          </div>

          <PayButton
            disabled={!valid}
            onClick={() => onPay(vpa.trim())}
            label={`${t("Verify and Pay")} ${money}`}
          />

          <div className="flex items-start gap-2 mt-4 text-[11px] text-gray-500 leading-relaxed">
            <Smartphone className="w-4 h-4 shrink-0 text-gray-400 mt-px" />
            <span>
              {t(
                "You will get a collect request on your UPI app. Approve it within 5 minutes to complete the payment.",
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────────── Card ────────────────────────────── */

function CardPanel({ money, onPay }: { money: string; onPay: (instrument: string) => void }) {
  const { t } = useTranslation();
  const [number, setNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [name, setName] = useState("");
  const [touched, setTouched] = useState(false);

  const digits = number.replace(/\D/g, "");
  const brand = cardBrand(digits);
  const numberOk = digits.length >= 15 && digits.length <= 16 && luhn(digits);
  const [mm, yy] = expiry.split("/");
  const now = new Date();
  const expiryOk =
    /^\d{2}\/\d{2}$/.test(expiry) &&
    Number(mm) >= 1 &&
    Number(mm) <= 12 &&
    (2000 + Number(yy) > now.getFullYear() ||
      (2000 + Number(yy) === now.getFullYear() && Number(mm) >= now.getMonth() + 1));
  const cvvOk = cvv.length >= 3;
  const nameOk = name.trim().length >= 3;
  const valid = numberOk && expiryOk && cvvOk && nameOk;

  const onNumber = (v: string) => {
    const d = v.replace(/\D/g, "").slice(0, 16);
    setNumber(d.replace(/(.{4})/g, "$1 ").trim());
  };

  const onExpiry = (v: string) => {
    const d = v.replace(/\D/g, "").slice(0, 4);
    setExpiry(d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d);
  };

  return (
    <div className="p-5 sm:p-6">
      <PanelTitle title="Card Details" sub="We accept Visa, Mastercard, RuPay, Maestro and Amex" />

      <div className="space-y-4 max-w-md">
        <div>
          <RzpLabel>{t("Card Number")}</RzpLabel>
          <div className="relative">
            <input
              value={number}
              onChange={(e) => onNumber(e.target.value)}
              onBlur={() => setTouched(true)}
              inputMode="numeric"
              placeholder="1234 5678 9012 3456"
              className={`w-full border-2 rounded-xl pl-3.5 pr-24 py-3 text-sm font-semibold tracking-wider outline-none transition-all placeholder:font-normal placeholder:tracking-normal placeholder:text-gray-400 ${
                touched && digits.length > 0 && !numberOk
                  ? "border-red-400 focus:ring-4 focus:ring-red-500/10"
                  : "border-gray-200 focus:border-[#3395FF] focus:ring-4 focus:ring-[#3395FF]/10"
              }`}
            />
            {brand && (
              <span
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-extrabold px-2 py-1 rounded"
                style={{ color: brand.color, background: `${brand.color}12` }}
              >
                {brand.name}
              </span>
            )}
          </div>
          {touched && digits.length > 0 && !numberOk && (
            <p className="mt-1.5 text-[11px] font-semibold text-red-600">
              {t("Please enter a valid card number")}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <RzpLabel>{t("Expiry (MM/YY)")}</RzpLabel>
            <input
              value={expiry}
              onChange={(e) => onExpiry(e.target.value)}
              onBlur={() => setTouched(true)}
              inputMode="numeric"
              placeholder="09/29"
              className={`w-full border-2 rounded-xl px-3.5 py-3 text-sm font-semibold outline-none transition-all placeholder:font-normal placeholder:text-gray-400 ${
                touched && expiry.length === 5 && !expiryOk
                  ? "border-red-400 focus:ring-4 focus:ring-red-500/10"
                  : "border-gray-200 focus:border-[#3395FF] focus:ring-4 focus:ring-[#3395FF]/10"
              }`}
            />
            {touched && expiry.length === 5 && !expiryOk && (
              <p className="mt-1.5 text-[11px] font-semibold text-red-600">
                {t("Card has expired")}
              </p>
            )}
          </div>
          <div>
            <RzpLabel>{t("CVV")}</RzpLabel>
            <input
              value={cvv}
              onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
              type="password"
              inputMode="numeric"
              placeholder="•••"
              className="w-full border-2 border-gray-200 rounded-xl px-3.5 py-3 text-sm font-semibold outline-none focus:border-[#3395FF] focus:ring-4 focus:ring-[#3395FF]/10 transition-all placeholder:text-gray-400"
            />
          </div>
        </div>

        <div>
          <RzpLabel>{t("Name on Card")}</RzpLabel>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t("Ramesh Subramanian")}
            className="w-full border-2 border-gray-200 rounded-xl px-3.5 py-3 text-sm font-semibold outline-none focus:border-[#3395FF] focus:ring-4 focus:ring-[#3395FF]/10 transition-all placeholder:font-normal placeholder:text-gray-400"
          />
        </div>

        <label className="flex items-center gap-2.5 cursor-pointer select-none">
          <input type="checkbox" defaultChecked className="w-4 h-4 rounded accent-[#3395FF]" />
          <span className="text-xs font-medium text-gray-600">
            {t("Save this card securely as per RBI tokenisation guidelines")}
          </span>
        </label>

        <PayButton
          disabled={!valid}
          onClick={() => onPay(`${brand?.name ?? "Card"} •••• ${digits.slice(-4)}`)}
          label={`${t("Pay")} ${money}`}
        />

        <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          {t("PCI DSS Level 1 compliant · 3D Secure authentication")}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────── Netbanking ─────────────────────────── */

function NetbankingPanel({ money, onPay }: { money: string; onPay: (instrument: string) => void }) {
  const { t } = useTranslation();
  const [bank, setBank] = useState("");

  return (
    <div className="p-5 sm:p-6">
      <PanelTitle title="Netbanking" sub="Choose your bank to continue to its secure login page" />

      <div className="max-w-md">
        <div className="text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-2.5">
          {t("Popular Banks")}
        </div>
        <div className="grid grid-cols-3 gap-2.5 mb-5">
          {BANKS.map((b) => (
            <button
              key={b.id}
              onClick={() => setBank(b.name)}
              className={`flex flex-col items-center gap-2 p-3 border-2 rounded-xl transition-all ${
                bank === b.name
                  ? "border-[#3395FF] bg-[#3395FF]/5 shadow-sm"
                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              <span
                className="w-9 h-9 rounded-full grid place-items-center text-[9px] font-extrabold text-white"
                style={{ background: b.color }}
              >
                {b.short.slice(0, 4)}
              </span>
              <span className="text-[10px] font-bold text-gray-700 leading-tight text-center line-clamp-2">
                {b.name}
              </span>
            </button>
          ))}
        </div>

        <RzpLabel>{t("All other banks")}</RzpLabel>
        <select
          value={BANKS.some((b) => b.name === bank) ? "" : bank}
          onChange={(e) => setBank(e.target.value)}
          className="w-full border-2 border-gray-200 rounded-xl px-3.5 py-3 text-sm font-semibold outline-none focus:border-[#3395FF] focus:ring-4 focus:ring-[#3395FF]/10 transition-all cursor-pointer"
        >
          <option value="">{t("Select a bank")}</option>
          {ALL_BANKS.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>

        <PayButton disabled={!bank} onClick={() => onPay(bank)} label={`${t("Pay")} ${money}`} />

        <p className="text-[11px] text-gray-500 mt-3 leading-relaxed">
          {t("You will be redirected to your bank's secure page to authorise this payment.")}
        </p>
      </div>
    </div>
  );
}

/* ───────────────────────────── Wallet ───────────────────────────── */

function WalletPanel({ money, onPay }: { money: string; onPay: (instrument: string) => void }) {
  const { t } = useTranslation();
  const [wallet, setWallet] = useState("");

  return (
    <div className="p-5 sm:p-6">
      <PanelTitle title="Wallets" sub="Pay from your prepaid wallet balance" />

      <div className="space-y-2.5 max-w-md">
        {WALLETS.map((w) => (
          <button
            key={w.id}
            onClick={() => setWallet(w.name)}
            className={`w-full flex items-center gap-3 p-3.5 border-2 rounded-xl transition-all ${
              wallet === w.name
                ? "border-[#3395FF] bg-[#3395FF]/5 shadow-sm"
                : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
            }`}
          >
            <span
              className="w-9 h-9 rounded-full grid place-items-center text-xs font-extrabold text-white shrink-0"
              style={{ background: w.color }}
            >
              {w.name[0]}
            </span>
            <span className="font-bold text-sm text-gray-800 flex-1 text-left">{w.name}</span>
            <ChevronRight
              className={`w-4 h-4 ${wallet === w.name ? "text-[#3395FF]" : "text-gray-300"}`}
            />
          </button>
        ))}

        <PayButton
          disabled={!wallet}
          onClick={() => onPay(wallet)}
          label={`${t("Pay")} ${money}`}
        />
      </div>
    </div>
  );
}

/* ────────────────────────────── EMI ────────────────────────────── */

function EmiPanel({
  amount,
  symbol,
  currency,
  onPay,
}: {
  amount: number;
  symbol: string;
  currency: string;
  onPay: (instrument: string, tenure: number) => void;
}) {
  const { t } = useTranslation();
  const [tenure, setTenure] = useState(0);
  const [bank, setBank] = useState(BANKS[0].name);

  // Typical Indian issuer EMI rates by tenure.
  const options = [
    { months: 3, rate: 13 },
    { months: 6, rate: 14 },
    { months: 12, rate: 15 },
  ];

  const emiFor = (months: number, annualRate: number) => {
    const r = annualRate / 12 / 100;
    return Math.round((amount * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1));
  };

  const fmt = (n: number) => `${symbol}${n.toLocaleString(currency === "USD" ? "en-US" : "en-IN")}`;

  return (
    <div className="p-5 sm:p-6">
      <PanelTitle
        title="EMI"
        sub="Split your offering into monthly instalments on your credit card"
      />

      <div className="max-w-md">
        <RzpLabel>{t("Issuing Bank")}</RzpLabel>
        <select
          value={bank}
          onChange={(e) => setBank(e.target.value)}
          className="w-full border-2 border-gray-200 rounded-xl px-3.5 py-3 text-sm font-semibold outline-none focus:border-[#3395FF] focus:ring-4 focus:ring-[#3395FF]/10 transition-all cursor-pointer mb-5"
        >
          {BANKS.map((b) => (
            <option key={b.id} value={b.name}>
              {b.name}
            </option>
          ))}
        </select>

        <div className="text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-2.5">
          {t("Select Tenure")}
        </div>
        <div className="space-y-2.5">
          {options.map((o) => {
            const emi = emiFor(o.months, o.rate);
            const total = emi * o.months;
            return (
              <button
                key={o.months}
                onClick={() => setTenure(o.months)}
                className={`w-full flex items-center justify-between gap-3 p-3.5 border-2 rounded-xl transition-all text-left ${
                  tenure === o.months
                    ? "border-[#3395FF] bg-[#3395FF]/5 shadow-sm"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                <div>
                  <div className="font-bold text-sm text-gray-800">
                    {fmt(emi)}{" "}
                    <span className="text-gray-400 font-medium">
                      × {o.months} {t("months")}
                    </span>
                  </div>
                  <div className="text-[11px] text-gray-500 mt-0.5">
                    {o.rate}% p.a. · {t("Total")} {fmt(total)} ({t("interest")}{" "}
                    {fmt(total - amount)})
                  </div>
                </div>
                <span
                  className={`w-4.5 h-4.5 rounded-full border-2 shrink-0 grid place-items-center ${tenure === o.months ? "border-[#3395FF]" : "border-gray-300"}`}
                >
                  {tenure === o.months && <span className="w-2 h-2 rounded-full bg-[#3395FF]" />}
                </span>
              </button>
            );
          })}
        </div>

        <PayButton
          disabled={!tenure}
          onClick={() => onPay(`${bank} · ${tenure} ${t("month EMI")}`, tenure)}
          label={
            tenure
              ? `${t("Pay")} ${fmt(emiFor(tenure, options.find((o) => o.months === tenure)!.rate))}/${t("mo")}`
              : t("Select a tenure")
          }
        />

        <p className="text-[11px] text-gray-500 mt-3 leading-relaxed">
          {t(
            "Interest is charged by your bank, not by the temple. The full amount is receipted under 80G today.",
          )}
        </p>
      </div>
    </div>
  );
}

/* ────────────────────────────── OTP ────────────────────────────── */

function OtpPanel({
  money,
  instrument,
  phone,
  otp,
  setOtp,
  error,
  onSubmit,
  onBack,
}: {
  money: string;
  instrument: string;
  phone: string;
  otp: string;
  setOtp: (v: string) => void;
  error: string;
  onSubmit: () => void;
  onBack: () => void;
}) {
  const { t } = useTranslation();
  const [resendIn, setResendIn] = useState(30);

  useEffect(() => {
    const id = setInterval(() => setResendIn((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, []);

  const masked = phone.replace(/\d(?=\d{4})/g, "•");

  return (
    <div className="p-5 sm:p-6 max-w-md">
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-gray-800 mb-5 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> {t("Change payment method")}
      </button>

      <div
        className="w-12 h-12 rounded-xl grid place-items-center mb-4"
        style={{ background: `${RZP_BLUE}14` }}
      >
        <ShieldCheck className="w-6 h-6" style={{ color: RZP_BLUE }} />
      </div>

      <h3 className="text-lg font-bold text-gray-900 mb-1">{t("Verify with OTP")}</h3>
      <p className="text-xs text-gray-500 leading-relaxed mb-5">
        {t("Your bank has sent a 6-digit code to")}{" "}
        <span className="font-bold text-gray-700">{masked}</span>. {t("Enter it to authorise")}{" "}
        <span className="font-bold text-gray-700">{money}</span> {t("on")} {instrument}.
      </p>

      <RzpLabel>{t("One Time Password")}</RzpLabel>
      <input
        value={otp}
        onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
        inputMode="numeric"
        autoFocus
        placeholder="••••••"
        className={`w-full border-2 rounded-xl px-4 py-3.5 text-xl font-bold tracking-[0.5em] text-center outline-none transition-all placeholder:tracking-[0.4em] placeholder:text-gray-300 ${
          error
            ? "border-red-400 focus:ring-4 focus:ring-red-500/10"
            : "border-gray-200 focus:border-[#3395FF] focus:ring-4 focus:ring-[#3395FF]/10"
        }`}
      />
      {error && <p className="mt-1.5 text-[11px] font-semibold text-red-600">{error}</p>}

      <div className="mt-3 text-[11px] text-gray-500">
        {resendIn > 0 ? (
          <>
            {t("Resend OTP in")} <span className="font-bold tabular-nums">{resendIn}s</span>
          </>
        ) : (
          <button
            onClick={() => setResendIn(30)}
            className="font-bold hover:underline"
            style={{ color: RZP_BLUE }}
          >
            {t("Resend OTP")}
          </button>
        )}
      </div>

      <PayButton
        disabled={otp.length !== 6}
        onClick={onSubmit}
        label={`${t("Verify and Pay")} ${money}`}
      />

      <p className="text-[10px] text-gray-400 mt-3 leading-relaxed">
        {t("This is a demo gateway — any 6 digits will be accepted. No real money is debited.")}
      </p>
    </div>
  );
}

/* ───────────────────────────── shared ───────────────────────────── */

function PanelTitle({ title, sub }: { title: string; sub: string }) {
  const { t } = useTranslation();
  return (
    <div className="mb-5">
      <h3 className="text-base font-bold text-gray-900">{t(title)}</h3>
      <p className="text-xs text-gray-500 mt-0.5">{t(sub)}</p>
    </div>
  );
}

function RzpLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-1.5">
      {children}
    </label>
  );
}

function PayButton({
  disabled,
  onClick,
  label,
}: {
  disabled: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-full mt-5 py-3.5 rounded-xl text-white text-sm font-bold shadow-md transition-all hover:brightness-110 disabled:opacity-40 disabled:pointer-events-none active:scale-[0.99]"
      style={{ background: RZP_BLUE }}
    >
      {label}
    </button>
  );
}
