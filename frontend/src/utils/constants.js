// ── Ticket Status ──
export const TICKET_STATUS = {
  OPEN: "OPEN",
  ASSIGNED: "ASSIGNED",
  IN_PROGRESS: "IN_PROGRESS",
  RESOLVED: "RESOLVED",
  CLOSED: "CLOSED",
};

// ── Ticket Category ──
export const TICKET_CATEGORY = {
  PLUMBING: "PLUMBING",
  ELECTRICAL: "ELECTRICAL",
  HVAC: "HVAC",
  CLEANING: "CLEANING",
  OTHER: "OTHER",
};

// ── Ticket Priority ──
export const TICKET_PRIORITY = {
  LOW: "LOW",
  MEDIUM: "MEDIUM",
  HIGH: "HIGH",
  URGENT: "URGENT",
};

// ── User Roles ──
export const USER_ROLE = {
  TENANT: "TENANT",
  TECHNICIAN: "TECHNICIAN",
  ADMIN: "ADMIN",
};

// ── Role → Home Page mapping ──
export const ROLE_HOME = {
  TENANT: "/app/my-tickets",
  TECHNICIAN: "/app/assigned-tickets",
  ADMIN: "/app/dashboard",
};

// ── Status → Badge color mapping ──
export const STATUS_COLOR = {
  OPEN: { bg: "#FEF3C7", color: "#92400E", dot: "#F59E0B" },
  ASSIGNED: { bg: "#DBEAFE", color: "#1E40AF", dot: "#3B82F6" },
  IN_PROGRESS: { bg: "#EDE9FE", color: "#5B21B6", dot: "#8B5CF6" },
  RESOLVED: { bg: "#D1FAE5", color: "#065F46", dot: "#10B981" },
  CLOSED: { bg: "#E2E8F0", color: "#475569", dot: "#64748B" },
};

// ── Priority → Badge color mapping ──
export const PRIORITY_COLOR = {
  LOW: { bg: "#F1F5F9", color: "#475569" },
  MEDIUM: { bg: "#DBEAFE", color: "#1E40AF" },
  HIGH: { bg: "#FFEDD5", color: "#9A3412" },
  URGENT: { bg: "#FEE2E2", color: "#B91C1C" },
};

// ── Role → Avatar color ──
export const ROLE_AVATAR_COLOR = {
  ADMIN: { bg: "#FF9900", color: "white" },
  TECHNICIAN: { bg: "#3B82F6", color: "white" },
  TENANT: { bg: "#10B981", color: "white" },
};
