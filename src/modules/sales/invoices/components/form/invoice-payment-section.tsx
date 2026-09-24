"use client";

import { useEffect, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { ChevronDown, ChevronRight, CreditCard } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { InvoiceFormValues } from "../../types/invoice-form.types";

const METHODS = [
  "Cash",
  "Bank Transfer",
  "UPI",
  "Card",
  "Cheque",
  "Other",
] as const;
const STATUSES = [
  { value: "PENDING", label: "Pending" },
  { value: "PARTIAL", label: "Partial" },
  { value: "PAID", label: "Paid" },
  { value: "OVERDUE", label: "Overdue" },
] as const;

function hasExistingPayment(v: {
  paymentStatus?: string | null;
  paymentMethod?: string | null;
  paidAmount?: number | null;
  paymentDate?: string | null;
  transactionId?: string | null;
}) {
  const status = String(v.paymentStatus || "PENDING");
  const method = String(v.paymentMethod || "Cash");
  const paid = Number(v.paidAmount) || 0;
  const tx = String(v.transactionId || "").trim();
  const date = String(v.paymentDate || "").trim();
  if (status !== "PENDING") return true;
  if (method && method !== "Cash") return true;
  if (paid > 0) return true;
  if (tx) return true;
  if (date) return true;
  return false;
}

/**
 * Optional payment block — same card shell as Payment summary.
 * Collapsed by default; opens on edit when payment data exists.
 */
export function InvoicePaymentSection() {
  const {
    register,
    setValue,
    control,
    formState: { errors },
  } = useFormContext<InvoiceFormValues>();

  const paymentStatus =
    useWatch({ control, name: "paymentStatus" }) ?? "PENDING";
  const paymentMethod =
    useWatch({ control, name: "paymentMethod" }) ?? "Cash";
  const paidAmount = useWatch({ control, name: "paidAmount" });
  const paymentDate = useWatch({ control, name: "paymentDate" });
  const transactionId = useWatch({ control, name: "transactionId" });

  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (
      hasExistingPayment({
        paymentStatus,
        paymentMethod,
        paidAmount,
        paymentDate,
        transactionId,
      })
    ) {
      setOpen(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isCash =
    !paymentMethod || String(paymentMethod).toLowerCase() === "cash";
  const txError = errors.transactionId?.message as string | undefined;

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left"
      >
        <span className="flex items-center gap-2 text-sm font-semibold text-slate-800">
          <CreditCard className="h-4 w-4 text-slate-500" />
          Payment information
          <span className="text-[11px] font-normal text-slate-400">
            (optional)
          </span>
        </span>
        {open ? (
          <ChevronDown className="h-4 w-4 text-slate-400" />
        ) : (
          <ChevronRight className="h-4 w-4 text-slate-400" />
        )}
      </button>

      {open ? (
        <div className="space-y-3 border-t border-slate-100 px-4 py-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label className="text-xs text-slate-600">Payment status</Label>
              <Select
                value={String(paymentStatus)}
                onValueChange={(v) =>
                  setValue(
                    "paymentStatus",
                    v as InvoiceFormValues["paymentStatus"],
                    { shouldDirty: true },
                  )
                }
              >
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  {STATUSES.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-slate-600">Payment method</Label>
              <Select
                value={String(paymentMethod || "Cash")}
                onValueChange={(v) => {
                  setValue("paymentMethod", v, { shouldDirty: true });
                  if (v === "Cash") {
                    setValue("transactionId", null, {
                      shouldDirty: true,
                      shouldValidate: true,
                    });
                  }
                }}
              >
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Method" />
                </SelectTrigger>
                <SelectContent>
                  {METHODS.map((m) => (
                    <SelectItem key={m} value={m}>
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-slate-600">Paid amount (₹)</Label>
              <Input
                type="number"
                min={0}
                step="0.01"
                className="h-9"
                {...register("paidAmount", { valueAsNumber: true })}
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-slate-600">Payment date</Label>
              <Input
                type="date"
                className="h-9"
                {...register("paymentDate")}
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label className="text-xs text-slate-600">
                Transaction / reference ID
                {!isCash ? (
                  <span className="text-red-500"> *</span>
                ) : (
                  <span className="text-slate-400"> (optional for Cash)</span>
                )}
              </Label>
              <Input
                className={`h-9 ${txError ? "border-red-500" : ""}`}
                placeholder={
                  isCash ? "Optional" : "Required for non-cash payments"
                }
                {...register("transactionId")}
              />
              {txError ? (
                <p className="text-[11px] text-red-600">{txError}</p>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
