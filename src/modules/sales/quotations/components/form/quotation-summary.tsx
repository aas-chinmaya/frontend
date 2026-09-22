

"use client";

import { useFormContext, useWatch } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { RichTextEditor } from "@/components/editor";
import type { QuotationFormValues } from "../../types/quotation-form.types";
import type { TaxType } from "../../types/quotation.types";
import { formatINR, amountInWords } from "../../utils/quotation-form.utils";
import { QuotationSignatureSection } from "./quotation-signature-section";
import { useState } from "react";

export function QuotationSummary() {
  const { control, setValue, watch } =
    useFormContext<QuotationFormValues>();

  const taxType = (useWatch({
    control,
    name: "taxType",
  }) ?? "INTRA_STATE") as TaxType;

  const isInter = taxType === "INTER_STATE";

  const taxableAmount =
    useWatch({ control, name: "taxableAmount" }) ?? 0;

  const discountAmount =
    useWatch({ control, name: "discountAmount" }) ?? 0;

  const cgstAmount =
    useWatch({ control, name: "cgstAmount" }) ?? 0;

  const sgstAmount =
    useWatch({ control, name: "sgstAmount" }) ?? 0;

  const igstAmount =
    useWatch({ control, name: "igstAmount" }) ?? 0;

  const roundOffAmount =
    useWatch({ control, name: "roundOffAmount" }) ?? 0;

  const grandTotal =
    useWatch({ control, name: "grandTotal" }) ?? 0;

  const terms = watch("termsAndConditions") ?? "";
  const notes = watch("notes") ?? "";

  const totalTax = isInter
    ? igstAmount
    : cgstAmount + sgstAmount;

  const [roundOffOn, setRoundOffOn] = useState(true);

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="flex justify-end">
        <div className="w-full max-w-md">
          <h3 className="mb-2 text-right text-sm font-semibold text-slate-800">
            Payment Summary
          </h3>
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <div className="space-y-2.5 text-sm">
              <SumRow
                label="Taxable"
                value={formatINR(taxableAmount)}
              />

              {discountAmount > 0 && (
                <SumRow
                  label="Discount"
                  value={`−${formatINR(discountAmount)}`}
                  muted
                />
              )}

              {isInter ? (
                <SumRow
                  label="IGST"
                  value={formatINR(igstAmount)}
                />
              ) : (
                <>
                  <SumRow
                    label="CGST"
                    value={formatINR(cgstAmount)}
                  />

                  <SumRow
                    label="SGST"
                    value={formatINR(sgstAmount)}
                  />
                </>
              )}

              <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-3">
                <div className="flex items-center gap-2">
                  <span className="text-slate-600">
                    Round off
                  </span>

                  <Switch
                    checked={roundOffOn}
                    onCheckedChange={(value) => {
                      setRoundOffOn(value);

                      if (!value) {
                        setValue(
                          "roundOffAmount",
                          0,
                          { shouldDirty: true },
                        );
                      }
                    }}
                  />
                </div>

                <span className="tabular-nums text-slate-800">
                  {formatINR(
                    roundOffOn ? roundOffAmount : 0,
                  )}
                </span>
              </div>

              <div className="flex items-end justify-between gap-4 border-t border-slate-200 pt-3">
                <span className="text-base font-semibold text-slate-900">
                  Grand total
                </span>

                <span className="text-xl font-semibold tabular-nums text-slate-900">
                  ₹ {formatINR(grandTotal)}
                </span>
              </div>

              <p className="pt-1 text-xs leading-relaxed text-slate-500">
                {amountInWords(grandTotal)}
              </p>

              <div className="border-t border-slate-100 pt-2">
                <p className="text-[11px] text-slate-400">
                  Tax · {isInter ? "IGST" : "CGST + SGST"} ·{" "}
                  {formatINR(totalTax)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Terms and Notes */}
      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-1.5">
          <Label className="text-sm text-slate-600">
            Terms & conditions <span className="text-red-500">*</span>
          </Label>

          <div className="w-full rounded-md border border-slate-200 bg-white [&_.ProseMirror]:min-h-[56px] [&_.ProseMirror]:max-h-[120px] [&_.ProseMirror]:overflow-y-auto [&_.ProseMirror]:px-3 [&_.ProseMirror]:py-2 [&_.ProseMirror]:outline-none">
            <RichTextEditor
              value={terms}
              onChange={(value) =>
                setValue(
                  "termsAndConditions",
                  value,
                  { shouldDirty: true, shouldValidate: true },
                )
              }
              placeholder="Payment terms, delivery, validity…"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm text-slate-600">
            Internal notes
          </Label>

          <div className="w-full rounded-md border border-slate-200 bg-white [&_.ProseMirror]:min-h-[48px] [&_.ProseMirror]:max-h-[100px] [&_.ProseMirror]:overflow-y-auto [&_.ProseMirror]:px-3 [&_.ProseMirror]:py-2 [&_.ProseMirror]:outline-none">
            <RichTextEditor
              value={notes}
              onChange={(value) =>
                setValue(
                  "notes",
                  value,
                  { shouldDirty: true },
                )
              }
              placeholder="Internal only…"
            />
          </div>
        </div>
      </div>

      {/* Signature */}
      <div className="border-t border-slate-100 pt-5">
        <QuotationSignatureSection />
      </div>
    </div>
  );
}

function SumRow({
  label,
  value,
  muted,
}: {
  label: string;
  value: string;
  muted?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span
        className={
          muted ? "text-slate-400" : "text-slate-600"
        }
      >
        {label}
      </span>

      <span className="tabular-nums text-slate-800">
        {value}
      </span>
    </div>
  );
}