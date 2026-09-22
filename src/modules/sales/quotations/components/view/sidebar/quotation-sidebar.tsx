
import { ChevronDown, Clock3, FileText } from "lucide-react";
import { useState } from "react";

import type { Quotation } from "../../../types/quotation.types";
import { QuotationAuditHistory } from "./quotation-audit-history";
import { QuotationLinkedDocuments } from "./quotation-linked-documents";

interface QuotationSidebarProps {
  quotation: Quotation;
}

export function QuotationSidebar({
  quotation,
}: QuotationSidebarProps) {
  const [activityOpen, setActivityOpen] = useState(true);

  return (
    <aside className="h-full overflow-y-auto bg-white">
   

      <section className="border-b border-gray-200">
        <button
          type="button"
          onClick={() => setActivityOpen((value) => !value)}
          className="flex w-full cursor-pointer items-center justify-between px-4 py-3.5 text-left hover:bg-gray-50"
        >
          <div className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
              <Clock3 className="h-3.5 w-3.5" />
            </span>

            <div>
              <p className="text-xs font-semibold text-gray-900">
                Activity
              </p>
              <p className="text-[11px] text-gray-500">
                Quotation history
              </p>
            </div>
          </div>

          <ChevronDown
            className={`h-4 w-4 text-gray-400 transition-transform ${
              activityOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {activityOpen && (
          <div className="px-4 pb-4">
            <QuotationAuditHistory
              quotationId={quotation.id}
              quotationStatus={quotation.quotationStatus}
            />
          </div>
        )}
      </section>

      <section className="px-4 py-4">
        <div className="mb-3 flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            <FileText className="h-3.5 w-3.5" />
          </span>

          <div>
            <p className="text-xs font-semibold text-gray-900">
              Linked Documents
            </p>
            <p className="text-[11px] text-gray-500">
              Related documents
            </p>
          </div>
        </div>

        <QuotationLinkedDocuments
          quotationId={quotation.id}
        />
      </section>
    </aside>
  );
}
