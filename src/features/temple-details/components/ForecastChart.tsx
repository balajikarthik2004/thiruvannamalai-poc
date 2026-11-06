import { useTranslation } from "react-i18next";
import { Area, AreaChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function ForecastChart({ data, nowHour }: any) {
  const { t: tStr } = useTranslation();

  const startLabel = data?.length > 0 ? data[0].label : "";
  const endLabel = data?.length > 0 ? data[data.length - 1].label : "";
  
  const d = new Date();
  const currentHour = d.getHours();
  const currentMins = d.getMinutes() >= 30 ? "30" : "00";
  const ampm = currentHour >= 12 ? 'PM' : 'AM';
  const displayNowHour = currentHour > 12 ? currentHour - 12 : currentHour === 0 ? 12 : currentHour;
  const nowLabel = `${displayNowHour}:${currentMins} ${ampm}`;

  return (
    <div className="bg-white border border-slate-100 rounded-3xl p-7 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-serif text-xl font-bold text-slate-900">{tStr("Today's crowd forecast")}</h3>
        <span className="text-xs font-bold uppercase tracking-widest text-slate-500">{tStr(`${startLabel} – ${endLabel}`)}</span>
      </div>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#F97316" stopOpacity={0.5} />
                <stop offset="100%" stopColor="#F97316" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <XAxis dataKey="label" tick={{ fontSize: 11 }} minTickGap={20} stroke="#A8A29E" />
            <YAxis tick={{ fontSize: 11 }} stroke="#A8A29E" />
            <Tooltip formatter={(v: any) => [`${v}%`, tStr("Crowd")]} contentStyle={{ borderRadius: 12, border: "1px solid #F5F0E8" }} />
            <ReferenceLine x={nowLabel} stroke="#1C1917" strokeDasharray="3 3" />
            <Area type="monotone" dataKey="pct" stroke="#F97316" strokeWidth={2} fill="url(#g1)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
