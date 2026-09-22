
// "use client";

// import {
//   ArrowLeft,
//   CheckCircle2,
//   ChevronDown,
//   Download,
//   Edit,
//   Loader2,
//   Mail,
//   MessageCircle,
//   PanelRightOpen,
// } from "lucide-react";
// import { useRouter } from "next/navigation";
// import { useState } from "react";

// import type {
//   Quotation,
//   QuotationStatus,
// } from "../../../types/quotation.types";

// interface QuotationViewHeaderProps {
//   quotation: Quotation;
//   onOpenSidebar: () => void;
//   onDownload?: () => void;
//   onEmail?: () => void;
//   onWhatsApp?: () => void;
//   onStatusChange?: (
//     status:
//       | "ACCEPTED"
//       | "REJECTED"
//       | "CANCELLED"
//       | "SENT"
//       | "FINALIZED"
//       | "DRAFT",
//     remarks?: string,
//   ) => void;
//   statusLoading?: boolean;
//   downloadLoading?: boolean;
// }

// const STATUS_CHANGEABLE: QuotationStatus[] = ["DRAFT", "FINALIZED", "SENT"];

// const NEXT_STATUSES: Record<
//   string,
//   Array<"SENT" | "ACCEPTED" | "REJECTED" | "CANCELLED" | "FINALIZED">
// > = {
//   DRAFT: ["FINALIZED", "SENT", "CANCELLED"],
//   FINALIZED: ["SENT", "ACCEPTED", "REJECTED", "CANCELLED"],
//   SENT: ["ACCEPTED", "REJECTED", "CANCELLED"],
// };

// export function QuotationViewHeader({
//   quotation,
//   onOpenSidebar,
//   onDownload,
//   onEmail,
//   onWhatsApp,
//   onStatusChange,
//   statusLoading,
//   downloadLoading,
// }: QuotationViewHeaderProps) {
//   const router = useRouter();
//   const [sendOpen, setSendOpen] = useState(false);
//   const [statusOpen, setStatusOpen] = useState(false);

//   const canChangeStatus = STATUS_CHANGEABLE.includes(
//     quotation.quotationStatus,
//   );
//   const canEdit = quotation.quotationStatus === "DRAFT";
//   const nextStatuses = NEXT_STATUSES[quotation.quotationStatus] ?? [];

//   const handleEdit = () => {
//     if (!canEdit) return;
//     router.push(`/sales/quotation/${quotation.id}/edit`);
//   };

//   const handleStatusChange = (
//     status:
//       | "ACCEPTED"
//       | "REJECTED"
//       | "CANCELLED"
//       | "SENT"
//       | "FINALIZED"
//       | "DRAFT",
//   ) => {
//     if (statusLoading) return;
//     setStatusOpen(false);
//     onStatusChange?.(status);
//   };

//   return (
//     <header className="flex h-14  shrink-0 items-center justify-between gap-3 border-b border-gray-200 bg-surface px-3 sm:px-5">
//       <div className="flex min-w-0 items-center gap-2.5">
//         <button
//           type="button"
//           onClick={() => router.back()}
//           className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
//           title="Back to quotations"
//         >
//           <ArrowLeft className="h-4 w-4" />
//         </button>

//         <h1 className="min-w-0 truncate text-sm font-semibold text-gray-900 sm:text-[15px]">
//           {quotation.quotationNumber ?? "Quotation"}
//         </h1>
//       </div>

//       <div className="flex shrink-0 items-center gap-1.5">
//         {canChangeStatus && (
//           <div
//             className="relative"
//             onMouseLeave={() => setStatusOpen(false)}
//           >
//             <button
//               type="button"
//               disabled={statusLoading}
//               onClick={() => {
//                 setStatusOpen((open) => !open);
//                 setSendOpen(false);
//               }}
//               className="flex h-8 cursor-pointer items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-2.5 text-xs font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-60"
//               title="Change quotation status"
//             >
//               {statusLoading ? (
//                 <Loader2 className="h-3.5 w-3.5 animate-spin" />
//               ) : (
//                 <CheckCircle2 className="h-3.5 w-3.5 text-success" />
//               )}
//               <span className="hidden sm:inline">Change Status</span>
//               <span className="sm:hidden">Status</span>
//               <ChevronDown className="h-3 w-3 text-gray-400" />
//             </button>

//             {statusOpen && !statusLoading && (
//               <div className="absolute right-0 top-full z-50 mt-1.5 w-44 overflow-hidden rounded-lg border border-gray-200 bg-white p-1 shadow-lg">
//                 {nextStatuses.map((st) => (
//                   <button
//                     key={st}
//                     type="button"
//                     onClick={() => handleStatusChange(st)}
//                     className="flex w-full cursor-pointer items-center gap-2 rounded-md px-2.5 py-2 text-left text-xs font-medium text-gray-700 transition hover:bg-gray-50"
//                   >
//                     {st.charAt(0) + st.slice(1).toLowerCase()}
//                   </button>
//                 ))}
//               </div>
//             )}
//           </div>
//         )}

