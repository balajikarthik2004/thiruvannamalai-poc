import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Globe, Check, Loader2 } from "lucide-react";
import { changeLanguage } from "@/i18n/config";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const languages = [
  { code: "en", name: "English", native: "English", short: "EN" },
  { code: "ta", name: "Tamil", native: "தமிழ்", short: "தமி" },
  { code: "hi", name: "Hindi", native: "हिन्दी", short: "हिं" },
  { code: "kn", name: "Kannada", native: "ಕನ್ನಡ", short: "ಕನ್" },
  { code: "gu", name: "Gujarati", native: "ગુજરાતી", short: "ગુ" },
  { code: "mr", name: "Marathi", native: "मराठी", short: "मरा" },
];

export function LanguageSwitcher({
  className = "",
  variant = "icon",
}: {
  className?: string;
  /** `labelled` shows the current language name next to the globe. */
  variant?: "icon" | "labelled";
}) {
  const { i18n, t } = useTranslation();
  // i18n.language can be a region tag such as "ta-IN".
  const base = (i18n.language || "en").split("-")[0];
  const current = languages.find((l) => l.code === base) ?? languages[0];

  const [switching, setSwitching] = useState<string | null>(null);

  const change = async (code: string) => {
    if (code === base) return;
    setSwitching(code);
    try {
      localStorage.setItem("omg-language", code);
    } catch {
      /* private mode — the detector's own cache still handles the common case */
    }
    // Fetches the catalogue first, so the UI never flashes untranslated keys.
    await changeLanguage(code);
    setSwitching(null);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={
            variant === "labelled"
              ? `flex items-center gap-2 rounded-lg px-2 py-1.5 w-full text-sm font-medium hover:bg-white/10 transition-colors ${className}`
              : `flex items-center justify-center rounded-full hover:bg-white/10 transition-colors ${className}`
          }
          aria-label={t("Select Language")}
        >
          <Globe className="w-5 h-5 shrink-0" />
          {variant === "labelled" && (
            <span className="truncate">{current.native}</span>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" side="top" className="w-52 z-[100]">
        <DropdownMenuLabel className="text-xs uppercase tracking-wider text-muted-foreground">
          {t("Select Language")}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {languages.map((lang) => {
          const active = base === lang.code;
          return (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => change(lang.code)}
              className={`cursor-pointer flex items-center justify-between gap-3 ${
                active ? "bg-primary/10 font-semibold" : ""
              }`}
            >
              <span className="flex flex-col leading-tight">
                <span className="text-sm">{lang.native}</span>
                <span className="text-[11px] text-muted-foreground">{lang.name}</span>
              </span>
              {switching === lang.code ? (
                <Loader2 className="w-4 h-4 shrink-0 animate-spin text-muted-foreground" />
              ) : (
                active && <Check className="w-4 h-4 text-primary shrink-0" />
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
