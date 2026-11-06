import { Check } from "lucide-react";
import { useTranslation } from "react-i18next";

const STEPS = ["Choose Temple", "Choose Plan", "Your Details", "Payment"];

export function MembershipStepper({
  current,
  onJump,
}: {
  current: number;
  onJump: (step: number) => void;
}) {
  const { t } = useTranslation();

  return (
    <nav aria-label={t("Membership steps")} className="flex items-center justify-center gap-1 sm:gap-3 select-none">
      {STEPS.map((label, i) => {
        const step = i + 1;
        const done = step < current;
        const active = step === current;
        return (
          <div key={label} className="flex items-center gap-1 sm:gap-3">
            <button
              type="button"
              disabled={!done}
              onClick={() => done && onJump(step)}
              aria-current={active ? "step" : undefined}
              className={`flex items-center gap-2 rounded-full pl-1.5 pr-2 sm:pr-4 py-1.5 transition-all ${
                active
                  ? "bg-saffron text-white shadow-md shadow-saffron/25"
                  : done
                    ? "text-saffron hover:bg-rose-50 cursor-pointer"
                    : "text-slate-500 cursor-default"
              }`}
            >
              <span
                className={`w-7 h-7 shrink-0 rounded-full grid place-items-center text-xs font-bold ${
                  active ? "bg-white/25 text-white" : done ? "bg-saffron text-white" : "bg-slate-200 text-slate-500"
                }`}
              >
                {done ? <Check className="w-3.5 h-3.5" strokeWidth={3} /> : step}
              </span>
              <span className={`text-sm font-semibold whitespace-nowrap ${active ? "" : "hidden sm:inline"}`}>{t(label)}</span>
            </button>
            {step < STEPS.length && <span className={`h-px w-4 sm:w-10 ${done ? "bg-saffron" : "bg-slate-300"}`} aria-hidden />}
          </div>
        );
      })}
    </nav>
  );
}
