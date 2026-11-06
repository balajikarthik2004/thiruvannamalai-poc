import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/notifications")({
  head: () => ({ meta: [{ title: "Alerts — OMG Smart Temple" }] }),
  component: NotificationsPage,
});

const alerts = [
  { type: "crowd", color: "var(--status-high)", title: "Tiruvannamalai is now CRITICAL", body: "Crowd has exceeded 85% capacity. Consider visiting after 6:00 PM today.", time: "2 min ago" },
  { type: "best", color: "var(--status-mod)", title: "Good time for Annamalaiyar darshan", body: "Queues at the East Rajagopuram have eased — try the afternoon session after 3:30 PM.", time: "15 min ago" },
  { type: "reminder", color: "var(--status-low)", title: "Your planned visit to Srirangam is tomorrow at 4 PM", body: "Current forecast: LOW crowd. Great timing! 🎉", time: "1 hour ago" },
  { type: "festival", color: "var(--saffron)", title: "Karthigai Deepam at Tiruvannamalai — Nov 24", body: "Flag hoisting Nov 15 · Maha Deepam at 6 PM on Nov 24. Lakhs of devotees expected — book your stay early.", time: "2 hours ago" },
];

function NotificationsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 lg:px-8 pt-6 pb-10">
      <h1 className="font-serif text-3xl font-semibold">Your temple alerts</h1>
      <p className="text-muted-foreground text-sm mt-1">Smart, contextual reminders for your peaceful visits.</p>

      <div className="mt-6 space-y-3">
        {alerts.map((a, i) => (
          <div key={i} className="bg-card rounded-2xl border border-border card-soft overflow-hidden">
            <div className="border-l-4 p-4" style={{ borderColor: a.color }}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-serif font-semibold">{a.title}</div>
                  <div className="text-sm text-muted-foreground mt-1">{a.body}</div>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">{a.time}</span>
              </div>
              <div className="mt-3 flex gap-2 text-sm">
                <button className="rounded-full bg-foreground text-background px-3 py-1">View</button>
                <button className="rounded-full bg-white border border-border px-3 py-1">Dismiss</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-card border border-border rounded-2xl p-5 card-soft">
        <div className="font-serif text-lg font-semibold mb-3">Notification preferences</div>
        {["Crowd surge alerts","Best time alerts","Festival reminders","Pooja schedule reminders","Parking alerts","Watchlist alerts"].map((p, i) => (
          <Toggle key={p} label={p} defaultOn={i!==3} />
        ))}
      </div>
    </div>
  );
}

function Toggle({ label, defaultOn }: any) {
  return (
    <label className="flex items-center justify-between py-2.5 border-b border-border last:border-0 cursor-pointer">
      <span className="text-sm">{label}</span>
      <input type="checkbox" defaultChecked={defaultOn} className="peer sr-only" />
      <span className="w-10 h-6 rounded-full bg-secondary peer-checked:bg-saffron relative transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:w-5 after:h-5 after:bg-white after:rounded-full after:transition-transform peer-checked:after:translate-x-4" />
    </label>
  );
}
