import type { SVGProps } from "react";

/** Exact temple gopuram icon matching the devotee design */
export function TempleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 2v2" />
      <path d="M9 4.5h6l-1 2.5H10L9 4.5z" />
      <path d="M7 7h10l-1 3H8L7 7z" />
      <path d="M5 10h14v11H5V10z" />
      <path d="M10 21v-4a2 2 0 0 1 4 0v4" />
    </svg>
  );
}

/** Trip planner route icon matching devotee design */
export function TripPlannerIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M3 21h18" />
      <path d="M12 3v18" />
      <path d="M12 4.5l6 4-6 4" />
      <path d="M12 10.5l-5 3.5 5 3.5" />
      <circle cx="12" cy="3.5" r="1" fill="currentColor" />
    </svg>
  );
}

/** Sacred kalasam / pooja urn icon */
export function PoojaIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M10 3a2 2 0 0 1 4 0v2h-4V3z" />
      <path d="M6 7h12l1 10a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4L6 7z" />
      <circle cx="12" cy="13" r="2" />
      <path d="M12 8v1.5" />
    </svg>
  );
}

/** Donation box / hundi with checkmark */
export function DonationsIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect x="3" y="6" width="18" height="15" rx="2" />
      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <path d="m9 13.5 2 2 4-4" />
    </svg>
  );
}

/** Pilgrimage journey shield crest */
export function MyJourneyIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <circle cx="12" cy="11" r="3" />
    </svg>
  );
}

