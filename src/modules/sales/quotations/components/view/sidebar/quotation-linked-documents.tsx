
"use client";

import {
  ArrowUpRight,
  FileText,
} from "lucide-react";

export type LinkedDocumentType =
  | "INVOICE"
  | "QUOTATION"
  | "OTHER";

export interface QuotationLinkedDocument {
  id: string;
  type: LinkedDocumentType;
  number: string;
  title: string;
  status?: string;
  createdAt: string;
}

interface QuotationLinkedDocumentsProps {
  quotationId: string;
}

const DUMMY_LINKED_DOCUMENTS: QuotationLinkedDocument[] = [
  {
    id: "doc-001",
    type: "INVOICE",
    number: "INV-2026-0042",
    title: "Invoice",
    status: "PAID",
    createdAt: "18 Sep 2026",
  },
  {
    id: "doc-002",
    type: "QUOTATION",
    number: "QT-2026-0018",
    title: "Previous quotation",
    status: "REJECTED",
    createdAt: "12 Sep 2026",
  },
];

function getDocumentIconClass(
  type: LinkedDocumentType,
) {
  switch (type) {
    case "INVOICE":
      return "bg-blue-50 text-blue-600";

    case "QUOTATION":
      return "bg-violet-50 text-violet-600";

    default:
      return "bg-slate-50 text-slate-600";
  }
}

export function QuotationLinkedDocuments({
  quotationId,
}: QuotationLinkedDocumentsProps) {
  const documents = DUMMY_LINKED_DOCUMENTS;

  return (
    <div className="space-y-2">
      {documents.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-gray-50/50 px-3 py-3">
          <p className="text-xs font-medium text-gray-700">
            No linked documents
          </p>

          <p className="mt-0.5 text-[11px] leading-4 text-gray-500">
            Invoices and other related documents will
            appear here.
          </p>
        </div>
      ) : (
        documents.map((document) => (
          <button
            key={document.id}
            type="button"
            className="group flex w-full cursor-pointer items-center gap-2.5 rounded-lg border border-gray-200 bg-white p-2.5 text-left transition hover:border-gray-300 hover:bg-gray-50"
          >
            <span
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${getDocumentIconClass(
                document.type,
              )}`}
            >
              <FileText className="h-4 w-4" />
            </span>

            <span className="min-w-0 flex-1">
              <span className="flex items-center gap-1.5">
                <span className="truncate text-xs font-semibold text-gray-800">
                  {document.number}
                </span>

                {document.status && (
                  <span className="shrink-0 rounded-full bg-gray-100 px-1.5 py-0.5 text-[9px] font-medium uppercase text-gray-500">
                    {document.status}
                  </span>
                )}
              </span>

              <span className="mt-0.5 block text-[11px] text-gray-500">
                {document.title} · {document.createdAt}
              </span>
            </span>

            <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-gray-300 transition group-hover:text-gray-600" />
          </button>
        ))
      )}
    </div>
  );
}
