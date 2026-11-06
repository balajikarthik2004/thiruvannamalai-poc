# OMG Devotee — Claude Code Enhancement Prompt
## Phase 1 + Phase 2 (Copy-paste this into Claude Code)

---

```
I have a React + Vite + Tailwind CSS temple management prototype at:
C:\Users\BalajiKrishnan\Desktop\Projects\temple\temple-path

This is the OMG Devotee platform — a smart temple experience app focused on Thiruvannamalai Arunachaleswarar Temple. I need to update it for a demo to temple trustees/management. Please scan the entire codebase first, understand the structure, then implement the following changes in order.

## PHASE 1 — DEMO-READY FIXES (Do these first)

### 1. Fix Broken Navigation Links
- The sidebar "Pooja Booking" link currently points to `/pooja` which returns a 404. Change it to `/booking/tiruvannamalai` (the actual working route).
- The sidebar "Ask AI" link currently points to `/ask` which returns a 404. Change it to `/chat` (the actual working route).
- Verify ALL sidebar navigation links resolve to existing routes. Fix any other broken links.

### 2. Fix Performance / Browser Freezing
The following pages freeze the browser (renderer hangs for 30+ seconds):
- `/donations` page
- `/store/store-tiruvannamalai` (individual store detail pages)
- `/booking/tiruvannamalai` page

For each of these pages:
- Audit the component tree for unnecessary re-renders. Wrap heavy components in React.memo().
- Implement code splitting with React.lazy() and Suspense for each route.
- Lazy-load all images using loading="lazy" or an IntersectionObserver-based approach.
- If the temple list (45 temples) is rendering all at once, virtualise it using react-window or react-virtuoso.
- Move any heavy computation off the main thread.
- Target: every page should load and become interactive in under 3 seconds.

### 3. Fix Currency — USD to INR
- The Temple Store (`/store` and all `/store/*` detail pages) currently shows prices in USD ($45.00, $24.99, etc.).
- Change ALL store prices to INR (₹). Convert at reasonable Indian pricing:
  - Crystal Shiva Lingam: ₹3,750
  - Framed portraits/photos: ₹1,999–₹2,499
  - Rudraksha Mala (108+1): ₹1,799
  - Rudraksha Bracelet beads: ₹999
  - Bilva Archana Pack: ₹549
  - Shiva Damaru: ₹1,199
  - Bronze Nataraja (8 inch): ₹4,899
  - Trishul Ardhanarishvara replica: ₹6,149
  - Karthigai Deepam brass lamps (set of 5): ₹1,649
  - Vibhuthi & Kumkum set: ₹749
  - Ghee Lamp wicks & agarbatti: ₹449
  - Brass Oil Lamp (Diya): ₹2,149
  - Temple T-Shirt: ₹1,799
  - Kumkum & Turmeric sachet set: ₹799
  - Toran/Door Hanging: ₹1,499
  - Om & Swastika Wall Hanging: ₹1,249
- Update the currency symbol and formatting throughout. Use ₹ with Indian number formatting (e.g., ₹4,899).

### 4. Fix Branding Consistency
- The sidebar shows "OMG DEVI" — change this to "OMG Devotee" or just "OMG" with a subtitle "Smart Temple Experience" to match the page title.
- Make sure the logo/brand name is consistent across all pages.

### 5. Add Tamil Language Support (Basic)
- Add a working Tamil language toggle in the header (there's already a language selector button).
- At minimum, translate these to Tamil when Tamil is selected:
  - All sidebar navigation labels (Dashboard → டாஷ்போர்டு, AI Trip Plan → AI பயண திட்டம், Temple Map → கோயில் வரைபடம், Donations → நன்கொடைகள், Temple Store → கோயில் கடை, Pooja Booking → பூஜை முன்பதிவு, Membership → உறுப்பினர், Ask AI → AI கேளுங்கள், Settings → அமைப்புகள்)
  - Dashboard section headings (Devotee Essentials → பக்தர் அத்தியாவசியம், Live Darshan Feed → நேரடி தரிசன நிலை)
  - Key action buttons (Book Darshan → தரிசனம் பதிவு, Order Prasadam → பிரசாதம் ஆர்டர், Donate → நன்கொடை)
- Use React Context or i18next for the language state. Store the preference in localStorage.

### 6. Add Admin Dashboard Page (NEW PAGE)
Create a new route `/admin` with a simulated Admin Command Centre. This is the most important new page for the trustee demo. Include these sections:

**Header:** "Temple Operations Centre — Tiruvannamalai Arunachaleswarar Temple" with a "LIVE" indicator and current date/time.

**Top Stats Row (4-5 cards):**
- Today's Footfall: 38,240 (↑13% vs last Thursday)
- Today's Revenue: ₹12,84,500 (breakdown: Hundi ₹8.2L, Special Darshan ₹2.1L, Store ₹1.4L, Annadhanam Sponsors ₹1.0L)
- Active Volunteers: 127 / 150 deployed
- Open Incidents: 2 (1 medical, 1 lost child — resolved)
- Darshan Throughput: 1,250/hr (target: 1,500/hr)

**Revenue Analytics Section:**
- A bar chart or area chart showing daily revenue for the past 7 days
- Pie chart showing revenue by source (Hundi, Special Darshan, Store, Membership, Annadhanam)
- Month-to-date vs target progress bar

**Crowd Operations Section:**
- Mini heatmap (reuse/simplify the existing heatmap component)
- Gate status table: Gate name | Status (Open/Closed) | Entry Count | Exit Count | Queue Length
  - Rajagopuram (East) | Open | 12,450 | 11,200 | 340
  - Vallala Gopuram (Inner) | Open | 8,900 | 8,100 | 120
  - Kili Gopuram (North) | Open | 6,200 | 5,800 | 85
  - Thirumanjana Gopuram (South) | Closed | 0 | 0 | 0
  - Ammani Amman (West) | Open | 4,100 | 3,900 | 45
- Current crowd level indicator with capacity percentage

**Staff & Volunteer Panel:**
- Shift status: Morning (6AM-2PM) ✅ | Afternoon (2PM-10PM) 🔄 Active | Night (10PM-6AM) ⏳ Upcoming
- Zone deployment table: Zone | Assigned | Present | Gap
- Quick action buttons: "Send Alert", "Request Backup", "Log Incident"

**Recent Activity Feed:**
A scrollable list of recent events:
- "10:32 AM — Crowd surge detected at East Rajagopuram. Redirected to North gate."
- "10:15 AM — Medical incident at Queue Line 3. Ambulance dispatched."
- "09:45 AM — VIP darshan group (15 pax) entered via Vallala Gopuram."
- "09:30 AM — Morning shift volunteer count: 127/150."
- "09:00 AM — Temple opened. All gates operational."

**Styling:** Use a darker theme for the admin panel (dark navy/charcoal background with light text) to visually distinguish it from the devotee-facing pages. Use green/yellow/red status indicators. Make it look like a professional operations control room.

**Add an "Admin" link in the sidebar** (with a lock/shield icon) below Settings.

### 7. Make Tiruvannamalai the Default Focus
- On the Dashboard, the hero section already shows Tiruvannamalai — good. But ensure it's the pre-selected temple across ALL pages by default (Trip Plan temple selector, Heatmap first tab, Store first listed, etc.).
- The dashboard should feel like "Tiruvannamalai Command Centre" not "generic temple aggregator" when first loaded.

### 8. Add Product Images to Temple Store
- For each product in the Tiruvannamalai store, add a placeholder image. You can use:
  - A gradient background with the product name as overlay text
  - Or use a generic devotional icon/silhouette per category (a lingam icon for idols, a frame icon for photos, a rudraksha icon for merchandise, a leaf icon for sachets, a lamp icon for lamps, a t-shirt icon for apparel, a toran icon for hangings)
- Each product card should show the image prominently above the name and price.

---

## PHASE 2 — CROWD MANAGEMENT SHOWCASE

### 9. Enhanced Heatmap with Gate-Level Indicators
On the existing `/heatmap` page for Tiruvannamalai:
- Add gate markers on the temple map showing each gate with its status (open/closed), current queue length, and entry count.
- Add colour-coded severity thresholds with a clear legend:
  - 🟢 Green (Safe): < 60% capacity
  - 🟡 Yellow (Moderate): 60–80%
  - 🟠 Orange (High): 80–95%
  - 🔴 Red (Critical): > 95%
- Add a "Zone Capacity" panel showing each zone's current count vs maximum allowed.
- Add a toggle to show "Historical Overlay" — a semi-transparent layer showing last week's crowd at the same time for comparison.

### 10. Girivalam Route Management (NEW PAGE)
Create a new route `/girivalam` with a dedicated Girivalam crowd management screen:

**Header:** "Girivalam Route — Live Crowd Monitor" with distance (14 km) and estimated completion time.

**Route Map:**
- Show the circular 14km Girivalam path around Arunachala hill.
- Divide the route into 8 segments between the Ashta Lingams.
- Colour-code each segment by crowd density (green/yellow/orange/red).
- Mark each Ashta Lingam with an icon and name:
  1. Indra Lingam (East)
  2. Agni Lingam (Southeast)
  3. Yama Lingam (South)
  4. Niruthi Lingam (Southwest)
  5. Varuna Lingam (West)
  6. Vayu Lingam (Northwest)
  7. Kubera Lingam (North)
  8. Esanya Lingam (Northeast)

**Right Sidebar:**
- Current walkers on route: ~4,200
- Average completion time: 4h 20m
- Busiest segment: Indra → Agni (East side)
- Least crowded: Vayu → Kubera (Northwest)
- Water stations: 12 active / 14 total
- Medical posts: 6 active
- Recommended start point: Kubera Lingam (North) — least crowded entry

**Ashta Lingam Status Table:**
| Lingam | Direction | Crowd Level | Wait Time | Distance from Previous |
Show live crowd and wait time for each lingam.

**Tips Panel:**
- Best time for Girivalam today: 4:00 AM – 6:00 AM
- Full moon (Pournami) Girivalam: Next on [calculate next pournami date]
- "Start from the North (Kubera Lingam) to avoid the East-side crowd"

**Add "Girivalam" as a new sidebar navigation item** (with a mountain/path icon) between Temple Map and Donations.

### 11. Predictive Crowd Surge Alerts
On the Temple Detail page (`/temple/tiruvannamalai`):
- Replace the simple "Today's crowd forecast" section with a full 24-hour interactive crowd prediction chart.
- X-axis: Hours (5:30 AM to 10:00 PM in 30-min intervals)
- Y-axis: Expected crowd count
- Show a line chart with:
  - Blue line: Predicted crowd (smooth curve)
  - Grey dashed line: Last Thursday's actual crowd for comparison
  - Red zones: Periods where crowd is predicted to exceed 80% capacity
  - Green zones: Recommended darshan windows
  - A vertical "NOW" line showing current time
- Below the chart, show 3 AI insight cards:
  - "🔮 Surge Alert: Crowd expected to peak at 10:30 AM (~15,800). Recommend arriving before 7:00 AM or after 3:00 PM."
  - "📊 Today is Pradosham — historically 40% higher footfall than a regular Thursday."
  - "🌡️ Temperature will reach 34°C by 1 PM. Girivalam walkers should start before 6 AM."

### 12. Emergency Alert Panel (Admin Feature)
On the `/admin` page, add an expandable "Emergency Control" section:
- Large red "EMERGENCY BROADCAST" button (with a confirmation dialog)
- Alert type dropdown: Stampede Risk | Medical Emergency | Fire | Weather | Security | General
- Severity: Low | Medium | High | Critical
- Affected zones: Multi-select checkboxes for temple zones
- Message template: Pre-filled templates for each alert type, editable
- Broadcast channels: Checkboxes for App Push Notification, SMS, PA System, Digital Signage
- A "Recent Alerts" log showing past alerts with timestamp, type, and resolution status
- Gate control panel: Quick-action buttons to Open/Close each gate individually

### 13. QR-Based Entry Simulation
On the Booking confirmation flow:
- After a booking is confirmed, generate and display a QR code (use a library like qrcode.react).
- The QR should encode: booking ID, devotee name, date, time slot, number of people, darshan type.
- Show a mock "Scan at Entry" preview showing what the gate scanner would see.
- On the Temple Detail page, add a "Scan Entry" card in the admin view showing:
  - Total QR scans today: 8,450
  - Valid entries: 8,320
  - Expired/invalid: 130
  - Average scan time: 2.3 seconds

---

## IMPLEMENTATION NOTES

- This is a prototype/demo — use simulated/mock data throughout. No real backend needed.
- Keep all mock data realistic and specific to Thiruvannamalai Arunachaleswarar Temple.
- Use Recharts or Chart.js for all charts (check which is already in the project dependencies).
- For the Girivalam route map, use an SVG illustration or a styled div-based path — no need for Google Maps integration at this stage.
- Use Tailwind CSS for all styling. Maintain consistency with the existing design system (the indigo/navy sidebar, orange/red CTAs, card-based layouts).
- For the Admin Dashboard dark theme, use Tailwind's dark classes or a separate colour palette.
- Make sure every new page is added to the router and the sidebar navigation.
- Test that no page freezes the browser after changes.

Please scan the project structure first, understand the existing routing, component patterns, and data flow, then implement these changes systematically. Start with the Phase 1 fixes (items 1-8) before moving to Phase 2 features (items 9-13).
```

---

### How to Use This Prompt

1. Open Claude Code (terminal)
2. Navigate to your project: `cd C:\Users\BalajiKrishnan\Desktop\Projects\temple\temple-path`
3. Copy-paste the entire prompt above (everything between the ``` markers)
4. Claude Code will scan your codebase and implement the changes

### Tips
- If the prompt is too long for one go, split it: paste Phase 1 (items 1–8) first, let Claude Code finish, then paste Phase 2 (items 9–13)
- After each major change, run `npm run dev` and check the browser
- Commit after Phase 1 is done before starting Phase 2
