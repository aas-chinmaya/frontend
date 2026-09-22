"use client";

interface QuotationTermsProps {
  termsAndConditions?: string | null;
  notes?: string | null;
}

export function QuotationTerms({
  termsAndConditions,
  notes,
}: QuotationTermsProps) {
  if (!termsAndConditions && !notes) return null;

  return (
    <div className="mt-3 space-y-3 border border-slate-800 p-2 text-[10px] text-slate-700 sm:mt-4 sm:p-3 sm:text-[11px]">
      {termsAndConditions && (
        <div>
          <div className="mb-1 font-semibold text-slate-800">
            Terms & Conditions
          </div>
          <div
            className="prose prose-sm max-w-none text-[10px] leading-relaxed sm:text-[11px]"
            dangerouslySetInnerHTML={{ __html: termsAndConditions }}
          />
        </div>
      )}
      {notes && (
        <div>
          <div className="mb-1 font-semibold text-slate-800">Notes</div>
          <div
            className="prose prose-sm max-w-none text-[10px] leading-relaxed sm:text-[11px]"
            dangerouslySetInnerHTML={{ __html: notes }}
          />
        </div>
      )}
    </div>
  );
}