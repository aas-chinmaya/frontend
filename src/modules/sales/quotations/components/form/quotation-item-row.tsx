"use client";

import { useFormContext, useWatch } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Minus, Plus } from "lucide-react";
import { useMemo } from "react";
import type { QuotationFormValues } from "../../types/quotation-form.types";
import type { TaxType } from "../../types/quotation.types";
import { calcLine, formatINR } from "../../utils/quotation-form.utils";
import ItemSearchSelect, {
  type SelectedItem,
} from "@/modules/sales/shared/components/item-search-select";

interface Props {
  index: number;
  onRemove: () => void;
  onAdd: () => void;
  canRemove: boolean;
  taxType: TaxType;
}

export function QuotationItemRow({
  index,
  onRemove,
  onAdd,
  canRemove,
  taxType,
}: Props) {
  const {
    register,
    setValue,
    control,
    formState: { errors },
  } = useFormContext<QuotationFormValues>();

  const itemErrors = errors.items?.[index];
  const isInter = taxType === "INTER_STATE";

  const quantity = useWatch({ control, name: `items.${index}.quantity` }) ?? 0;
  const rate = useWatch({ control, name: `items.${index}.rate` }) ?? 0;
  const price = useWatch({ control, name: `items.${index}.price` });
  const discount = useWatch({ control, name: `items.${index}.discount` }) ?? 0;
  const discountType =
    useWatch({ control, name: `items.${index}.discountType` }) ?? "PERCENTAGE";
  const taxRate = useWatch({ control, name: `items.${index}.taxRate` }) ?? 0;
  const itemName = useWatch({ control, name: `items.${index}.itemName` }) ?? "";
  const unit = useWatch({ control, name: `items.${index}.unit` }) ?? "PCS";
  const description =
    useWatch({ control, name: `items.${index}.description` }) ?? "";

  const stockAvailable = useWatch({
    control,
    name: `items.${index}.stockAvailable`,
  }) as number | null | undefined;

  const unitPrice =
    price != null && Number(price) > 0 ? Number(price) : Number(rate) || 0;

  const line = useMemo(
    () =>
      calcLine(
        {
          quantity,
          rate: unitPrice,
          price: unitPrice,
          discount,
          discountType,
          taxRate,
        },
        taxType,
      ),
    [quantity, unitPrice, discount, discountType, taxRate, taxType],
  );

  const applyItem = (item: SelectedItem | null) => {
    if (!item) {
      setValue(`items.${index}.itemId`, null, { shouldDirty: true });
      setValue(`items.${index}.stockAvailable`, null, { shouldDirty: true });
      return;
    }
    setValue(`items.${index}.itemId`, item.id, {
      shouldDirty: true,
      shouldValidate: true,
    });
    setValue(`items.${index}.itemName`, item.name, {
      shouldDirty: true,
      shouldValidate: true,
    });
    setValue(`items.${index}.description`, item.description ?? null, {
      shouldDirty: true,
    });
    setValue(`items.${index}.rate`, item.rate, { shouldDirty: true });
    setValue(`items.${index}.price`, item.rate, { shouldDirty: true });
    setValue(`items.${index}.unit`, item.unit, { shouldDirty: true });
    setValue(`items.${index}.taxRate`, item.taxRate, { shouldDirty: true });
    if (item.hsnSac != null) {
      setValue(`items.${index}.hsnSac`, item.hsnSac, { shouldDirty: true });
    }
    setValue(
      `items.${index}.stockAvailable`,
      item.stock != null ? item.stock : null,
      { shouldDirty: true },
    );
    if (!quantity) {
      setValue(`items.${index}.quantity`, 1, { shouldDirty: true });
    }
  };

  return (
    <tr className="group border-b border-slate-100 align-top">
      <td className="w-8 px-1 py-2 text-center text-xs text-slate-400">
        {index + 1}
      </td>

      <td className="min-w-[180px] px-1.5 py-2 sm:min-w-[220px]">
        <div className="space-y-1.5">
          <ItemSearchSelect
            label=""
            value={itemName}
            onSelect={applyItem}
            onQueryChange={(q) =>
              setValue(`items.${index}.itemName`, q, {
                shouldDirty: true,
                shouldValidate: true,
              })
            }
            placeholder="Search item"
          />
          <textarea
            placeholder="Note"
            rows={2}
            value={description || ""}
            onChange={(e) =>
              setValue(`items.${index}.description`, e.target.value || null, {
                shouldDirty: true,
              })
            }
            className="w-full resize-none rounded-md border border-amber-100 bg-amber-50/80 px-2 py-1 text-xs leading-snug text-slate-600 placeholder:text-slate-400 focus:border-amber-200 focus:outline-none"
          />
          {itemErrors?.itemName && (
            <p className="text-[11px] text-red-500">
              {itemErrors.itemName.message}
            </p>
          )}
        </div>
      </td>

      <td className="w-16 px-1 py-2 sm:w-20">
        <Input
          type="number"
          step="any"
          min={0}
          max={stockAvailable != null ? stockAvailable : 100000}
          className="h-8 px-1 text-center text-xs tabular-nums sm:h-9 sm:text-sm"
          {...register(`items.${index}.quantity`, {
            valueAsNumber: true,
            onChange: (e) => {
              let v = Number(e.target.value);
              if (Number.isNaN(v) || v < 0) v = 0;
              if (v > 100000) v = 100000;
              if (stockAvailable != null && v > stockAvailable) {
                v = stockAvailable;
              }
              setValue(`items.${index}.quantity`, v, {
                shouldDirty: true,
                shouldValidate: true,
              });
            },
          })}
        />
        {stockAvailable != null && (
          <p className="mt-0.5 text-[9px] text-slate-400">
            Stock {stockAvailable}
          </p>
        )}
        {itemErrors?.quantity && (
          <p className="text-[10px] text-red-500">
            {(itemErrors.quantity as { message?: string }).message}
          </p>
        )}
      </td>

      <td className="hidden w-14 px-1 py-2 sm:table-cell">
        <Input
          readOnly
          value={unit || "PCS"}
          className="h-8 cursor-default bg-slate-50 px-1 text-center text-[10px] uppercase text-slate-600 sm:h-9 sm:text-xs"
          tabIndex={-1}
        />
      </td>

      <td className="w-20 px-1 py-2 sm:w-24">
        <Input
          type="number"
          step="any"
          min={0}
          className="h-8 px-1 text-right text-xs tabular-nums sm:h-9 sm:text-sm"
          value={unitPrice || ""}
          onChange={(e) => {
            let v = e.target.value === "" ? 0 : Number(e.target.value);
            if (Number.isNaN(v) || v < 0) v = 0;
            if (v > 10_00_00_000) v = 10_00_00_000;
            setValue(`items.${index}.rate`, v, { shouldDirty: true });
            setValue(`items.${index}.price`, v, { shouldDirty: true });
          }}
          max={100000000}
        />
      </td>

      <td className="w-24 px-1 py-2">
        <div className="flex items-center gap-0.5">
          <Input
            type="number"
            step="any"
            min={0}
            className="h-8 min-w-0 flex-1 px-1 text-center text-xs tabular-nums sm:h-9"
            {...register(`items.${index}.discount`, {
              valueAsNumber: true,
              onChange: (e) => {
                let v = Number(e.target.value);
                if (Number.isNaN(v) || v < 0) v = 0;
                if (discountType === "PERCENTAGE" && v > 100) v = 100;
                if (discountType === "FIXED" && v > 10_00_00_000) v = 10_00_00_000;
                setValue(`items.${index}.discount`, v, {
                  shouldDirty: true,
                  shouldValidate: true,
                });
              },
            })}
          />
          <button
            type="button"
            title="Toggle % / ₹"
            onClick={() =>
              setValue(
                `items.${index}.discountType`,
                discountType === "PERCENTAGE" ? "FIXED" : "PERCENTAGE",
                { shouldDirty: true },
              )
            }
            className="h-8 w-7 shrink-0 rounded border border-slate-200 text-[10px] font-semibold text-slate-600 hover:bg-slate-50 sm:h-9 sm:w-8 sm:text-[11px]"
          >
            {discountType === "PERCENTAGE" ? "%" : "₹"}
          </button>
        </div>
      </td>

      {/* Tax — read-only (from inventory / calc) */}
      <td className="w-20 px-1 py-2 text-center sm:w-24">
        {isInter ? (
          <div className="space-y-0.5">
            <p className="text-[10px] font-medium tabular-nums text-slate-700">
              {line.igstRate}%
            </p>
            <p className="text-[9px] tabular-nums text-slate-400">
              {formatINR(line.igstAmount)}
            </p>
          </div>
        ) : (
          <div className="space-y-0.5">
            <p className="text-[10px] leading-tight text-slate-600">
              <span className="text-slate-400">C</span>
              {line.cgstRate}%{" "}
              <span className="tabular-nums text-slate-500">
                {formatINR(line.cgstAmount)}
              </span>
            </p>
            <p className="text-[10px] leading-tight text-slate-600">
              <span className="text-slate-400">S</span>
              {line.sgstRate}%{" "}
              <span className="tabular-nums text-slate-500">
                {formatINR(line.sgstAmount)}
              </span>
            </p>
          </div>
        )}
        <input
          type="hidden"
          {...register(`items.${index}.taxRate`, { valueAsNumber: true })}
        />
      </td>

      <td className="w-20 px-1 py-2 text-right sm:w-24">
        <span className="text-xs font-medium tabular-nums text-slate-900 sm:text-sm">
          {formatINR(line.total)}
        </span>
      </td>

      <td className="w-16 px-0.5 py-2">
        <TooltipProvider delay={150}>
          <div className="flex items-center justify-center gap-0.5">
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    type="button"
                    size="icon"
                    onClick={onAdd}
                    className="h-7 w-7 bg-emerald-600 text-white hover:bg-emerald-700 sm:h-8 sm:w-8"
                  />
                }
              >
                <Plus className="h-3.5 w-3.5" />
              </TooltipTrigger>
              <TooltipContent side="top">Add line</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    type="button"
                    size="icon"
                    onClick={onRemove}
                    disabled={!canRemove}
                    className="h-7 w-7 bg-red-500 text-white hover:bg-red-600 disabled:opacity-30 sm:h-8 sm:w-8"
                  />
                }
              >
                <Minus className="h-3.5 w-3.5" />
              </TooltipTrigger>
              <TooltipContent side="top">Remove line</TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      </td>
    </tr>
  );
}
