import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";

export function ChatHeader() {
  const { t: tStr } = useTranslation();

  return (
    <header className="bg-white border-b border-border px-4 py-3 flex items-center gap-3">
      <Link to="/" className="lg:hidden w-9 h-9 rounded-full hover:bg-secondary flex items-center justify-center"><ArrowLeft className="w-6 h-6" /></Link>
      <div className="w-10 h-10 rounded-full gradient-saffron flex items-center justify-center text-white font-serif text-xl">ॐ</div>
      <div className="flex-1 min-w-0">
        <div className="font-serif font-semibold flex items-center gap-1.5">{tStr("OMG AI Temple Assistant")}</div>
        <div className="text-sm text-muted-foreground flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-status-low"/> {tStr("Online · Powered by AI")}</div>
      </div>
    </header>
  );
}
