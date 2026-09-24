"use client";

import type { InvoiceItem, TaxType } from "../../../types/invoice.types";

function formatCurrency(value: number) {
  return `₹${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function num(v: unknown) {
  return Number(v) || 0;
}

interface InvoiceItemsTableProps {
  items: InvoiceItem[];
  taxType?: TaxType | null;
}

export function InvoiceItemsTable({
  items,
  taxType,
}: InvoiceItemsTableProps) {
  const isInter = taxType === "INTER_STATE";

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full min-w-[640px] border-collapse text-[10px] sm:text-[11px]">
        <thead>
          <tr className="border-t border-slate-800">
            <th className="w-[28px] border-r border-b border-slate-800 px-1 py-1.5 text-center font-medium">
              #
            </th>
            <th className="min-w-[140px] border-r border-b border-slate-800 px-2 py-1.5 text-left font-medium">
              Item
            </th>
            <th className="w-[56px] border-r border-b border-slate-800 px-1 py-1.5 text-center font-medium">
              HSN/SAC
            </th>
            <th className="w-[44px] border-r border-b border-slate-800 px-1 py-1.5 text-center font-medium">
              Qty
            </th>
            <th className="w-[40px] border-r border-b border-slate-800 px-1 py-1.5 text-center font-medium">
              Unit
            </th>
            <th className="w-[72px] border-r border-b border-slate-800 px-1 py-1.5 text-right font-medium">
              Rate
            </th>
            <th className="w-[80px] border-r border-b border-slate-800 px-1 py-1.5 text-right font-medium">
              Amount
            </th>
            {isInter ? (
              <th className="w-[90px] border-r border-b border-slate-800 px-1 py-1.5 text-right font-medium">
                IGST
              </th>
            ) : (
              <>
                <th className="w-[80px] border-r border-b border-slate-800 px-1 py-1.5 text-right font-medium">
                  CGST
                </th>
                <th className="w-[80px] border-r border-b border-slate-800 px-1 py-1.5 text-right font-medium">
                  SGST
                </th>
              </>
            )}
            <th className="w-[84px] border-b border-slate-800 px-1 py-1.5 text-right font-medium">
              Total
            </th>
          </tr>
        </thead>

        <tbody>
          {(items || []).map((item, index) => {
            const qty = num(item.quantity);
            const rate = num(item.rate ?? item.price);
            const discount = num(item.discount);
            const discType = item.discountType || "PERCENTAGE";
            const gross = qty * rate;
            const discAmt =
              discType === "PERCENTAGE"
                ? (gross * discount) / 100
                : Math.min(discount, gross);
            const taxable =
              num(item.amount) || Math.max(0, gross - discAmt);
            const taxRate = num(item.taxRate);

            const cgstRate = num(item.cgstRate) || (isInter ? 0 : taxRate / 2);
            const sgstRate = num(item.sgstRate) || (isInter ? 0 : taxRate / 2);
            const igstRate = num(item.igstRate) || (isInter ? taxRate : 0);
            const cgstAmt =
              num(item.cgstAmount) ||
              (isInter ? 0 : (taxable * cgstRate) / 100);
            const sgstAmt =
              num(item.sgstAmount) ||
              (isInter ? 0 : (taxable * sgstRate) / 100);
            const igstAmt =
              num(item.igstAmount) ||
              (isInter ? (taxable * igstRate) / 100 : 0);
            const lineTotal =
              num(item.total) ||
              taxable + (isInter ? igstAmt : cgstAmt + sgstAmt);

            return (
              <tr key={item.id || index}>
                <td className="border-r border-b border-slate-800 px-1 py-1.5 text-center align-top">
                  {index + 1}.
                </td>
                <td className="border-r border-b border-slate-800 px-2 py-1.5 align-top">
                  <div className="font-semibold text-slate-800">
                    {item.itemName || "—"}
                  </div>
                  {item.description ? (
                    <div className="mt-0.5 leading-[1.4] text-slate-600">
                      {item.description}
                    </div>
                  ) : null}
                </td>
                <td className="border-r border-b border-slate-800 px-1 py-1.5 text-center align-top text-slate-600">
                  {item.hsnSac || "—"}
                </td>
                <td className="border-r border-b border-slate-800 px-1 py-1.5 text-center align-top">
                  {qty}
                </td>
                <td className="border-r border-b border-slate-800 px-1 py-1.5 text-center align-top uppercase">
                  {item.unit || "—"}
                </td>
                <td className="border-r border-b border-slate-800 px-1 py-1.5 text-right align-top tabular-nums">
                  {formatCurrency(rate)}
                </td>
                <td className="border-r border-b border-slate-800 px-1 py-1.5 text-right align-top tabular-nums">
                  {formatCurrency(taxable)}
                </td>
                {isInter ? (
                  <td className="border-r border-b border-slate-800 px-1 py-1.5 text-right align-top tabular-nums">
                    <div>{igstRate}%</div>
                    <div className="text-slate-600">
                      {formatCurrency(igstAmt)}
                    </div>
                  </td>
                ) : (
                  <>
                    <td className="border-r border-b border-slate-800 px-1 py-1.5 text-right align-top tabular-nums">
                      <div>{cgstRate}%</div>
                      <div className="text-slate-600">
                        {formatCurrency(cgstAmt)}
                      </div>
                    </td>
                    <td className="border-r border-b border-slate-800 px-1 py-1.5 text-right align-top tabular-nums">
                      <div>{sgstRate}%</div>
                      <div className="text-slate-600">
                        {formatCurrency(sgstAmt)}
                      </div>
                    </td>
                  </>
                )}
                <td className="border-b border-slate-800 px-1 py-1.5 text-right align-top font-medium tabular-nums">
                  {formatCurrency(lineTotal)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
