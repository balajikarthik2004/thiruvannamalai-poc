import { useTranslation } from "react-i18next";
import { Users, User, Phone, FileDigit, ChevronDown, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { DARSHAN_CATEGORIES } from "../constants";

function Field({ id, label, error, hint, children }: { id: string; label: string; error?: string; hint?: string; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-bold text-slate-800 mb-2">
        {label} <span className="text-saffron">*</span>
      </label>
      {children}
      {error ? <p id={`${id}-error`} role="alert" className="text-xs text-rose-600 mt-1.5 font-medium">{error}</p> : hint ? <p className="text-xs text-slate-500 mt-1.5">{hint}</p> : null}
    </div>
  );
}

const inputCls = (hasError: boolean) =>
  `w-full h-12 pr-4 bg-rose-50/40 border rounded-xl outline-none text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-saffron focus:ring-4 focus:ring-saffron/10 transition-all ${
    hasError ? "border-rose-400 bg-rose-50" : "border-rose-100"
  }`;

function IconInput({ icon: Icon, children }: { icon: LucideIcon; children: ReactNode }) {
  return (
    <div className="relative">
      <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-slate-400 pointer-events-none" />
      {children}
    </div>
  );
}

export function BookingForm({ details, setDetails, errors }: any) {
  const { t: tStr } = useTranslation();
  const update = (field: string, val: any) => setDetails((prev: any) => ({ ...prev, [field]: val }));
  const category = DARSHAN_CATEGORIES.find((c) => c.id === details.categoryId);

  return (
    <div className="grid md:grid-cols-2 gap-x-8 gap-y-5">
      {/* Row 1: title | number of devotees */}
      <div className="flex items-center gap-3 md:self-end">
        <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-saffron shrink-0">
          <Users className="w-5 h-5" />
        </div>
        <h2 className="font-serif text-xl font-bold text-slate-900">{tStr("Devotee Details")}</h2>
      </div>

      <div>
        <div className="text-sm font-bold text-slate-800 mb-2">{tStr("How many devotees are visiting?")}</div>
        <div className="flex items-center gap-2.5" role="radiogroup" aria-label={tStr("Number of devotees")}>
          {[1, 2, 3, 4, 5, 6].map((num) => (
            <button
              key={num}
              type="button"
              role="radio"
              aria-checked={details.persons === num}
              onClick={() => update("persons", num)}
              className={`w-11 h-11 rounded-xl text-base font-bold transition-all ${
                details.persons === num
                  ? "bg-saffron text-white shadow-md shadow-saffron/25"
                  : "bg-white text-slate-700 border border-rose-100 hover:border-saffron hover:text-saffron"
              }`}
            >
              {num}
            </button>
          ))}
        </div>
      </div>

      {/* Row 2: name | phone */}
      <Field id="devotee-name" label={tStr("Primary Devotee Name")} error={errors?.name}>
        <IconInput icon={User}>
          <input
            id="devotee-name"
            autoComplete="name"
            aria-invalid={!!errors?.name}
            type="text"
            value={details.name}
            onChange={(e) => update("name", e.target.value)}
            placeholder={tStr("Enter full name")}
            className={`${inputCls(!!errors?.name)} pl-11`}
          />
        </IconInput>
      </Field>

      <Field id="devotee-phone" label={tStr("Phone Number")} error={errors?.phone}>
        <IconInput icon={Phone}>
          <span className="absolute left-11 top-1/2 -translate-y-1/2 text-sm text-slate-600 font-medium pointer-events-none">+91</span>
          <input
            id="devotee-phone"
            autoComplete="tel-national"
            aria-invalid={!!errors?.phone}
            type="tel"
            inputMode="numeric"
            value={details.phone}
            onChange={(e) => update("phone", e.target.value.replace(/\D/g, "").slice(0, 10))}
            placeholder="00000 00000"
            className={`${inputCls(!!errors?.phone)} pl-[4.5rem] tracking-wide`}
          />
        </IconInput>
      </Field>

      {/* Row 3: ID | category */}
      <Field id="devotee-id" label={tStr("Aadhaar / Gov ID Number")} error={errors?.idNumber} hint={tStr("Must carry original ID during temple visit.")}>
        <IconInput icon={FileDigit}>
          <input
            id="devotee-id"
            aria-invalid={!!errors?.idNumber}
            type="text"
            value={details.idNumber}
            onChange={(e) => update("idNumber", e.target.value)}
            placeholder={tStr("Enter ID number (required at entry)")}
            className={`${inputCls(!!errors?.idNumber)} pl-11 tracking-wide`}
          />
        </IconInput>
      </Field>

      <Field id="devotee-category" label={tStr("Devotee Category")} hint={category ? `${tStr(category.desc)} · ₹${category.price} ${tStr("per devotee")}` : undefined}>
        <IconInput icon={Users}>
          <select
            id="devotee-category"
            value={details.categoryId}
            onChange={(e) => update("categoryId", e.target.value)}
            className={`${inputCls(false)} pl-11 pr-10 appearance-none cursor-pointer font-medium`}
          >
            {DARSHAN_CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {tStr(c.name)} — ₹{c.price}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
        </IconInput>
      </Field>
    </div>
  );
}
