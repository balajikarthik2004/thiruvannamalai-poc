import { useTranslation } from "react-i18next";
import { CheckCircle2, Download, Receipt } from "lucide-react";
import { CAUSES, PAYMENT_METHODS } from "../constants";

export function DonationReceipt({ templeObj, cause, paymentMethod, frequency, pledgeDate, getActiveAmount, onReset }: any) {
  const { t: tStr } = useTranslation();

  return (
    <div className="fade-in p-5 md:p-6 text-center bg-card rounded-2xl shadow-sm border border-border/50">
      <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner ring-4 ring-emerald-50/50 dark:ring-emerald-900/10">
        <CheckCircle2 className="w-8 h-8" />
      </div>
      <h2 className="font-serif text-2xl font-bold mb-1 text-foreground tracking-tight">{frequency === 'pledge' ? tStr("Pledge Confirmed") : tStr("Payment Successful")}</h2>
      <div className="text-emerald-600 dark:text-emerald-500 font-semibold mb-6 text-sm">{tStr("May the Divine bless you! 🙏")}</div>
      
      <div className="bg-background rounded-2xl p-5 mb-6 text-left border-2 border-border/60 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500" />
        
        <div className="flex justify-between items-center border-b-2 border-dashed border-border/60 pb-3 mb-3">
          <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
            <Receipt className="w-3.5 h-3.5" /> {tStr("E-Receipt")}
          </div>
          <div className="text-[10px] font-bold bg-secondary px-2 py-1 rounded text-white uppercase tracking-wider">
            {new Date().toLocaleDateString('en-IN')}
          </div>
        </div>
        
        <div className="space-y-3 text-[13px]">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground font-semibold">{frequency === 'pledge' ? tStr("Pledged Amount") : tStr("Amount")}</span> 
            <span className="font-black text-xl text-emerald-600 flex items-baseline gap-1">
              ₹{getActiveAmount().toLocaleString()}
              {frequency !== 'one-time' && frequency !== 'pledge' && <span className="text-xs font-medium text-muted-foreground">/ {frequency === '15days' ? '15d' : frequency === '30days' ? '30d' : frequency.startsWith('custom-') ? `${frequency.split('-')[1]}d` : frequency}</span>}
            </span>
          </div>
          <div className="flex items-start justify-between gap-4">
            <span className="text-muted-foreground font-semibold whitespace-nowrap mt-0.5">{tStr("Temple")}</span> 
            <span className="font-bold text-foreground text-right leading-tight">{tStr(templeObj.name)}</span>
          </div>
          <div className="flex items-start justify-between gap-4">
            <span className="text-muted-foreground font-semibold whitespace-nowrap mt-0.5">{tStr("Cause")}</span> 
            <span className="font-bold text-foreground text-right leading-tight">{tStr(CAUSES.find((c: any) => c.id === cause)?.title ?? "")}</span>
          </div>
          {frequency !== 'one-time' && frequency !== 'pledge' && (
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground font-semibold">{tStr("Frequency")}</span> 
              <span className="font-bold text-primary bg-primary/10 px-2 py-0.5 rounded uppercase tracking-wider text-[11px]">{frequency === '15days' ? '15 Days' : frequency === '30days' ? '30 Days' : frequency.startsWith('custom-') ? `${frequency.split('-')[1]} Days` : frequency}</span>
            </div>
          )}
          {frequency === 'pledge' && (
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground font-semibold">{tStr("Fulfillment Date")}</span> 
              <span className="font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded uppercase tracking-wider text-[11px]">{new Date(pledgeDate || "").toLocaleDateString()}</span>
            </div>
          )}
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground font-semibold">{tStr("Method")}</span> 
            <span className="font-bold text-white uppercase bg-secondary px-2 py-0.5 rounded text-[11px] tracking-wider">{tStr(PAYMENT_METHODS.find((m) => m.id === paymentMethod)?.label.split(" (")[0] ?? paymentMethod)}</span>
          </div>
          <div className="flex items-center justify-between border-t-2 border-dashed border-border/60 pt-3 mt-1">
            <span className="text-muted-foreground font-semibold">{tStr("Transaction ID")}</span> 
            <span className="font-mono font-bold text-foreground text-[11px] bg-secondary/50 px-2 py-1 rounded border border-border/50">
              TXN{Math.floor(Math.random()*100000000)}
            </span>
          </div>
        </div>
      </div>

      <button className="w-full mb-2.5 rounded-full bg-secondary text-primary-foreground hover:bg-secondary/80 border border-border/50 py-3 text-sm font-semibold flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 shadow-sm active:scale-[0.98]">
        <Download className="w-4 h-4" /> {tStr("Download Receipt")}
      </button>
      <button onClick={onReset} className="w-full rounded-full bg-primary text-primary-foreground py-3 text-sm font-bold hover:bg-primary/90 transition-all shadow-md hover:-translate-y-0.5 active:scale-[0.98]">
        {tStr("Make Another Donation")}
      </button>
    </div>
  );
}
