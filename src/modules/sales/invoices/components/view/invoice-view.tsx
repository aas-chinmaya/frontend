"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PanelRightClose, X } from "lucide-react";

import { notify } from "@/lib/toast";
import {
  useGetInvoiceByIdQuery,
  useUpdateInvoiceStatusMutation,
  useDownloadInvoicePdfMutation,
} from "../../api/invoice.api";
import type { Invoice } from "../../types/invoice.types";
import { InvoiceViewHeader } from "./header/invoice-view-header";
import { InvoicePreview } from "./invoice-preview";
import { InvoiceSidebar } from "./sidebar/invoice-sidebar";

interface InvoiceViewProps {
  id: string;
}

export function InvoiceView({ id }: InvoiceViewProps) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const {
    data: response,
    isLoading,
    isFetching,
    error: queryError,
  } = useGetInvoiceByIdQuery(id, { skip: !id });

  const [updateStatus, { isLoading: statusLoading }] =
    useUpdateInvoiceStatusMutation();
  const [downloadPdf, { isLoading: downloadLoading }] =
    useDownloadInvoicePdfMutation();

  const invoice = response?.data ?? null;
  const loading = isLoading || (isFetching && !invoice);
  const error = queryError
    ? (queryError as { data?: { message?: string } })?.data?.message ||
      "Failed to fetch invoice"
    : null;

  useEffect(() => {
    if (error && !invoice) {
      notify.error(error);
    }
  }, [error, invoice]);

  const handleStatusChange = async (
    status: "PAID" | "OVERDUE" | "CANCELLED" | "SENT" | "FINALIZED",
    statusNote?: string,
  ) => {
    if (!invoice?.id) return;
    try {
      const res = await updateStatus({
        id: invoice.id,
        data: { status, remarks: statusNote },
      }).unwrap();
      notify.success(res.message || `Status updated to ${status}`);
    } catch (err: unknown) {
      const e = err as { data?: { message?: string }; message?: string };
      notify.error(
        e?.data?.message || e?.message || "Failed to update status",
      );
    }
  };

  const handleDownload = async () => {
    if (!invoice?.id) return;
    try {
      const blob = await downloadPdf(invoice.id).unwrap();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${invoice.invoiceNumber || "invoice"}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      notify.success("PDF downloaded");
    } catch (err: unknown) {
      const e = err as { data?: { message?: string }; message?: string };
      notify.error(
        e?.data?.message || e?.message || "Failed to download PDF",
      );
    }
  };

  if (loading && !invoice) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-7 w-7 animate-spin rounded-full border-2 border-slate-300 border-t-slate-600" />
          <p className="text-sm text-gray-500">Loading invoice…</p>
        </div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-gray-50">
        <p className="text-sm text-destructive">Invoice not found</p>
        <button
          type="button"
          onClick={() => router.back()}
          className="text-sm text-primary underline underline-offset-2"
        >
          Go back
        </button>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen w-full overflow-hidden rounded-lg">
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <InvoiceViewHeader
          invoice={invoice}
          onOpenSidebar={() => setSidebarOpen(true)}
          onStatusChange={handleStatusChange}
          onDownload={handleDownload}
          statusLoading={statusLoading}
          downloadLoading={downloadLoading}
        />
        <div className="min-h-0 flex-1 overflow-auto bg-slate-50 p-3 sm:p-4">
          <InvoicePreview invoice={invoice} />
        </div>
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden w-80 shrink-0 border-l border-slate-200 bg-white lg:block">
        <InvoiceSidebar invoice={invoice} />
      </aside>

      {/* Mobile sidebar drawer */}
      {sidebarOpen ? (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            aria-label="Close sidebar"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="absolute right-0 top-0 flex h-full w-[min(100%,20rem)] flex-col bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-3 py-2">
              <span className="text-sm font-medium text-slate-700">Details</span>
              <button
                type="button"
                onClick={() => setSidebarOpen(false)}
                className="rounded p-1 text-slate-500 hover:bg-slate-100"
                aria-label="Close"
              >
                <X className="size-4" />
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-auto">
              <InvoiceSidebar invoice={invoice} />
            </div>
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="flex items-center justify-center gap-2 border-t border-slate-100 py-2 text-sm text-slate-600"
            >
              <PanelRightClose className="size-4" />
              Close
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