//         <div
//           className="relative"
//           onMouseLeave={() => setSendOpen(false)}
//         >
//           <button
//             type="button"
//             onClick={() => {
//               setSendOpen((open) => !open);
//               setStatusOpen(false);
//             }}
//             className="flex h-8 cursor-pointer items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-2.5 text-xs font-medium text-gray-700 transition hover:bg-gray-50"
//             title="Send quotation"
//           >
//             <Mail className="h-3.5 w-3.5 text-info" />
//             <span>Send</span>
//             <ChevronDown className="h-3 w-3 text-gray-400" />
//           </button>

//           {sendOpen && (
//             <div className="absolute right-0 top-full z-50 mt-1.5 w-40 overflow-hidden rounded-lg border border-gray-200 bg-white p-1 shadow-lg">
//               <button
//                 type="button"
//                 onClick={() => {
//                   setSendOpen(false);
//                   onEmail?.();
//                 }}
//                 className="flex w-full cursor-pointer items-center gap-2 rounded-md px-2.5 py-2 text-left text-xs font-medium text-gray-700 transition hover:bg-gray-50"
//               >
//                 <Mail className="h-3.5 w-3.5 text-info" />
//                 Send by Email
//               </button>
//               <button
//                 type="button"
//                 onClick={() => {
//                   setSendOpen(false);
//                   onWhatsApp?.();
//                 }}
//                 className="flex w-full cursor-pointer items-center gap-2 rounded-md px-2.5 py-2 text-left text-xs font-medium text-gray-700 transition hover:bg-gray-50"
//               >
//                 <MessageCircle className="h-3.5 w-3.5 text-success" />
//                 Send by WhatsApp
//               </button>
//             </div>
//           )}
//         </div>

//         <button
//           type="button"
//           onClick={onDownload}
//           disabled={downloadLoading}
//           className="flex h-8 cursor-pointer items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-2.5 text-xs font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-60"
//           title="Download PDF"
//         >
//           {downloadLoading ? (
//             <Loader2 className="h-3.5 w-3.5 animate-spin text-violet" />
//           ) : (
//             <Download className="h-3.5 w-3.5 text-violet" />
//           )}
//           <span className="hidden sm:inline">
//             {downloadLoading ? "Downloading…" : "Download"}
//           </span>
//         </button>

//         {canEdit && (
//           <button
//             type="button"
//             onClick={handleEdit}
//             className="flex h-8 cursor-pointer items-center gap-1.5 rounded-lg bg-primary px-2.5 text-xs font-medium text-white transition hover:bg-primary/90"
//             title="Edit quotation"
//           >
//             <Edit className="h-3.5 w-3.5" />
//             <span className="hidden sm:inline">Edit</span>
//           </button>
//         )}

//         <div className="mx-0.5 h-5 w-px bg-gray-200" />

//         <button
//           type="button"
//           onClick={onOpenSidebar}
//           className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 lg:hidden"
//           title="Activity"
//         >
//           <PanelRightOpen className="h-4 w-4" />
//         </button>
//       </div>
//     </header>
//   );
// }




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
  Quotation,
  QuotationStatus,
} from "../../../types/quotation.types";

interface QuotationViewHeaderProps {
  quotation: Quotation;
  onOpenSidebar: () => void;
  onDownload?: () => void;
  onEmail?: () => void;
  onWhatsApp?: () => void;
  onStatusChange?: (
    status: "ACCEPTED" | "REJECTED",
    statusNote: string,
  ) => void;
  statusLoading?: boolean;
  downloadLoading?: boolean;
}

const STATUS_CHANGEABLE: QuotationStatus[] = ["SENT"];

const NEXT_STATUSES: Record<
  string,
  Array<"ACCEPTED" | "REJECTED">
> = {
  SENT: ["ACCEPTED", "REJECTED"],
};

const STATUS_STYLES: Record<
  "ACCEPTED" | "REJECTED",
  {
    dot: string;
    text: string;
    bg: string;
  }
> = {
  ACCEPTED: {
    dot: "bg-emerald-500",
    text: "text-emerald-700",
    bg: "bg-emerald-50",
  },
  REJECTED: {
    dot: "bg-red-500",
    text: "text-red-700",
    bg: "bg-red-50",
  },
};

function formatStatus(status: string) {
  return status.charAt(0) + status.slice(1).toLowerCase();
}

