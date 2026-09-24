"use client";

import { useFormContext, useWatch } from "react-hook-form";
import {
  BusinessDetailsFields,
  type BusinessFieldNames,
} from "@/modules/sales/shared/components/party/business-details-fields";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { InvoiceFormValues } from "../../types/invoice-form.types";
import type { InvoiceType } from "../../types/invoice.types";

/** Invoice issuer — invoice date only (no due / valid until) */
export const INVOICE_BUSINESS_FIELD_NAMES: BusinessFieldNames = {
  name: "businessName",
  legalName: "businessLegalName",
  gstin: "businessGSTIN",
  pan: "businessPAN",
  phone: "businessPhone",
  email: "businessEmail",
  addressLine1: "businessAddressLine1",
  addressLine2: "businessAddressLine2",
  city: "businessCity",
  state: "businessState",
  stateCode: "businessStateCode",
  pincode: "businessPincode",
  country: "businessCountry",
  showBankDetails: "showBankDetails",
  bankName: "businessBankName",
  bankAccountNumber: "businessBankAccountNumber",
  bankIFSC: "businessBankIFSC",
  bankBranch: "businessBankBranch",
  showUPIDetails: "showUPIDetails",
  upiId: "businessUPIId",
  documentDate: "invoiceDate",
  logo: "businessLogo",
};

const INVOICE_TYPES: { value: InvoiceType; label: string }[] = [
  { value: "B2B", label: "B2B" },
  { value: "B2C", label: "B2C" },
  { value: "EXPORT", label: "Export" },
  { value: "SEZ", label: "SEZ" },
];

/** Invoice issuer — bank always visible; toggles control document only */
export function InvoiceIssuerFields() {
  const { setValue, control } = useFormContext<InvoiceFormValues>();
  const invoiceType =
    (useWatch({ control, name: "invoiceType" }) as InvoiceType) || "B2B";

  return (
    <div className="space-y-4">
      {/* Type + currency on top of issuer card */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label className="text-xs text-slate-600">Invoice type</Label>
          <Select
            value={invoiceType}
            onValueChange={(v) => {
              const type = v as InvoiceType;
              setValue("invoiceType", type, { shouldDirty: true });
              setValue("isExport", type === "EXPORT", { shouldDirty: true });
              setValue("isSEZ", type === "SEZ", { shouldDirty: true });
            }}
          >
            <SelectTrigger className="h-9">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              {INVOICE_TYPES.map((t) => (
                <SelectItem key={t.value} value={t.value}>
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs text-slate-600">Currency</Label>
          <Select value="INR" disabled>
            <SelectTrigger className="h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="INR">INR (₹)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <BusinessDetailsFields
        fields={INVOICE_BUSINESS_FIELD_NAMES}
        title="From (your business)"
        showBankSection
        documentDateLabel="Invoice date"
        alwaysShowBankDetails
      />
    </div>
  );
}
