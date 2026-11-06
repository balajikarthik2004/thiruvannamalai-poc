import { Link } from "@tanstack/react-router";
import type { Temple } from "@/data/temples";
import { CrowdBadge } from "./CrowdBadge";
import { Clock, MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";

export function TempleCard({ t, compact }: { t: Temple; compact?: boolean }) {
  const { t: tStr } = useTranslation();
  return (
    <Link
      to="/temple/$slug"
      params={{ slug: t.slug }}
      className={`flex flex-col bg-card border border-border rounded-lg overflow-hidden hover:bg-secondary/40 transition-colors ${compact ? "h-full" : ""}`}
    >
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-2">
          <div className="font-serif font-semibold leading-tight line-clamp-2">{tStr(t.name)}</div>
          <div className="w-6 h-6 rounded-md shrink-0 flex items-center justify-center text-white font-serif text-xs" style={{ background: t.color }}>ॐ</div>
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
          <MapPin className="w-3 h-3" /> {tStr(t.district)}
        </div>
        <div className="mt-auto pt-4 flex items-center justify-between">
          <CrowdBadge status={t.crowdStatus} />
          <span className="flex items-center gap-1 text-xs text-muted-foreground font-medium">
            <Clock className="w-3.5 h-3.5" /> {t.waitMin}m
          </span>
        </div>
      </div>
    </Link>
  );
}
