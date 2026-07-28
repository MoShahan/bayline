import type { SpotStatus } from "@/src/types";

export const STATUS_LABELS: Record<SpotStatus, string> = {
  available: "Available",
  occupied: "Occupied",
  reserved: "Reserved",
};

export const STATUS_STYLES: Record<
  SpotStatus,
  {
    badge: string;
    card: string;
    accent: string;
    glow: string;
    metric: string;
    metricValue: string;
    icon: string;
  }
> = {
  available: {
    badge:
      "bg-emerald-100 text-emerald-800 ring-1 ring-emerald-200/80 dark:bg-emerald-950/60 dark:text-emerald-300 dark:ring-emerald-800/60",
    card: "border-l-emerald-500 hover:border-l-emerald-400",
    accent: "from-emerald-500/15 via-transparent to-transparent",
    glow: "bg-emerald-500/20",
    metric:
      "border-emerald-200/70 bg-gradient-to-br from-emerald-50 to-white dark:border-emerald-900/50 dark:from-emerald-950/40 dark:to-card",
    metricValue: "text-emerald-700 dark:text-emerald-300",
    icon: "text-emerald-600 dark:text-emerald-400",
  },
  occupied: {
    badge:
      "bg-amber-100 text-amber-900 ring-1 ring-amber-200/80 dark:bg-amber-950/60 dark:text-amber-200 dark:ring-amber-800/60",
    card: "border-l-amber-500 hover:border-l-amber-400",
    accent: "from-amber-500/15 via-transparent to-transparent",
    glow: "bg-amber-500/20",
    metric:
      "border-amber-200/70 bg-gradient-to-br from-amber-50 to-white dark:border-amber-900/50 dark:from-amber-950/40 dark:to-card",
    metricValue: "text-amber-700 dark:text-amber-300",
    icon: "text-amber-600 dark:text-amber-400",
  },
  reserved: {
    badge:
      "bg-sky-100 text-sky-900 ring-1 ring-sky-200/80 dark:bg-sky-950/60 dark:text-sky-200 dark:ring-sky-800/60",
    card: "border-l-sky-500 hover:border-l-sky-400",
    accent: "from-sky-500/15 via-transparent to-transparent",
    glow: "bg-sky-500/20",
    metric:
      "border-sky-200/70 bg-gradient-to-br from-sky-50 to-white dark:border-sky-900/50 dark:from-sky-950/40 dark:to-card",
    metricValue: "text-sky-700 dark:text-sky-300",
    icon: "text-sky-600 dark:text-sky-400",
  },
};
