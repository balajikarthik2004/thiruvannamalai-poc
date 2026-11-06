const fs = require('fs');

const files = [
  'src/routes/_app.booking.$slug.tsx',
  'src/features/booking/components/BookingHeader.tsx',
  'src/features/booking/components/DateTimeSelector.tsx',
  'src/features/booking/components/BookingForm.tsx',
  'src/features/booking/components/BookingSummary.tsx',
  'src/features/booking/components/BookingSuccess.tsx',
  'src/features/booking/components/UpcomingEvents.tsx'
];

let allTStrs = new Set();
const regex1 = /tStr\(\s*"([^"]+)"\s*\)/g;
const regex2 = /tStr\(\s*'([^']+)'\s*\)/g;

files.forEach(f => {
  if (!fs.existsSync(f)) return;
  const content = fs.readFileSync(f, 'utf8');
  let match;
  while ((match = regex1.exec(content)) !== null) {
    allTStrs.add(match[1]);
  }
  while ((match = regex2.exec(content)) !== null) {
    allTStrs.add(match[1]);
  }
});

// Also manually add the strings in arrays that get passed to tStr
const manual = [
  "General Darshan", "Standard public queue",
  "Special Entry", "Fast-track entry queue",
  "VIP Darshan", "Direct sanctum access",
  "Senior Citizen / Differently Abled", "Priority entry with assistance",
  "Special Darshan", "Standard special queue",
  "VVIP Darshan"
];
manual.forEach(m => allTStrs.add(m));

const taFile = JSON.parse(fs.readFileSync('src/locales/ta/translation.json', 'utf8'));

const missing = [];
for (const key of allTStrs) {
  if (!taFile[key]) {
    missing.push(key);
  }
}
console.log("MISSING:", missing);
