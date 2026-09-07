import { ScanStatus } from "./types";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export interface NavItem {
  title: string;
  href: string;
  icon: string;
  badge?: string;
  badgeVariant?: "default" | "success" | "warning" | "neutral" | "primary" | "aeo";
}

export interface NavGroup {
  groupName: string;
  groupKey: "overview" | "seo" | "aeo" | "system" | string;
  items: NavItem[];
}

export const NAVIGATION_CONFIG: NavGroup[] = [
  {
    groupName: "Overview",
    groupKey: "overview",
    items: [
      {
        title: "Overview",
        href: "/overview",
        icon: "LayoutDashboard",
      },
    ],
  },
  {
    groupName: "SEO Optimization",
    groupKey: "seo",
    items: [
      {
        title: "Dashboard",
        href: "/seo/dashboard",
        icon: "BarChart3",
      },
      {
        title: "Action Center",
        href: "/seo/actions",
        icon: "ListTodo",
        badge: "Actions",
        badgeVariant: "primary",
      },
      {
        title: "Projects",
        href: "/seo/projects",
        icon: "FolderKanban",
      },
      {
        title: "Keywords",
        href: "/seo/keywords",
        icon: "KeyRound",
      },
      {
        title: "Pages",
        href: "/seo/pages",
        icon: "FileText",
      },
      {
        title: "Issues",
        href: "/seo/issues",
        icon: "AlertTriangle",
      },
      {
        title: "Metadata Optimizer",
        href: "/seo/optimize/metadata",
        icon: "Sparkles",
      },
      {
        title: "Technical SEO",
        href: "/seo/technical",
        icon: "Wrench",
      },
      {
        title: "Content",
        href: "/seo/content",
        icon: "BookOpen",
      },
      {
        title: "Links",
        href: "/seo/links",
        icon: "Link2",
      },
      {
        title: "Optimization History",
        href: "/seo/optimization-history",
        icon: "History",
      },
      {
        title: "Reports",
        href: "/seo/reports",
        icon: "FileSpreadsheet",
      },
    ],
  },
  {
    groupName: "AEO Optimization",
    groupKey: "aeo",
    items: [
      {
        title: "Dashboard",
        href: "/aeo/dashboard",
        icon: "Bot",
      },
      {
        title: "Action Center",
        href: "/aeo/actions",
        icon: "ListTodo",
        badge: "Actions",
        badgeVariant: "aeo",
      },
      {
        title: "Projects",
        href: "/aeo/projects",
        icon: "FolderKanban",
      },
      {
        title: "Questions",
        href: "/aeo/questions",
        icon: "HelpCircle",
      },
      {
        title: "Answer Engine",
        href: "/aeo/answer-engine",
        icon: "Cpu",
      },
      {
        title: "Visibility",
        href: "/aeo/visibility",
        icon: "Eye",
      },
      {
        title: "Content Studio",
        href: "/aeo/optimize/content",
        icon: "FileText",
      },
      {
        title: "Entities",
        href: "/aeo/entities",
        icon: "Boxes",
      },
      {
        title: "Citations",
        href: "/aeo/citations",
        icon: "Quote",
      },
      {
        title: "Competitors",
        href: "/aeo/competitors",
        icon: "Users",
      },
      {
        title: "Optimization History",
        href: "/aeo/optimization-history",
        icon: "History",
      },
      {
        title: "Reports",
        href: "/aeo/reports",
        icon: "FileBarChart",
      },
    ],
  },
  {
    groupName: "System",
    groupKey: "system",
    items: [
      {
        title: "Integrations",
        href: "/integrations",
        icon: "Puzzle",
      },
      {
        title: "Settings",
        href: "/settings",
        icon: "Settings",
      },
    ],
  },
];

export const STATUS_CONFIG: Record<
  ScanStatus,
  {
    label: string;
    bgClass: string;
    textClass: string;
    borderClass: string;
    dotClass: string;
  }
> = {
  queued: {
    label: "Queued",
    bgClass: "bg-amber-50 dark:bg-amber-950/50",
    textClass: "text-amber-700 dark:text-amber-300",
    borderClass: "border-amber-200 dark:border-amber-900/60",
    dotClass: "bg-amber-500",
  },
  initializing: {
    label: "Initializing",
    bgClass: "bg-blue-50 dark:bg-blue-950/50",
    textClass: "text-blue-700 dark:text-blue-300",
    borderClass: "border-blue-200 dark:border-blue-900/60",
    dotClass: "bg-blue-500 animate-pulse",
  },
  crawling: {
    label: "Crawling",
    bgClass: "bg-blue-50 dark:bg-blue-950/50",
    textClass: "text-blue-700 dark:text-blue-300",
    borderClass: "border-blue-200 dark:border-blue-900/60",
    dotClass: "bg-blue-600 animate-pulse",
  },
  analyzing: {
    label: "Analyzing",
    bgClass: "bg-purple-50 dark:bg-purple-950/50",
    textClass: "text-purple-700 dark:text-purple-300",
    borderClass: "border-purple-200 dark:border-purple-900/60",
    dotClass: "bg-purple-600 animate-pulse",
  },
  scoring: {
    label: "Scoring",
    bgClass: "bg-indigo-50 dark:bg-indigo-950/50",
    textClass: "text-indigo-700 dark:text-indigo-300",
    borderClass: "border-indigo-200 dark:border-indigo-900/60",
    dotClass: "bg-indigo-600 animate-pulse",
  },
  completed: {
    label: "Completed",
    bgClass: "bg-emerald-50 dark:bg-emerald-950/50",
    textClass: "text-emerald-700 dark:text-emerald-300",
    borderClass: "border-emerald-200 dark:border-emerald-900/60",
    dotClass: "bg-emerald-500",
  },
  failed: {
    label: "Failed",
    bgClass: "bg-rose-50 dark:bg-rose-950/50",
    textClass: "text-rose-700 dark:text-rose-300",
    borderClass: "border-rose-200 dark:border-rose-900/60",
    dotClass: "bg-rose-500",
  },
  cancelled: {
    label: "Cancelled",
    bgClass: "bg-slate-100 dark:bg-slate-800",
    textClass: "text-slate-700 dark:text-slate-300",
    borderClass: "border-slate-300 dark:border-slate-700",
    dotClass: "bg-slate-500",
  },
};
