import { useEffect, useState, memo } from "react";

/**
 * A ticking clock that is deliberately NOT shared with a whole page.
 *
 * Passing a 1-second `Date` down through a page re-rendered the entire tree
 * every second (45 temple cards, charts and images on the dashboard), which is
 * what made the dashboard and temple pages hang. Components that actually show
 * the time should call `useNow()` themselves, or render `<LiveClock />`, so the
 * re-render stays local to the few nodes that display it.
 *
 * @param intervalMs how often to tick. Use 1000 only when seconds are visible;
 *                   30_000 is plenty for "10:32 AM" style displays.
 */
export function useNow(intervalMs = 1000): Date {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);

  return now;
}

/**
 * Renders the current time in isolation. Only this leaf re-renders on each tick.
 */
export const LiveClock = memo(function LiveClock({
  className = "",
  intervalMs = 1000,
  format = (d: Date) => d.toLocaleTimeString("en-IN", { hour12: false }),
}: {
  className?: string;
  intervalMs?: number;
  format?: (d: Date) => string;
}) {
  const now = useNow(intervalMs);
  return (
    <span className={`tabular-nums ${className}`} aria-live="off">
      {format(now)}
    </span>
  );
});
