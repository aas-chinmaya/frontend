"use client";

import {
  ArrowLeft,
  CheckCircle2,
  ChevronDown,
  Download,
  Edit,
  Loader2,
  Mail,
  MessageCircle,
  PanelRightOpen,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import type {
  Invoice,
  InvoiceStatus,
} from "../../../types/invoice.types";

interface InvoiceViewHeaderProps {
  invoice: Invoice;
  onOpenSidebar: () => void;
  onDownload?: () => void;
  onEmail?: () => void;
  onWhatsApp?: () => void;
  onStatusChange?: (
    status: "PAID" | "OVERDUE" | "CANCELLED" | "SENT" | "FINALIZED",
    statusNote?: string,
  ) => void;
  statusLoading?: boolean;
  downloadLoading?: boolean;
}

const STATUS_CHANGEABLE: InvoiceStatus[] = [
  "DRAFT",
  "FINALIZED",
  "SENT",
  "PARTIALLY_PAID",
];

const NEXT_STATUSES: Record<
  string,
  Array<"SENT" | "PAID" | "OVERDUE" | "CANCELLED" | "FINALIZED">
> = {
  DRAFT: ["FINALIZED", "SENT", "CANCELLED"],
  FINALIZED: ["SENT", "PAID", "OVERDUE", "CANCELLED"],
  SENT: ["PAID", "OVERDUE", "CANCELLED"],
  PARTIALLY_PAID: ["PAID", "OVERDUE", "CANCELLED"],
};

function formatStatus(status: string) {
  return status
    .split("_")
    .map((w) => w.charAt(0) + w.slice(1).toLowerCase())
    .join(" ");
}

export function InvoiceViewHeader({
  invoice,
  onOpenSidebar,
  onDownload,
  onEmail,
  onWhatsApp,
  onStatusChange,
  statusLoading,
  downloadLoading,
}: InvoiceViewHeaderProps) {
  const router = useRouter();

  const [sendOpen, setSendOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);

  const statusRef = useRef<HTMLDivElement>(null);
  const sendRef = useRef<HTMLDivElement>(null);

  const canChangeStatus = STATUS_CHANGEABLE.includes(
    invoice.invoiceStatus,
  );
  const canEdit = invoice.invoiceStatus === "DRAFT";
  const nextStatuses = NEXT_STATUSES[invoice.invoiceStatus] ?? [];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (statusRef.current && !statusRef.current.contains(target)) {
        setStatusOpen(false);
      }
      if (sendRef.current && !sendRef.current.contains(target)) {
        setSendOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleEdit = () => {
    if (!canEdit) return;
    router.push(`/sales/invoices/${invoice.id}/edit`);
  };

  const handleStatusChange = (
    status: "PAID" | "OVERDUE" | "CANCELLED" | "SENT" | "FINALIZED",
  ) => {
    if (statusLoading) return;
    setStatusOpen(false);
    onStatusChange?.(status);
  };

  return (
    <header className="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-gray-200 bg-surface px-3 sm:px-5">
      <div className="flex min-w-0 items-center gap-2.5">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
          title="Back to invoices"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>

        <h1 className="min-w-0 truncate text-sm font-semibold text-gray-900 sm:text-[15px]">
          {invoice.invoiceNumber ?? "Invoice"}
        </h1>
      </div>

      <div className="flex shrink-0 items-center gap-1.5">
        {canChangeStatus && (
          <div className="relative" ref={statusRef}>
            <button
              type="button"
              disabled={statusLoading}
              onClick={() => {
                setStatusOpen((open) => !open);
                setSendOpen(false);
              }}
              className="flex h-8 cursor-pointer items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-2.5 text-xs font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-60"
              title="Change invoice status"
            >
              {statusLoading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <CheckCircle2 className="h-3.5 w-3.5 text-success" />
              )}
              <span className="hidden sm:inline">Change Status</span>
              <span className="sm:hidden">Status</span>
              <ChevronDown className="h-3 w-3 text-gray-400" />
            </button>

            {statusOpen && !statusLoading && (
              <div className="absolute right-0 top-full z-50 mt-1.5 w-44 overflow-hidden rounded-lg border border-gray-200 bg-white p-1 shadow-lg">
                {nextStatuses.map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => handleStatusChange(st)}
                    className="flex w-full cursor-pointer items-center gap-2 rounded-md px-2.5 py-2 text-left text-xs font-medium text-gray-700 transition hover:bg-gray-50"
                  >
                    {formatStatus(st)}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="relative" ref={sendRef}>
          <button
            type="button"
            onClick={() => {
              setSendOpen((open) => !open);
              setStatusOpen(false);
            }}
            className="flex h-8 cursor-pointer items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-2.5 text-xs font-medium text-gray-700 transition hover:bg-gray-50"
            title="Send invoice"
          >
            <Mail className="h-3.5 w-3.5 text-info" />
            <span>Send</span>
            <ChevronDown className="h-3 w-3 text-gray-400" />
          </button>

          {sendOpen && (
            <div className="absolute right-0 top-full z-50 mt-1.5 w-40 overflow-hidden rounded-lg border border-gray-200 bg-white p-1 shadow-lg">
              <button
                type="button"
                onClick={() => {
                  setSendOpen(false);
                  onEmail?.();
                }}
                className="flex w-full cursor-pointer items-center gap-2 rounded-md px-2.5 py-2 text-left text-xs font-medium text-gray-700 transition hover:bg-gray-50"
              >
                <Mail className="h-3.5 w-3.5 text-info" />
                Send by Email
              </button>
              <button
                type="button"
                onClick={() => {
                  setSendOpen(false);
                  onWhatsApp?.();
                }}
                className="flex w-full cursor-pointer items-center gap-2 rounded-md px-2.5 py-2 text-left text-xs font-medium text-gray-700 transition hover:bg-gray-50"
              >
                <MessageCircle className="h-3.5 w-3.5 text-success" />
                Send by WhatsApp
              </button>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={onDownload}
          disabled={downloadLoading || !onDownload}
          className="flex h-8 cursor-pointer items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-2.5 text-xs font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-60"
          title="Download PDF"
        >
          {downloadLoading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Download className="h-3.5 w-3.5 text-violet-600" />
          )}
          <span className="hidden sm:inline">
            {downloadLoading ? "Downloading…" : "Download"}
          </span>
        </button>

        {canEdit && (
          <button
            type="button"
            onClick={handleEdit}
            className="flex h-8 cursor-pointer items-center gap-1.5 rounded-lg bg-primary px-2.5 text-xs font-medium text-white transition hover:bg-primary/90"
            title="Edit invoice"
          >
            <Edit className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Edit</span>
          </button>
        )}

        <div className="mx-0.5 h-5 w-px bg-gray-200" />

        <button
          type="button"
          onClick={onOpenSidebar}
          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 lg:hidden"
          title="Activity"
        >
          <PanelRightOpen className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}
