"use client";

import { InvoiceAuditHistory } from "./invoice-audit-history";
import { InvoiceLinkedDocuments } from "./invoice-linked-documents";
import type { Invoice } from "../../../types/invoice.types";

interface InvoiceSidebarProps {
  invoice: Invoice;
}

export function InvoiceSidebar({ invoice }: InvoiceSidebarProps) {
  return (
    <div className="flex h-full flex-col gap-4 overflow-y-auto p-4">
      <div>
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
          Invoice history
        </h3>
        <InvoiceAuditHistory
          invoiceId={invoice.id}
          invoiceStatus={invoice.invoiceStatus}
        />
      </div>
      <div>
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
          Linked documents
        </h3>
        <InvoiceLinkedDocuments invoiceId={invoice.id} />
      </div>
    </div>
  );
}
