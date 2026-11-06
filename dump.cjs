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
let out = '';
files.forEach(f => {
  out += '=== ' + f + ' ===\n';
  out += fs.readFileSync(f, 'utf8') + '\n';
});
fs.writeFileSync('all_booking_files.txt', out);