export function QuotationViewHeader({
  quotation,
  onOpenSidebar,
  onDownload,
  onEmail,
  onWhatsApp,
  onStatusChange,
  statusLoading,
  downloadLoading,
}: QuotationViewHeaderProps) {
  const router = useRouter();

  const [sendOpen, setSendOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);

  const statusRef = useRef<HTMLDivElement>(null);
  const sendRef = useRef<HTMLDivElement>(null);

  const canChangeStatus = STATUS_CHANGEABLE.includes(
    quotation.quotationStatus,
  );

  const canEdit = quotation.quotationStatus === "DRAFT";

  const nextStatuses =
    NEXT_STATUSES[quotation.quotationStatus] ?? [];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (
        statusRef.current &&
        !statusRef.current.contains(target)
      ) {
        setStatusOpen(false);
      }

      if (
        sendRef.current &&
        !sendRef.current.contains(target)
      ) {
        setSendOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside,
      );
    };
  }, []);

  const handleEdit = () => {
    if (!canEdit) return;

    router.push(`/sales/quotations/${quotation.id}/edit`);
  };

  const handleStatusChange = (
    status: "ACCEPTED" | "REJECTED",
  ) => {
    if (statusLoading) return;

    setStatusOpen(false);

    const statusNote =
      status === "ACCEPTED"
        ? "Quotation accepted"
        : "Quotation rejected";

    onStatusChange?.(status, statusNote);
  };

  return (
    <header className="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-gray-200 bg-surface px-3 sm:px-5">
      {/* Left */}
      <div className="flex min-w-0 items-center gap-2.5">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
          title="Back to quotations"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>

        <h1 className="min-w-0 truncate text-sm font-semibold text-gray-900 sm:text-[15px]">
          {quotation.quotationNumber ?? "Quotation"}
        </h1>
      </div>

      {/* Right */}
      <div className="flex shrink-0 items-center gap-1.5">
        {/* Status */}
        {canChangeStatus && (
          <div
            ref={statusRef}
            className="relative"
          >
            <button
              type="button"
              disabled={statusLoading}
              onClick={() => {
                setStatusOpen((open) => !open);
                setSendOpen(false);
              }}
              className="flex h-8 cursor-pointer items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-2.5 text-xs font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
              title="Change quotation status"
            >
              {statusLoading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <CheckCircle2 className="h-3.5 w-3.5 text-success" />
              )}

              <span className="hidden sm:inline">
                Change Status
              </span>

              <span className="sm:hidden">
                Status
              </span>

              <ChevronDown
                className={`h-3 w-3 text-gray-400 transition-transform duration-150 ${
                  statusOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {statusOpen && !statusLoading && (
              <div className="absolute right-0 top-full z-50 mt-2 w-48 rounded-xl border border-gray-200 bg-white p-1.5 shadow-xl">
                <div className="px-2.5 pb-1.5 pt-1 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                  Change status
                </div>

                {nextStatuses.map((status) => {
                  const style = STATUS_STYLES[status];

                  return (
                    <button
                      key={status}
                      type="button"
                      onClick={() =>
                        handleStatusChange(status)
                      }
                      className="flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2.5 text-left transition hover:bg-gray-50"
                    >
                      <span
                        className={`h-2 w-2 shrink-0 rounded-full ${style.dot}`}
                      />

                      <span
                        className={`text-xs font-medium ${style.text}`}
                      >
                        {formatStatus(status)}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Send */}
        <div
          ref={sendRef}
          className="relative"
        >
          <button
            type="button"
            onClick={() => {
              setSendOpen((open) => !open);
              setStatusOpen(false);
            }}
            className="flex h-8 cursor-pointer items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-2.5 text-xs font-medium text-gray-700 transition hover:bg-gray-50"
            title="Send quotation"
          >
            <Mail className="h-3.5 w-3.5 text-info" />

            <span>Send</span>

            <ChevronDown className="h-3 w-3 text-gray-400" />
          </button>

          {sendOpen && (
            <div className="absolute right-0 top-full z-50 mt-2 w-40 rounded-xl border border-gray-200 bg-white p-1.5 shadow-xl">
              <button
                type="button"
                onClick={() => {
                  setSendOpen(false);
                  onEmail?.();
                }}
                className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs font-medium text-gray-700 transition hover:bg-gray-50"
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
                className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs font-medium text-gray-700 transition hover:bg-gray-50"
              >
                <MessageCircle className="h-3.5 w-3.5 text-success" />
                Send by WhatsApp
              </button>
            </div>
          )}
        </div>

        {/* Download */}
        <button
          type="button"
          onClick={onDownload}
          disabled={downloadLoading}
          className="flex h-8 cursor-pointer items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-2.5 text-xs font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
          title="Download PDF"
        >
          {downloadLoading ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin text-violet" />
          ) : (
            <Download className="h-3.5 w-3.5 text-violet" />
          )}

          <span className="hidden sm:inline">
            {downloadLoading ? "Downloading…" : "Download"}
          </span>
        </button>

        {/* Edit */}
        {canEdit && (
          <button
            type="button"
            onClick={handleEdit}
            className="flex h-8 cursor-pointer items-center gap-1.5 rounded-lg bg-primary px-2.5 text-xs font-medium text-white transition hover:bg-primary/90"
            title="Edit quotation"
          >
            <Edit className="h-3.5 w-3.5" />

            <span className="hidden sm:inline">
              Edit
            </span>
          </button>
        )}

        <div className="mx-0.5 h-5 w-px bg-gray-200" />

        {/* Activity */}
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
