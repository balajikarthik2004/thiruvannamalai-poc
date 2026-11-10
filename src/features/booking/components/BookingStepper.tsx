import { Check } from "lucide-react";
import { useTranslation } from "react-i18next";

export type StepNumber = 1 | 2 | 3 | 4;

interface Props {
  currentStep: StepNumber;
  onStepClick?: (step: StepNumber) => void;
}

const STEPS = [
  { num: 1 as StepNumber, label: "Schedule" },
  { num: 2 as StepNumber, label: "Devotee Details" },
  { num: 3 as StepNumber, label: "Select Services" },
  { num: 4 as StepNumber, label: "Checkout" },
];

export function BookingStepper({ currentStep, onStepClick }: Props) {
  const { t } = useTranslation();

  return (
    <nav aria-label={t("Booking progress")} className="w-full max-w-2xl mx-auto px-4 pt-6 pb-2">
      <ol className="flex items-center justify-between relative">
        {/* Background connecting bar */}
        <div
          aria-hidden
          className="absolute left-[12%] right-[12%] top-4 h-0.5 bg-[#E2E8F0] -z-0"
        />

        {/* Dynamic active connecting bar fill */}
        <div
          aria-hidden
          className="absolute left-[12%] top-4 h-0.5 bg-[#15803D] transition-all duration-300 -z-0"
          style={{
            width:
              currentStep === 1
                ? "0%"
                : currentStep === 2
                ? "25%"
                : currentStep === 3
                ? "50%"
                : "76%",
          }}
        />

        {STEPS.map((s) => {
          const isDone = currentStep > s.num;
          const isActive = currentStep === s.num;
          const isClickable = onStepClick && currentStep > s.num;

          return (
            <li key={s.num} className="relative z-10 flex flex-col items-center">
              <button
                type="button"
                disabled={!isClickable}
                onClick={() => isClickable && onStepClick?.(s.num)}
                aria-current={isActive ? "step" : undefined}
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all ${
                  isActive
                    ? "bg-[#073C2C] text-white shadow-md ring-4 ring-[#073C2C]/15"
                    : isDone
                    ? "bg-[#15803D] text-white cursor-pointer hover:bg-[#166534]"
                    : "bg-white text-slate-400 border border-slate-300"
                }`}
              >
                {isDone ? <Check className="h-4 w-4 stroke-[2.5]" /> : s.num}
              </button>
              <span
                className={`mt-2 text-xs font-semibold whitespace-nowrap transition-colors ${
                  isActive
                    ? "text-[#073C2C] font-bold"
                    : isDone
                    ? "text-[#15803D]"
                    : "text-slate-500"
                }`}
              >
                {t(s.label)}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

