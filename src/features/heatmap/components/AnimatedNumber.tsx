import { useEffect, useRef, useState } from "react";

/**
 * Counts from the previous value to the new one and briefly tints the text
 * (green when it rose, red when it fell) so live updates are noticeable.
 * Respects prefers-reduced-motion (jumps straight to the new value).
 */
export function AnimatedNumber({
  value,
  format = (n) => Math.round(n).toLocaleString("en-IN"),
  duration = 800,
  upIsGood = true,
}: {
  value: number;
  format?: (n: number) => string;
  duration?: number;
  upIsGood?: boolean;
}) {
  const [shown, setShown] = useState(value);
  const [flash, setFlash] = useState<"" | "up" | "down">("");
  const from = useRef(value);

  useEffect(() => {
    const start = from.current;
    if (start === value) return;
    from.current = value;
    setFlash(value > start ? "up" : "down");
    const reduce = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setShown(value);
    } else {
      const t0 = performance.now();
      let raf = 0;
      const step = (now: number) => {
        const k = Math.min(1, (now - t0) / duration);
        const eased = 1 - Math.pow(1 - k, 3);
        setShown(start + (value - start) * eased);
        if (k < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
      const off = setTimeout(() => setFlash(""), 1200);
      return () => { cancelAnimationFrame(raf); clearTimeout(off); };
    }
    const off = setTimeout(() => setFlash(""), 1200);
    return () => clearTimeout(off);
  }, [value, duration]);

  const good = flash === "up" ? upIsGood : !upIsGood;
  const tint = flash ? (good ? "text-[#006300]" : "text-rose-700") : "";

  return <span className={`tabular-nums transition-colors duration-500 ${tint}`}>{format(shown)}</span>;
}
