

"use client";

import { useFieldArray, useFormContext, useWatch } from "react-hook-form";
import type { QuotationFormValues } from "../../types/quotation-form.types";
import { QuotationItemRow } from "./quotation-item-row";
import {
  emptyLineItem,
  formatINR,
  amountInWords,
} from "../../utils/quotation-form.utils";
import type { TaxType, DiscountType } from "../../types/quotation.types";
import { useState } from "react";

export function QuotationItemsSection() {
  const {
    control,
    setValue,
    formState: { errors },
  } = useFormContext<QuotationFormValues>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const taxType = (useWatch({ control, name: "taxType" }) ??
    "INTRA_STATE") as TaxType;
  const isInter = taxType === "INTER_STATE";

  const [globalDiscType, setGlobalDiscType] =
    useState<DiscountType>("PERCENTAGE");

  const totalQuantity = useWatch({ control, name: "totalQuantity" }) ?? 0;
  const taxableAmount = useWatch({ control, name: "taxableAmount" }) ?? 0;
  const discountAmount = useWatch({ control, name: "discountAmount" }) ?? 0;
  const cgstAmount = useWatch({ control, name: "cgstAmount" }) ?? 0;
  const sgstAmount = useWatch({ control, name: "sgstAmount" }) ?? 0;
  const igstAmount = useWatch({ control, name: "igstAmount" }) ?? 0;
  const grandTotal = useWatch({ control, name: "grandTotal" }) ?? 0;

  const grossSum = taxableAmount + discountAmount;

  const applyGlobalDiscType = (type: DiscountType) => {
    setGlobalDiscType(type);
    fields.forEach((_, i) => {
      setValue(`items.${i}.discountType`, type, { shouldDirty: true });
    });
  };

  const addLine = () => {
    append({ ...emptyLineItem(), discountType: globalDiscType, quantity: 0 });
  };

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold text-slate-800">Items</h3>
          <p className="text-xs text-slate-500">
            Tax · updates live
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Discount</span>
          <div className="inline-flex rounded-full border border-slate-200 p-0.5">
            <button
              type="button"
              onClick={() => applyGlobalDiscType("FIXED")}
              className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                globalDiscType === "FIXED"
                  ? "bg-primary text-white"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              ₹
            </button>
            <button
              type="button"
              onClick={() => applyGlobalDiscType("PERCENTAGE")}
              className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                globalDiscType === "PERCENTAGE"
                  ? "bg-primary text-white"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              %
            </button>
          </div>
        </div>
      </div>

      {errors.items && typeof errors.items.message === "string" && (
        <p className="mb-2 text-xs text-red-500">{errors.items.message}</p>
      )}

      {/* Horizontal scroll only — overflow-y visible so item search can open fully */}
      <div className="overflow-x-auto rounded-md border border-slate-200 bg-white">
        <table className="w-full min-w-[720px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-medium uppercase tracking-wide text-slate-500">
              <th className="w-10 px-2 py-2.5 text-left">#</th>
              <th className="min-w-[180px] px-2 py-2.5 text-left">Item</th>
              <th className="w-20 px-2 py-2.5 text-center">Qty</th>
              <th className="hidden w-14 px-1 py-2 text-center sm:table-cell">UOM</th>
              <th className="w-28 px-2 py-2.5 text-right">Price</th>
              <th className="w-28 px-2 py-2.5 text-center">Disc</th>
              <th className="w-20 px-1 py-2 text-center sm:w-24 sm:px-2">
                Tax
              </th>
              <th className="w-28 px-2 py-2.5 text-right">Total</th>
              <th className="w-16 px-1 py-2.5 text-center" />
            </tr>
          </thead>
          <tbody>
            {fields.map((field, index) => (
              <QuotationItemRow
                key={field.id}
                index={index}
                onRemove={() => remove(index)}
                onAdd={addLine}
                canRemove={fields.length > 1}
                taxType={taxType}
              />
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-amber-200 bg-amber-50 text-sm font-semibold text-slate-800">
              <td colSpan={2} className="px-3 py-2.5 text-right text-amber-900">
                Total
              </td>
              <td className="px-2 py-2.5 text-center tabular-nums">
                {formatINR(totalQuantity)}
              </td>
              <td />
              <td className="px-2 py-2.5 text-right tabular-nums">
                {formatINR(grossSum)}
              </td>
              <td className="px-2 py-2.5 text-center tabular-nums">
                {formatINR(discountAmount)}
              </td>
              <td className="px-1 py-2 text-center text-xs tabular-nums sm:px-2 sm:text-sm">
                {isInter
                  ? formatINR(igstAmount)
                  : formatINR(cgstAmount + sgstAmount)}
              </td>
              <td className="px-2 py-2.5 text-right tabular-nums">
                {formatINR(grandTotal)}
              </td>
              <td />
            </tr>
          </tfoot>
        </table>
      </div>

      <p className="mt-2 text-xs text-slate-500">{amountInWords(grandTotal)}</p>
    </div>
  );
}