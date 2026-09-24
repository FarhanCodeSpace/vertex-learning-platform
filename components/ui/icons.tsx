import React from "react";

export function VertexLogo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6 6L16 26L26 6H20.5L16 17.5L11.5 6H6Z"
        fill="#F97316"
      />
    </svg>
  );
}

export function VertexWordmark({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <VertexLogo className="w-7 h-7" />
      <span className="font-serif font-bold text-2xl tracking-tight text-neutral-900">
        Vertex
      </span>
    </div>
  );
}

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  className?: string;
}

// 06 ICONS - Outline Style (24x24px, 2px stroke, rounded line caps)
export function BellIcon({ size = 24, className = "", ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  );
}

export function SearchIcon({ size = 24, className = "", ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

export function PlayIcon({ size = 24, className = "", ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <polygon points="6 3 20 12 6 21 6 3" />
    </svg>
  );
}

export function DocumentIcon({ size = 24, className = "", ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );
}

export function BookmarkIcon({ size = 24, className = "", ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
    </svg>
  );
}

export function ChartIcon({ size = 24, className = "", ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M12 20V10" />
      <path d="M18 20V4" />
      <path d="M6 20v-4" />
    </svg>
  );
}

export function ClockIcon({ size = 24, className = "", ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

export function UserIcon({ size = 24, className = "", ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

export function ChevronRightIcon({ size = 24, className = "", ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

export function ChevronLeftIcon({ size = 24, className = "", ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

export function ChevronDownIcon({ size = 24, className = "", ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

export function ExternalLinkIcon({ size = 20, className = "", ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

// 06 ICONS - Filled Style
export function BellFilledIcon({ size = 24, className = "", ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      {...props}
    >
      <path d="M12 2a6 6 0 0 0-6 6c0 6.5-2.5 8-2.5 8h17s-2.5-1.5-2.5-8a6 6 0 0 0-6-6zm-2 18a2 2 0 0 0 4 0h-4z" />
    </svg>
  );
}

export function SearchFilledIcon({ size = 24, className = "", ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      {...props}
    >
      <path d="M10 2a8 8 0 0 1 6.32 12.906l4.387 4.387a1 1 0 0 1-1.414 1.414l-4.387-4.387A8 8 0 1 1 10 2zm0 2a6 6 0 1 0 0 12 6 6 0 0 0 0-12z" />
    </svg>
  );
}

export function PlayFilledIcon({ size = 24, className = "", ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      {...props}
    >
      <path d="M6 3.868v16.264c0 .816.897 1.314 1.589.888l13.012-8.132a1.042 1.042 0 0 0 0-1.776L7.589 2.98C6.897 2.554 6 3.052 6 3.868z" />
    </svg>
  );
}

export function DocumentFilledIcon({ size = 24, className = "", ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      {...props}
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 2.5L17.5 9H13V4.5z" />
    </svg>
  );
}

export function BookmarkFilledIcon({ size = 24, className = "", ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      {...props}
    >
      <path d="M17 3H7a2 2 0 0 0-2 2v16l7-4.5 7 4.5V5a2 2 0 0 0-2-2z" />
    </svg>
  );
}

export function ChartFilledIcon({ size = 24, className = "", ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      {...props}
    >
      <path d="M4 14h4v7H4v-7zm6-6h4v13h-4V8zm6-6h4v19h-4V2z" />
    </svg>
  );
}

export function ClockFilledIcon({ size = 24, className = "", ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      {...props}
    >
      <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm1 10.414V7h-2v6a1 1 0 0 0 .293.707l3.5 3.5 1.414-1.414-3.207-3.379z" />
    </svg>
  );
}

export function UserFilledIcon({ size = 24, className = "", ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      {...props}
    >
      <path d="M12 12c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm0 2c-3.33 0-10 1.67-10 5v3h20v-3c0-3.33-6.67-5-10-5z" />
    </svg>
  );
}

export function LayersIcon({ size = 16, className = "", ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  );
}

// 14 PRINCIPLES Icons
export function EyeIcon({ size = 24, className = "", ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export function GridIcon({ size = 24, className = "", ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <rect width="7" height="7" x="3" y="3" rx="1" />
      <rect width="7" height="7" x="14" y="3" rx="1" />
      <rect width="7" height="7" x="14" y="14" rx="1" />
      <rect width="7" height="7" x="3" y="14" rx="1" />
    </svg>
  );
}

export function TargetIcon({ size = 24, className = "", ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}

export function AccessibilityIcon({ size = 24, className = "", ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <circle cx="12" cy="4" r="2" />
      <path d="m5 9 7 1 7-1" />
      <path d="M12 10v6" />
      <path d="m8 22 4-6 4 6" />
    </svg>
  );
}

export function StarIcon({ size = 20, className = "", ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

export function NextJsLogo({ className = "w-14 h-14" }: { className?: string }) {
  return (
    <div
      className={`rounded-2xl bg-neutral-900 flex items-center justify-center text-white shadow-sm overflow-hidden p-2.5 ${className}`}
    >
      <svg viewBox="0 0 180 180" fill="none" className="w-full h-full">
        <mask
          height="180"
          id="next-mask"
          maskUnits="userSpaceOnUse"
          style={{ maskType: "alpha" }}
          width="180"
          x="0"
          y="0"
        >
          <circle cx="90" cy="90" fill="black" r="90" />
        </mask>
        <g mask="url(#next-mask)">
          <path
            d="M149.508 157.52L69.142 54H54V125.97H66.1136V69.3836L139.999 164.845C143.333 162.614 146.509 160.165 149.508 157.52Z"
            fill="url(#paint0_linear)"
          />
          <rect fill="url(#paint1_linear)" height="72" width="12" x="115" y="54" />
        </g>
        <defs>
          <linearGradient
            gradientUnits="userSpaceOnUse"
            id="paint0_linear"
            x1="109"
            x2="144.5"
            y1="116.5"
            y2="160.5"
          >
            <stop stopColor="white" />
            <stop offset="1" stopColor="white" stopOpacity="0" />
          </linearGradient>
          <linearGradient
            gradientUnits="userSpaceOnUse"
            id="paint1_linear"
            x1="121"
            x2="120.799"
            y1="54"
            y2="106.875"
          >
            <stop stopColor="white" />
            <stop offset="1" stopColor="white" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

export function DockerLogo({ className = "w-14 h-14" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <svg
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-xs"
      >
        {/* Whale Body */}
        <path
          d="M44.5 24.5C43 23 40.5 23 38.5 24.2C36.8 21.5 33.5 20.2 29.5 20.2C28.2 20.2 27 20.4 25.8 20.8V17H21.5V22.2C20.8 22.5 20.2 23 19.5 23.5H7.5C5.8 23.5 4.5 24.8 4.5 26.5C4.5 32.5 9 37.5 17.5 37.5C27 37.5 35 34.5 39.5 28C41.8 28.5 44.5 27.5 45.5 25.5C45.8 25 45.2 24.2 44.5 24.5Z"
          fill="#2496ED"
        />
        {/* Eye */}
        <circle cx="10" cy="27.5" r="1" fill="#0A3C6B" />
        {/* Containers on back */}
        {/* Row 1 */}
        <rect x="19" y="16.5" width="4.5" height="4" rx="0.5" fill="#007ACC" stroke="#FFFFFF" strokeWidth="0.75" />
        <rect x="24.5" y="16.5" width="4.5" height="4" rx="0.5" fill="#0088CC" stroke="#FFFFFF" strokeWidth="0.75" />
        <rect x="30" y="16.5" width="4.5" height="4" rx="0.5" fill="#0099DD" stroke="#FFFFFF" strokeWidth="0.75" />
        {/* Row 2 */}
        <rect x="13.5" y="11.5" width="4.5" height="4" rx="0.5" fill="#007ACC" stroke="#FFFFFF" strokeWidth="0.75" />
        <rect x="19" y="11.5" width="4.5" height="4" rx="0.5" fill="#0088CC" stroke="#FFFFFF" strokeWidth="0.75" />
        <rect x="24.5" y="11.5" width="4.5" height="4" rx="0.5" fill="#0099DD" stroke="#FFFFFF" strokeWidth="0.75" />
        <rect x="30" y="11.5" width="4.5" height="4" rx="0.5" fill="#00A8EE" stroke="#FFFFFF" strokeWidth="0.75" />
        {/* Row 3 */}
        <rect x="19" y="6.5" width="4.5" height="4" rx="0.5" fill="#0099DD" stroke="#FFFFFF" strokeWidth="0.75" />
        <rect x="24.5" y="6.5" width="4.5" height="4" rx="0.5" fill="#00A8EE" stroke="#FFFFFF" strokeWidth="0.75" />
      </svg>
    </div>
  );
}

export function TypeScriptLogo({ className = "w-14 h-14" }: { className?: string }) {
  return (
    <div
      className={`rounded-2xl bg-[#3178C6] flex items-center justify-center text-white shadow-sm font-sans font-bold text-2xl tracking-tight p-2 ${className}`}
    >
      TS
    </div>
  );
}

// Learning Outcome Outline Icons
export function OutcomeLayersIcon({ size = 32, className = "", ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M16 4L4 10L16 16L28 10L16 4Z" />
      <path d="M4 16L16 22L28 16" />
      <path d="M4 22L16 28L28 22" />
    </svg>
  );
}

export function OutcomeDatabaseIcon({ size = 32, className = "", ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <ellipse cx="16" cy="8" rx="10" ry="4" />
      <path d="M6 8V16C6 18.2 10.5 20 16 20C21.5 20 26 18.2 26 16V8" />
      <path d="M6 16V24C6 26.2 10.5 28 16 28C21.5 28 26 26.2 26 24V16" />
    </svg>
  );
}

export function OutcomeGaugeIcon({ size = 32, className = "", ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M16 6C9.37 6 4 11.37 4 18C4 21.6 5.6 24.8 8.1 27" />
      <path d="M23.9 27C26.4 24.8 28 21.6 28 18C28 11.37 22.63 6 16 6Z" />
      <path d="M16 18L21 13" />
      <circle cx="16" cy="18" r="2" />
      <path d="M7.5 12.5L9 14" />
      <path d="M16 6V8" />
      <path d="M24.5 12.5L23 14" />
    </svg>
  );
}

export function OutcomeCloudIcon({ size = 32, className = "", ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M24 24H9C6.24 24 4 21.76 4 19C4 16.42 5.95 14.3 8.48 14.04C9.25 9.48 13.22 6 18 6C22.42 6 26.15 9.17 26.88 13.43C28.66 14.31 29.9 16.14 29.9 18.25C29.9 21.43 27.28 24 24 24Z" />
    </svg>
  );
}

export function OutcomeShieldIcon({ size = 32, className = "", ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M16 4L6 8V16C6 22.5 10.3 28.5 16 30C21.7 28.5 26 22.5 26 16V8L16 4Z" />
    </svg>
  );
}

export function OutcomeWorkflowIcon({ size = 32, className = "", ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <rect x="4" y="6" width="7" height="7" rx="1.5" />
      <rect x="21" y="6" width="7" height="7" rx="1.5" />
      <rect x="12.5" y="19" width="7" height="7" rx="1.5" />
      <path d="M11 9.5H21" />
      <path d="M16 9.5V19" />
    </svg>
  );
}

export function OutcomeRocketIcon({ size = 32, className = "", ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M6 26L11 21M9 23L5 27L4 28L5 27L9 23ZM24 4C24 4 19 5 14 10C9.6 14.4 9 19 9 19L13 23C13 23 17.6 22.4 22 18C27 13 28 8 28 8L24 4Z" />
      <circle cx="19" cy="13" r="2" />
    </svg>
  );
}

export function OutcomeCodeIcon({ size = 32, className = "", ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <polyline points="10 10 4 16 10 22" />
      <polyline points="22 10 28 16 22 22" />
      <line x1="18" y1="8" x2="14" y2="24" />
    </svg>
  );
}

export function OutcomeSparklesIcon({ size = 32, className = "", ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M16 4L18.5 11.5L26 14L18.5 16.5L16 24L13.5 16.5L6 14L13.5 11.5L16 4Z" />
      <path d="M25 21L26.2 24.8L30 26L26.2 27.2L25 31L23.8 27.2L20 26L23.8 24.8L25 21Z" />
    </svg>
  );
}

export function OutcomePuzzleIcon({ size = 32, className = "", ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M6 14V8C6 6.9 6.9 6 8 6H14C14 7.7 15.3 9 17 9C18.7 9 20 7.7 20 6H26C27.1 6 28 6.9 28 8V14C26.3 14 25 15.3 25 17C25 18.7 26.3 20 28 20V26C28 27.1 27.1 28 26 28H20C20 26.3 18.7 25 17 25C15.3 25 14 26.3 14 28H8C6.9 28 6 27.1 6 26V20C7.7 20 9 18.7 9 17C9 15.3 7.7 14 6 14Z" />
    </svg>
  );
}


