import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Users,
  User,
  Phone,
  Mail,
  CreditCard,
  Plus,
  Trash2,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  Accessibility,
} from "lucide-react";
import type { DevoteeMember } from "../constants";

interface Props {
  devotees: DevoteeMember[];
  onChangeDevotees: (devotees: DevoteeMember[]) => void;
  contactEmail: string;
  onChangeContactEmail: (email: string) => void;
  contactPhone: string;
  onChangeContactPhone: (phone: string) => void;
  specialAssistance: boolean;
  onChangeSpecialAssistance: (val: boolean) => void;
  onContinue: () => void;
  onBack: () => void;
}

const ID_TYPES = ["Aadhaar Card", "Passport", "Voter ID", "Driving License", "PAN Card"];

export function DevoteeStep({
  devotees,
  onChangeDevotees,
  contactEmail,
  onChangeContactEmail,
  contactPhone,
  onChangeContactPhone,
  specialAssistance,
  onChangeSpecialAssistance,
  onContinue,
  onBack,
}: Props) {
  const { t } = useTranslation();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const primary = devotees[0] || {
    id: "1",
    name: "",
    age: "",
    gender: "male" as const,
    idType: "Aadhaar Card",
    idNumber: "",
  };

  const updateDevotee = (index: number, field: keyof DevoteeMember, value: any) => {
    const next = [...devotees];
    if (!next[index]) return;
    next[index] = { ...next[index], [field]: value };
    onChangeDevotees(next);
    // clear error for this field
    if (errors[`${index}-${field}`]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[`${index}-${field}`];
        return copy;
      });
    }
  };

  const addDevotee = () => {
    if (devotees.length >= 6) return;
    const newId = String(devotees.length + 1);
    onChangeDevotees([
      ...devotees,
      {
        id: newId,
        name: "",
        age: "",
        gender: "male",
        idType: "Aadhaar Card",
        idNumber: "",
      },
    ]);
  };

  const removeDevotee = (index: number) => {
    if (devotees.length <= 1) return;
    onChangeDevotees(devotees.filter((_, i) => i !== index));
  };

  const handleValidateAndContinue = () => {
    const errs: Record<string, string> = {};

    if (!primary.name.trim()) errs["0-name"] = t("Full name is required");
    if (!primary.age) errs["0-age"] = t("Age is required");
    if (!primary.idNumber.trim()) errs["0-idNumber"] = t("ID proof number is required");
    if (!contactPhone.trim() || contactPhone.length < 10) {
      errs["contactPhone"] = t("Valid 10-digit phone number is required");
    }

    // Validate additional devotees
    devotees.slice(1).forEach((d, idx) => {
      const actualIdx = idx + 1;
      if (!d.name.trim()) errs[`${actualIdx}-name`] = t("Name is required");
      if (!d.age) errs[`${actualIdx}-age`] = t("Age is required");
    });

    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      onContinue();
    }
  };

  return (
    <div className="rounded-2xl border border-[#E8E2D5] bg-white p-5 sm:p-7 shadow-xs">
      {/* Header */}
      <div className="mb-6 flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FAF6F0] text-[#A86221]">
          <Users className="h-6 w-6 text-[#A86221]" />
        </div>
        <div>
          <h2 className="font-serif text-xl font-bold tracking-tight text-[#073C2C] sm:text-2xl">
            {t("Devotee Information")}
          </h2>
          <p className="mt-0.5 text-xs font-medium text-slate-500 sm:text-sm">
            {t("Enter details for all devotees attending the darshan.")}
          </p>
        </div>
      </div>

      {/* Number of devotees counter button pills */}
      <div className="mb-6 rounded-xl border border-slate-200 bg-slate-50/50 p-4">
        <label className="mb-2 block text-xs font-bold text-slate-700">
          {t("Total Number of Devotees")} ({t("Max 6 per booking")})
        </label>
        <div className="flex flex-wrap items-center gap-2">
          {[1, 2, 3, 4, 5, 6].map((count) => {
            const isSelected = devotees.length === count;
            return (
              <button
                key={count}
                type="button"
                onClick={() => {
                  if (count > devotees.length) {
                    const diff = count - devotees.length;
                    const additions: DevoteeMember[] = Array.from({ length: diff }, (_, i) => ({
                      id: String(devotees.length + i + 1),
                      name: "",
                      age: "",
                      gender: "male",
                      idType: "Aadhaar Card",
                      idNumber: "",
                    }));
                    onChangeDevotees([...devotees, ...additions]);
                  } else if (count < devotees.length) {
                    onChangeDevotees(devotees.slice(0, count));
                  }
                }}
                className={`flex h-9 w-12 items-center justify-center rounded-lg text-xs font-bold transition-all ${
                  isSelected
                    ? "bg-[#073C2C] text-white shadow-xs"
                    : "border border-slate-200 bg-white text-slate-700 hover:border-[#16A34A]"
                }`}
              >
                {count}
              </button>
            );
          })}
        </div>
      </div>

      {/* Primary Devotee Form */}
      <div className="mb-6 rounded-xl border border-slate-200 bg-white p-4 sm:p-5 shadow-xs">
        <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-2">
          <span className="font-serif text-sm font-bold text-[#073C2C] flex items-center gap-2">
            <User className="h-4 w-4 text-[#16A34A]" />
            {t("Primary Devotee")} ({t("Lead Devotee")})
          </span>
          <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
            {t("Main Contact")}
          </span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {/* Full Name */}
          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs font-bold text-slate-700">
              {t("Full Name (as in Government ID)")} <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={primary.name}
              onChange={(e) => updateDevotee(0, "name", e.target.value)}
              placeholder="e.g. Balaji Krishnan"
              className={`w-full rounded-lg border px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20 ${
                errors["0-name"] ? "border-rose-300 bg-rose-50/50" : "border-slate-200 bg-white"
              }`}
            />
            {errors["0-name"] && (
              <p className="mt-1 flex items-center gap-1 text-[11px] text-rose-600">
                <AlertCircle className="h-3 w-3" /> {errors["0-name"]}
              </p>
            )}
          </div>

          {/* Age & Gender */}
          <div>
            <label className="mb-1 block text-xs font-bold text-slate-700">
              {t("Age")} <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              min="1"
              max="120"
              value={primary.age}
              onChange={(e) => updateDevotee(0, "age", e.target.value ? Number(e.target.value) : "")}
              placeholder="e.g. 35"
              className={`w-full rounded-lg border px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20 ${
                errors["0-age"] ? "border-rose-300 bg-rose-50/50" : "border-slate-200 bg-white"
              }`}
            />
            {errors["0-age"] && (
              <p className="mt-1 text-[11px] text-rose-600">{errors["0-age"]}</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-xs font-bold text-slate-700">
              {t("Gender")}
            </label>
            <select
              value={primary.gender}
              onChange={(e) => updateDevotee(0, "gender", e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20"
            >
              <option value="male">{t("Male")}</option>
              <option value="female">{t("Female")}</option>
              <option value="other">{t("Other")}</option>
            </select>
          </div>

          {/* ID Proof Type & Number */}
          <div>
            <label className="mb-1 block text-xs font-bold text-slate-700">
              {t("Government ID Proof Type")} <span className="text-rose-500">*</span>
            </label>
            <select
              value={primary.idType}
              onChange={(e) => updateDevotee(0, "idType", e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20"
            >
              {ID_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-bold text-slate-700">
              {t("ID Proof Number")} <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={primary.idNumber}
              onChange={(e) => updateDevotee(0, "idNumber", e.target.value.toUpperCase())}
              placeholder="e.g. XXXX-XXXX-1234"
              className={`w-full rounded-lg border px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20 ${
                errors["0-idNumber"] ? "border-rose-300 bg-rose-50/50" : "border-slate-200 bg-white"
              }`}
            />
            {errors["0-idNumber"] && (
              <p className="mt-1 text-[11px] text-rose-600">{errors["0-idNumber"]}</p>
            )}
          </div>

          {/* Contact Phone & Email */}
          <div>
            <label className="mb-1 block text-xs font-bold text-slate-700">
              {t("Mobile Number (for SMS & e-Pass)")} <span className="text-rose-500">*</span>
            </label>
            <div className="flex">
              <span className="flex items-center rounded-l-lg border border-r-0 border-slate-200 bg-slate-50 px-2.5 text-xs text-slate-500">
                +91
              </span>
              <input
                type="tel"
                value={contactPhone}
                onChange={(e) => onChangeContactPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                placeholder="9876543210"
                className={`w-full rounded-r-lg border px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20 ${
                  errors["contactPhone"] ? "border-rose-300 bg-rose-50/50" : "border-slate-200 bg-white"
                }`}
              />
            </div>
            {errors["contactPhone"] && (
              <p className="mt-1 text-[11px] text-rose-600">{errors["contactPhone"]}</p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-xs font-bold text-slate-700">
              {t("Email Address (for Darshan Receipt)")}
            </label>
            <input
              type="email"
              value={contactEmail}
              onChange={(e) => onChangeContactEmail(e.target.value)}
              placeholder="devotee@example.com"
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20"
            />
          </div>
        </div>
      </div>

      {/* Additional Devotees List */}
      {devotees.slice(1).map((d, idx) => {
        const actualIdx = idx + 1;
        return (
          <div
            key={d.id}
            className="mb-4 rounded-xl border border-slate-200 bg-white p-4 shadow-xs"
          >
            <div className="mb-3 flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="font-serif text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5 text-slate-500" />
                {t("Devotee")} #{actualIdx + 1}
              </span>
              <button
                type="button"
                onClick={() => removeDevotee(actualIdx)}
                className="flex items-center gap-1 text-[11px] font-semibold text-rose-600 hover:text-rose-800"
              >
                <Trash2 className="h-3 w-3" />
                {t("Remove")}
              </button>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div>
                <label className="mb-1 block text-[11px] font-bold text-slate-700">
                  {t("Full Name")} <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={d.name}
                  onChange={(e) => updateDevotee(actualIdx, "name", e.target.value)}
                  placeholder="Full name"
                  className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20"
                />
              </div>

              <div>
                <label className="mb-1 block text-[11px] font-bold text-slate-700">
                  {t("Age")} <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={d.age}
                  onChange={(e) => updateDevotee(actualIdx, "age", e.target.value ? Number(e.target.value) : "")}
                  placeholder="Age"
                  className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20"
                />
              </div>

              <div>
                <label className="mb-1 block text-[11px] font-bold text-slate-700">
                  {t("Gender")}
                </label>
                <select
                  value={d.gender}
                  onChange={(e) => updateDevotee(actualIdx, "gender", e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#16A34A]/20"
                >
                  <option value="male">{t("Male")}</option>
                  <option value="female">{t("Female")}</option>
                  <option value="other">{t("Other")}</option>
                </select>
              </div>
            </div>
          </div>
        );
      })}

      {/* Add Devotee Button if < 6 */}
      {devotees.length < 6 && (
        <button
          type="button"
          onClick={addDevotee}
          className="mb-6 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[#16A34A]/60 bg-[#F0FDF4]/50 py-3 text-xs font-bold text-[#166534] transition-colors hover:bg-[#F0FDF4]"
        >
          <Plus className="h-4 w-4" />
          {t("Add Another Devotee")} ({devotees.length}/6)
        </button>
      )}

      {/* Accessibility / Special Assistance Toggle */}
      <div className="mb-6 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50/60 p-3.5">
        <Accessibility className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />
        <div className="flex-1 text-xs">
          <label className="flex items-center gap-2 font-bold text-slate-900 cursor-pointer">
            <input
              type="checkbox"
              checked={specialAssistance}
              onChange={(e) => onChangeSpecialAssistance(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-[#16A34A] focus:ring-[#16A34A]"
            />
            {t("Request Wheelchair / Physical Assistance Support")}
          </label>
          <p className="mt-0.5 text-slate-600">
            {t("Temple volunteers will be stationed at the Gopuram entrance with assistance wheelchairs.")}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between border-t border-slate-100 pt-5">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-50"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          {t("Back to Schedule")}
        </button>

        <button
          type="button"
          onClick={handleValidateAndContinue}
          className="inline-flex items-center gap-2 rounded-xl bg-[#073C2C] px-6 py-2.5 text-xs font-bold text-white shadow-sm transition-all hover:bg-[#06432A] hover:shadow-md"
        >
          {t("Continue to Select Services")}
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

