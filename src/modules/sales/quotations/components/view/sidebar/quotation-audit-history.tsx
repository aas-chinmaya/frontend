
"use client";

import {
  CheckCircle2,
  Circle,
  Clock3,
  FileEdit,
  Send,
  XCircle,
} from "lucide-react";

export type QuotationAuditAction =
  | "CREATED"
  | "EDITED"
  | "SENT"
  | "ACCEPTED"
  | "REJECTED"
  | "EXPIRED"
  | "CANCELLED";

export interface QuotationAuditEntry {
  id: string;
  action: QuotationAuditAction;
  user: string;
  createdAt: string;
}

interface QuotationAuditHistoryProps {}

const DUMMY_AUDIT_HISTORY: QuotationAuditEntry[] = [
  {
    id: "audit-8",
    action: "EDITED",
    user: "Chinmaya Das",
    createdAt: "18 Sep 2026, 02:42 PM",
  },
  {
    id: "audit-7",
    action: "SENT",
    user: "Chinmaya Das",
    createdAt: "18 Sep 2026, 01:35 PM",
  },
  {
    id: "audit-6",
    action: "EDITED",
    user: "Chinmaya Das",
    createdAt: "18 Sep 2026, 12:58 PM",
  },
  {
    id: "audit-5",
    action: "ACCEPTED",
    user: "Customer",
    createdAt: "17 Sep 2026, 05:20 PM",
  },
  {
    id: "audit-4",
    action: "EDITED",
    user: "Chinmaya Das",
    createdAt: "17 Sep 2026, 03:12 PM",
  },
  {
    id: "audit-3",
    action: "SENT",
    user: "Chinmaya Das",
    createdAt: "17 Sep 2026, 11:40 AM",
  },
  {
    id: "audit-2",
    action: "EDITED",
    user: "Chinmaya Das",
    createdAt: "16 Sep 2026, 04:25 PM",
  },
  {
    id: "audit-1",
    action: "CREATED",
    user: "Chinmaya Das",
    createdAt: "16 Sep 2026, 10:15 AM",
  },
];

function getActionIcon(action: QuotationAuditAction) {
  switch (action) {
    case "CREATED":
      return Circle;
    case "EDITED":
      return FileEdit;
    case "SENT":
      return Send;
    case "ACCEPTED":
      return CheckCircle2;
    case "REJECTED":
    case "CANCELLED":
      return XCircle;
    case "EXPIRED":
      return Clock3;
    default:
      return Circle;
  }
}

function getActionStyle(action: QuotationAuditAction) {
  switch (action) {
    case "CREATED":
      return "bg-neutral/10 text-neutral";

    case "EDITED":
      return "bg-info/10 text-info";

    case "SENT":
      return "bg-violet/10 text-violet";

    case "ACCEPTED":
      return "bg-success/10 text-success";

    case "REJECTED":
    case "CANCELLED":
      return "bg-danger/10 text-danger";

    case "EXPIRED":
      return "bg-warning/10 text-warning";

    default:
      return "bg-neutral/10 text-neutral";
  }
}

export function QuotationAuditHistory({}: QuotationAuditHistoryProps) {
  return (
    <div className="space-y-1">
      {DUMMY_AUDIT_HISTORY.map((entry, index) => {
        const Icon = getActionIcon(entry.action);
        const isLast = index === DUMMY_AUDIT_HISTORY.length - 1;

        return (
          <div
            key={entry.id}
            className="relative flex gap-3 px-1"
          >
            {!isLast && (
              <span className="absolute bottom-0 left-[15px] top-8 w-px bg-neutral/20" />
            )}

            <div
              className={`relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${getActionStyle(
                entry.action,
              )}`}
            >
              <Icon className="h-3.5 w-3.5" />
            </div>

            <div className="min-w-0 flex-1 pb-4">
              <p className="text-xs font-medium text-text">
                {entry.action}
              </p>

              <p className="mt-1 text-[11px] font-medium text-muted">
                {entry.user}
              </p>

              <p className="mt-0.5 text-[10px] text-muted/70">
                {entry.createdAt}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
