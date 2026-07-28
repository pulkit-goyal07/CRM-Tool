export const LEAD_STATUS_LABELS: Record<string, string> = {
  NEW: "New",
  CONTACTED: "Contacted",
  QUALIFIED: "Qualified",
  DISQUALIFIED: "Disqualified",
  CONVERTED: "Converted",
};

export const LEAD_STATUS_COLORS: Record<string, string> = {
  NEW: "blue",
  CONTACTED: "amber",
  QUALIFIED: "indigo",
  DISQUALIFIED: "red",
  CONVERTED: "green",
};

export const LEAD_SOURCE_LABELS: Record<string, string> = {
  WEB: "Web",
  REFERRAL: "Referral",
  OUTBOUND: "Outbound",
  EVENT: "Event",
  PARTNER: "Partner",
  OTHER: "Other",
};

export const OPPORTUNITY_STAGE_LABELS: Record<string, string> = {
  QUALIFICATION: "Qualification",
  NEEDS_ANALYSIS: "Needs Analysis",
  PROPOSAL: "Proposal",
  NEGOTIATION: "Negotiation",
  CLOSED_WON: "Closed Won",
  CLOSED_LOST: "Closed Lost",
};

export const OPPORTUNITY_STAGE_COLORS: Record<string, string> = {
  QUALIFICATION: "slate",
  NEEDS_ANALYSIS: "blue",
  PROPOSAL: "amber",
  NEGOTIATION: "purple",
  CLOSED_WON: "green",
  CLOSED_LOST: "red",
};

export const OPPORTUNITY_STAGES = Object.keys(
  OPPORTUNITY_STAGE_LABELS
) as (keyof typeof OPPORTUNITY_STAGE_LABELS)[];

export const TASK_STATUS_LABELS: Record<string, string> = {
  OPEN: "Open",
  IN_PROGRESS: "In Progress",
  DONE: "Done",
};

export const TASK_STATUS_COLORS: Record<string, string> = {
  OPEN: "blue",
  IN_PROGRESS: "amber",
  DONE: "green",
};

export const TASK_PRIORITY_LABELS: Record<string, string> = {
  LOW: "Low",
  NORMAL: "Normal",
  HIGH: "High",
};

export const TASK_PRIORITY_COLORS: Record<string, string> = {
  LOW: "slate",
  NORMAL: "blue",
  HIGH: "red",
};

export const ACTIVITY_TYPE_LABELS: Record<string, string> = {
  NOTE: "Note",
  CALL: "Call",
  EMAIL: "Email",
  MEETING: "Meeting",
  TASK: "Task",
  STAGE_CHANGE: "Stage change",
  CONVERSION: "Conversion",
};
