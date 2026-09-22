
"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  PanelRightClose,
  PanelRightOpen,
  X,
} from "lucide-react";

import { notify } from "@/lib/toast";
import {
  useGetQuotationByIdQuery,
  useUpdateQuotationStatusMutation,
  useDownloadQuotationPdfMutation,
} from "../../api/quotation.api";
import type { Quotation } from "../../types/quotation.types";
import { QuotationViewHeader } from "./header/quotation-view-header";
import { QuotationPreview } from "./quotation-preview";
import { QuotationSidebar } from "./sidebar/quotation-sidebar";

interface QuotationViewProps {
  id: string;
}

export function QuotationView({ id }: QuotationViewProps) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Keep last successful quotation so refetch never blanks the page
  const stableQuotation = useRef<Quotation | null>(null);

  const {
    data: response,
    isLoading,
    isFetching,
    error: queryError,
  } = useGetQuotationByIdQuery(id, { skip: !id });

  const [updateStatus, { isLoading: statusLoading }] =
    useUpdateQuotationStatusMutation();
  const [downloadPdf, { isLoading: pdfLoading }] =
    useDownloadQuotationPdfMutation();

  const loading = isLoading || isFetching;
  const error = queryError
    ? (queryError as { data?: { message?: string } })?.data?.message ||
      "Failed to fetch quotation"
    : null;

  if (response?.data) {
    stableQuotation.current = response.data;
  }

  const quotation = stableQuotation.current;

  useEffect(() => {
    const mql = window.matchMedia("(min-width: 1024px)");
    setSidebarOpen(mql.matches);
  }, []);

  useEffect(() => {
    if (error && !quotation) {
      notify.error(error);
    }
  }, [error, quotation]);

  const handleDownload = async () => {
    if (!quotation?.id) return;
    try {
      const blob = await downloadPdf(quotation.id).unwrap();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${quotation.quotationNumber || "quotation"}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      notify.success("PDF downloaded");
    } catch (err: unknown) {
      const e = err as { data?: { message?: string }; message?: string };
      notify.error(e?.data?.message || e?.message || "Failed to download PDF");
    }
  };

  const handleStatusChange = async (
    status:
      | "ACCEPTED"
      | "REJECTED"
      | "CANCELLED"
      | "SENT"
      | "FINALIZED"
      | "DRAFT",
    remarks?: string,
  ) => {
    if (!quotation?.id) return;
    try {
      const res = await updateStatus({
        id: quotation.id,
        data: { status, remarks },
      }).unwrap();
      notify.success(res.message || `Status updated to ${status}`);
    } catch (err: unknown) {
      const e = err as { data?: { message?: string }; message?: string };
      notify.error(
        e?.data?.message || e?.message || "Failed to update status",
      );
    }
  };

  // Initial load only
  if (loading && !quotation) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-7 w-7 animate-spin rounded-full border-2 border-slate-300 border-t-slate-600" />
          <p className="text-sm text-gray-500">Loading quotation…</p>
        </div>
      </div>
    );
  }

  if (!quotation) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-gray-50">
        <p className="text-sm text-destructive">Quotation not found</p>
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
      {/* LEFT — main content */}
      <div className="flex min-h-0 min-w-0 flex-1 flex-col ">
        <QuotationViewHeader
          quotation={quotation}
          onOpenSidebar={() => setSidebarOpen(true)}
          onStatusChange={handleStatusChange}
          statusLoading={statusLoading}
          onDownload={handleDownload}
          downloadLoading={pdfLoading}
        />

        <main className="min-h-0 flex-1 overflow-y-auto">
          <QuotationPreview quotation={quotation} />
        </main>
      </div>

      {/* DESKTOP RIGHT SIDEBAR — collapsible, does not use full-page overlay */}
      <div
        className={`relative hidden min-h-full shrink-0 flex-col border-l border-gray-200 bg-white transition-all duration-300 ease-in-out lg:flex ${
          sidebarOpen ? "w-[280px] xl:w-[300px]" : "w-12"
        }`}
      >
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-gray-100 px-3">
          {sidebarOpen && (
            <div className="min-w-0 pl-1">
              <h2 className="truncate text-sm font-semibold text-gray-900">
                Activity
              </h2>
            </div>
          )}
          <button
            type="button"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="ml-auto flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 hover:text-gray-800"
            title={sidebarOpen ? "Collapse" : "Expand"}
          >
            <PanelRightClose
              className={`h-4 w-4 transition-transform duration-300 ease-in-out ${
                sidebarOpen ? "rotate-0" : "rotate-180"
              }`}
            />
          </button>
        </div>

        {sidebarOpen ? (
          <div className="flex-1 overflow-hidden">
            <QuotationSidebar quotation={quotation} />
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="flex flex-1 flex-col items-center justify-center gap-3 py-4 text-gray-400 transition hover:text-gray-600"
          >
            <span className="rotate-180 text-xs font-medium tracking-wide [writing-mode:vertical-rl]">
              Activity
            </span>
          </button>
        )}
      </div>

      {/* MOBILE: backdrop */}
      {sidebarOpen && (
        <div
          className="absolute inset-0 z-40 cursor-pointer bg-black/30 transition-opacity duration-300 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden
        />
      )}

      {/* MOBILE: drawer overlay */}
      <div
        className={`absolute inset-y-0 right-0 z-50 flex w-[300px] flex-col bg-white shadow-xl transition-transform duration-300 ease-in-out sm:w-[340px] lg:hidden ${
          sidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-12 shrink-0 items-center justify-between border-b border-gray-100 px-4">
          <h2 className="text-sm font-semibold text-gray-900">Activity</h2>
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 hover:text-gray-800"
            title="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="flex-1 overflow-hidden">
          <QuotationSidebar quotation={quotation} />
        </div>
      </div>
    </div>
  );
}