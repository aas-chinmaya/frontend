"use client";

import { Button } from "@/components/ui/button";
import { useFormContext, useWatch } from "react-hook-form";
import type {
  QuotationFormMode,
  QuotationFormValues,
} from "../../types/quotation-form.types";

interface QuotationFormActionsProps {
  mode: QuotationFormMode;
  isSubmitting: boolean;
  readOnly?: boolean;
  onSubmitIntent: (status: "DRAFT" | "FINALIZED") => void;
}

function stripHtml(html: string) {
  return (html || "").replace(/<[^>]+>/g, "").trim();
}

export function QuotationFormActions({
  mode,
  isSubmitting,
  readOnly,
  onSubmitIntent,
}: QuotationFormActionsProps) {
  const {
    formState: { isValid, errors },
    control,
  } = useFormContext<QuotationFormValues>();

  const prospectName = useWatch({ control, name: "prospectName" });
  const quotationDate = useWatch({ control, name: "quotationDate" });
  const validUntil = useWatch({ control, name: "validUntil" });
  const items = useWatch({ control, name: "items" });
  const terms = useWatch({ control, name: "termsAndConditions" });
  const signature = useWatch({ control, name: "signature" });

  const hasItems = Array.isArray(items) && items.length > 0;
  const hasTerms = stripHtml(terms || "").length > 0;
  const hasCustomer = !!(prospectName && String(prospectName).trim());
  const hasDates = !!(quotationDate && validUntil);

  /** Draft: customer, dates, ≥1 item, terms */
  const canSaveDraft =
    !readOnly && hasCustomer && hasDates && hasItems && hasTerms && !isSubmitting;

  /** Finalize: same + signature */
  const canFinalize =
    canSaveDraft && !!(signature && String(signature).trim());

  const primaryLabel =
    mode === "create" ? "Save as draft" : "Update draft";
  const finalizeLabel =
    mode === "create" ? "Finalize quotation" : "Finalize quotation";

  return (
    <div className="sticky bottom-0 z-10 border-t border-slate-200 bg-white/95 px-4 py-3 backdrop-blur sm:px-6">
      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-end">
        {!readOnly ? (
          <>
            <Button
              type="button"
              variant="outline"
              disabled={!canSaveDraft}
              onClick={() => onSubmitIntent("DRAFT")}
              className="w-full sm:w-auto"
            >
              {isSubmitting ? "Saving…" : primaryLabel}
            </Button>
            <Button
              type="button"
              disabled={!canFinalize}
              onClick={() => onSubmitIntent("FINALIZED")}
              className="w-full sm:w-auto"
            >
              {isSubmitting ? "Submitting…" : finalizeLabel}
            </Button>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">
            This quotation is locked and cannot be edited.
          </p>
        )}
      </div>
      {!readOnly && (!canSaveDraft || !canFinalize) ? (
        <p className="mt-2 text-center text-[11px] text-slate-500 sm:text-right">
          {!hasCustomer
            ? "Customer name is required."
            : !hasDates
              ? "Quotation date and valid until are required."
              : !hasItems
                ? "Add at least one item."
                : !hasTerms
                  ? "Terms & conditions are required."
                  : !canFinalize
                    ? "Signature is required to finalize."
                    : null}
        </p>
      ) : null}
    </div>
  );
}
