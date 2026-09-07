type IconProps = {
  className?: string;
};

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.4,
  strokeLinecap: "square" as const,
  strokeLinejoin: "miter" as const,
};

export function IconChip({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <rect x="6" y="6" width="12" height="12" />
      <path d="M9 2v3M12 2v3M15 2v3M9 19v3M12 19v3M15 19v3M2 9h3M2 12h3M2 15h3M19 9h3M19 12h3M19 15h3" />
      <rect x="9.5" y="9.5" width="5" height="5" />
    </svg>
  );
}

export function IconLayers({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <path d="M12 3 2 8l10 5 10-5-10-5Z" />
      <path d="M2 13l10 5 10-5" />
      <path d="M2 16.5 12 21.5l10-5" />
    </svg>
  );
}

export function IconBolt({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <path d="M12.5 2 4 13h6l-1.5 9L20 11h-6l-1.5-9Z" />
    </svg>
  );
}

export function IconGlobe({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <rect x="3" y="3" width="18" height="18" />
      <path d="M3 12h18M12 3c2.5 2.4 3.8 5.6 3.8 9s-1.3 6.6-3.8 9c-2.5-2.4-3.8-5.6-3.8-9S9.5 5.4 12 3Z" />
    </svg>
  );
}

export function IconUsers({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <rect x="4" y="5" width="8" height="8" />
      <path d="M4 19v-2a4 4 0 0 1 4-4h0a4 4 0 0 1 4 4v2" />
      <path d="M16 5.5a3.5 3.5 0 1 1 0 7" />
      <path d="M15 13.2c2.4.4 4 1.8 4 3.8v2" />
    </svg>
  );
}

export function IconPackage({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <path d="M12 2 21 7v10l-9 5-9-5V7l9-5Z" />
      <path d="M3.3 6.8 12 12l8.7-5.2M12 12v9.5" />
    </svg>
  );
}

export function IconGithub({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 1.5A10.5 10.5 0 0 0 1.5 12c0 4.66 3.02 8.61 7.22 10.01.53.1.72-.23.72-.51v-1.98c-2.94.64-3.56-1.25-3.56-1.25-.48-1.22-1.17-1.55-1.17-1.55-.96-.65.07-.64.07-.64 1.06.07 1.62 1.09 1.62 1.09.94 1.62 2.47 1.15 3.07.88.1-.68.37-1.15.67-1.42-2.35-.27-4.82-1.17-4.82-5.22 0-1.15.41-2.09 1.09-2.83-.11-.27-.47-1.36.1-2.83 0 0 .89-.29 2.92 1.08a10.2 10.2 0 0 1 5.32 0c2.03-1.37 2.92-1.08 2.92-1.08.57 1.47.21 2.56.1 2.83.68.74 1.09 1.68 1.09 2.83 0 4.06-2.47 4.95-4.83 5.21.38.33.72.97.72 1.96v2.9c0 .28.19.62.73.51A10.5 10.5 0 0 0 22.5 12 10.5 10.5 0 0 0 12 1.5Z" />
    </svg>
  );
}

export function IconArrowRight({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <path d="M4 12h16M13 5l7 7-7 7" />
    </svg>
  );
}

export function IconCopy({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <rect x="8" y="8" width="12" height="12" />
      <path d="M16 8V4H4v12h4" />
    </svg>
  );
}

export function IconCheck({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <path d="m4 12 6 6L20 6" />
    </svg>
  );
}
