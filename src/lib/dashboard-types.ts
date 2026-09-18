export type DashboardRole = "user" | "management-admin" | "dev-management";

export interface DashboardMetric {
  label: string;
  value: string;
  hint: string;
}

export interface DashboardAction {
  label: string;
  description: string;
  href: string;
}

export interface DashboardSection {
  title: string;
  description: string;
  items: string[];
}

export interface DashboardTimelineItem {
  label: string;
  detail: string;
}

export interface DashboardLink {
  label: string;
  href: string;
  note: string;
}

export interface DashboardNotice {
  title: string;
  description: string;
}

export interface DashboardPayload {
  role: DashboardRole;
  eyebrow: string;
  title: string;
  subtitle: string;
  metrics: DashboardMetric[];
  actions: DashboardAction[];
  sections: DashboardSection[];
  timeline: DashboardTimelineItem[];
  links: DashboardLink[];
  notice: DashboardNotice;
}