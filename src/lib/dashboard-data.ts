import type { DashboardPayload, DashboardRole } from "@/lib/dashboard-types";

const userDashboard: DashboardPayload = {
  role: "user",
  eyebrow: "Participant hub",
  title: "User Dashboard",
  subtitle: "Track registrations, invites, payments, and accommodation in one place.",
  metrics: [
    { label: "Joined events", value: "4", hint: "Includes event teams" },
    { label: "Pending invites", value: "2", hint: "Awaiting your response" },
    { label: "Payment status", value: "Partial", hint: "Transaction ID submitted" },
    { label: "Accommodation", value: "Saved", hint: "Arrival details stored" }
  ],
  actions: [
    { label: "Join more events", description: "Open event selection and register for available categories.", href: "/events-selection" },
    { label: "Review invites", description: "Accept or reject team invitations from your teammates.", href: "/dashboard#invites" },
    { label: "Update accommodation", description: "Save arrival, departure, and support details.", href: "/accommodation" },
    { label: "Submit payment", description: "Share your transaction ID and follow clearance status.", href: "/dashboard#payment" }
  ],
  sections: [
    {
      title: "What to finish next",
      description: "Keep the registration flow moving without losing track of the remaining steps.",
      items: ["Complete profile details", "Review pending invites", "Submit transaction ID", "Confirm accommodation"]
    },
    {
      title: "Registration rules",
      description: "The dashboard keeps the festival limits visible before you take another action.",
      items: ["Event capacity checks", "Outsider limits", "Team ownership", "Payment clearance"]
    }
  ],
  timeline: [
    { label: "Payment deadline", detail: "Follow the current event timeline before clearance closes." },
    { label: "Invite review", detail: "Respond to pending invites before the team fills up." },
    { label: "Accommodation update", detail: "Adjust arrival details if your travel plan changes." }
  ],
  links: [
    { label: "Event selection", href: "/events-selection", note: "Register for open events" },
    { label: "Team details", href: "/dashboard#teams", note: "See your current teams" },
    { label: "Accommodation", href: "/accommodation", note: "Save logistics details" },
    { label: "Support", href: "/contacts", note: "Read help and contact info" }
  ],
  notice: {
    title: "Participant status",
    description: "Your dashboard is showing the user view. Switch only if you need the development operations panel."
  }
};

const devManagementDashboard: DashboardPayload = {
  role: "dev-management",
  eyebrow: "Restricted operations",
  title: "Dev Management Dashboard",
  subtitle: "Inspect system health, permissions, and operations in a guarded view.",
  metrics: [
    { label: "System checks", value: "12", hint: "Recent maintenance items" },
    { label: "Audit entries", value: "38", hint: "Action trace and safety logs" },
    { label: "Role overrides", value: "3", hint: "Explicitly tracked updates" },
    { label: "Pending approvals", value: "5", hint: "Needs review from ops" }
  ],
  actions: [
    { label: "Review audit logs", description: "Inspect sensitive changes and recent administrative actions.", href: "/admin/dashboard#audit" },
    { label: "Manage permissions", description: "Adjust technical access without mixing it with festival operations.", href: "/admin/dashboard#permissions" },
    { label: "Run safe overrides", description: "Trigger controlled maintenance actions with audit tracking.", href: "/admin/dashboard#overrides" },
    { label: "Open health checks", description: "Verify connections, queues, and current alert state.", href: "/admin/dashboard#health" }
  ],
  sections: [
    {
      title: "System scope",
      description: "The development panel stays separate from festival operations and public admin tools.",
      items: ["Database health", "Role permissions", "Debug tooling", "Safe overrides"]
    },
    {
      title: "What to avoid",
      description: "Dev actions should not be mixed with participant or event-management tasks.",
      items: ["Festival approvals", "Participant support flows", "Operational exports", "Capacity edits"]
    }
  ],
  timeline: [
    { label: "Recent deploy", detail: "Check whether the current build matched the latest environment settings." },
    { label: "Audit summary", detail: "Inspect the latest sensitive changes and override history." },
    { label: "Maintenance window", detail: "Keep a note of scheduled debug or configuration updates." }
  ],
  links: [
    { label: "System settings", href: "/admin/dashboard#settings", note: "Environment and config summary" },
    { label: "Audit logs", href: "/admin/dashboard#audit", note: "Track sensitive changes" },
    { label: "User permissions", href: "/admin/dashboard#permissions", note: "Manage technical roles" },
    { label: "Debug tools", href: "/admin/dashboard#debug", note: "Open development-only utilities" }
  ],
  notice: {
    title: "Development access",
    description: "This view is reserved for development operations. The management panel should stay hidden here."
  }
};

const managementAdminDashboard: DashboardPayload = {
  role: "management-admin",
  eyebrow: "Festival operations",
  title: "Management Admin Dashboard",
  subtitle: "Monitor registrations, payments, accommodations, and event health from one control surface.",
  metrics: [
    { label: "Total participants", value: "1,284", hint: "Across active events" },
    { label: "Pending payments", value: "117", hint: "Awaiting verification" },
    { label: "Accommodation requests", value: "346", hint: "Needs allocation status" },
    { label: "Open moderation tasks", value: "23", hint: "Requires management decision" }
  ],
  actions: [
    { label: "Open payment reports", description: "Review submitted transactions and acknowledgement status.", href: "/admin/payment-data" },
    { label: "Open accommodation reports", description: "Check arrival/departure plans and logistics completeness.", href: "/admin/accommodation-data" },
    { label: "Review event counts", description: "Inspect event-wise team and participant totals.", href: "/admin/count-data" },
    { label: "Manage event operations", description: "Jump to event detail panels for operational controls.", href: "/admin/dashboard" }
  ],
  sections: [
    {
      title: "Operational priorities",
      description: "Keep approvals and event controls moving without breaking rule checks.",
      items: ["Payment acknowledgements", "Accommodation approvals", "Event capacity monitoring", "Pending action queue"]
    },
    {
      title: "Guardrails",
      description: "Management controls should always preserve data integrity and audit traceability.",
      items: ["Role-based access", "Reason-required overrides", "Capacity validation", "Audit-linked updates"]
    }
  ],
  timeline: [
    { label: "Today", detail: "Resolve pending payment and accommodation approvals before report export." },
    { label: "This week", detail: "Review event capacity and waitlist movement for high-demand events." },
    { label: "Deadline window", detail: "Coordinate registration close/open decisions with notifications." }
  ],
  links: [
    { label: "Admin dashboard", href: "/admin/dashboard", note: "Operations overview" },
    { label: "Payment data", href: "/admin/payment-data", note: "Clearance and pending list" },
    { label: "Accommodation data", href: "/admin/accommodation-data", note: "Logistics planning view" },
    { label: "Count data", href: "/admin/count-data", note: "Event and user totals" }
  ],
  notice: {
    title: "Management access",
    description: "This view is for operational administration. Development-only tools should remain outside this panel."
  }
};

export const getDashboardPayload = (role: DashboardRole): DashboardPayload => {
  if (role === "dev-management") {
    return devManagementDashboard;
  }

  if (role === "management-admin") {
    return managementAdminDashboard;
  }

  return userDashboard;
};