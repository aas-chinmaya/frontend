"use client";

import { useFormContext, useWatch } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Building2,
  Calendar,
  FileText,
  Landmark,
  Mail,
  MapPin,
  Phone,
  Smartphone,
} from "lucide-react";
import { FormField } from "@/modules/sales/shared/components/ui/form-field";

export type BusinessFieldNames = {
  name: string;
  legalName: string;
  gstin: string;
  pan?: string;
  phone: string;
  email: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  stateCode: string;
  pincode: string;
  country: string;
  showBankDetails?: string;
  bankName?: string;
  bankAccountNumber?: string;
  bankIFSC?: string;
  bankBranch?: string;
  showUPIDetails?: string;
  upiId?: string;
  documentDate?: string;
  validUntil?: string;
};

export const BUSINESS_FIELD_NAMES: BusinessFieldNames = {
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
  documentDate: "quotationDate",
  validUntil: "validUntil",
};

export const SELLER_FIELD_NAMES: BusinessFieldNames = {
  name: "sellerTradeName",
  legalName: "sellerLegalName",
  gstin: "sellerGSTIN",
  pan: "sellerPAN",
  phone: "sellerPhone",
  email: "sellerEmail",
  addressLine1: "sellerAddressLine1",
  addressLine2: "sellerAddressLine2",
  city: "sellerCity",
  state: "sellerState",
  stateCode: "sellerStateCode",
  pincode: "sellerPincode",
  country: "sellerCountry",
  documentDate: "invoiceDate",
};

function join(...parts: Array<string | null | undefined>) {
  return parts
    .map((p) => (p || "").trim())
    .filter(Boolean)
    .join(", ");
}

type Props = {
  fields?: BusinessFieldNames;
  title?: string;
  showBankSection?: boolean;
};

export function BusinessDetailsFields({
  fields = BUSINESS_FIELD_NAMES,
  title = "From (business)",
  showBankSection = true,
}: Props) {
  const { control, register, setValue } = useFormContext();
  const f = fields;

  const name = useWatch({ control, name: f.name });
  const legal = useWatch({ control, name: f.legalName });
  const gstin = useWatch({ control, name: f.gstin });
  const phone = useWatch({ control, name: f.phone });
  const email = useWatch({ control, name: f.email });
  const a1 = useWatch({ control, name: f.addressLine1 });
  const a2 = useWatch({ control, name: f.addressLine2 });
  const city = useWatch({ control, name: f.city });
  const state = useWatch({ control, name: f.state });
  const pincode = useWatch({ control, name: f.pincode });
  const country = useWatch({ control, name: f.country });

  const bankName = useWatch({ control, name: f.bankName || f.name });
  const bankAcc = useWatch({ control, name: f.bankAccountNumber || f.name });
  const bankIfsc = useWatch({ control, name: f.bankIFSC || f.name });
  const bankBranch = useWatch({ control, name: f.bankBranch || f.name });
  const upiId = useWatch({ control, name: f.upiId || f.name });
  const showBankRaw = useWatch({ control, name: f.showBankDetails || f.name });
  const showUpiRaw = useWatch({ control, name: f.showUPIDetails || f.name });

  const showBank = f.showBankDetails ? !!showBankRaw : false;
  const showUpi = f.showUPIDetails ? !!showUpiRaw : false;

  const hasBank =
    !!(bankName || bankAcc || bankIfsc || bankBranch);
  const hasUpi = !!upiId;

  const address = join(a1, a2, city, state, pincode, country);

  return (
    <div className="space-y-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {title}
      </p>

      {/* Business card — read-only display */}
      <div className="space-y-2 rounded-lg border border-slate-200 bg-slate-50/80 p-3 text-sm">
        <div className="flex items-start gap-2">
          <Building2 className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />
          <div className="min-w-0">
            <p className="font-medium text-slate-900">{name || "—"}</p>
            {legal && legal !== name ? (
              <p className="text-xs text-slate-500">{legal}</p>
            ) : null}
          </div>
        </div>
        {gstin ? (
          <p className="flex items-center gap-2 text-xs text-slate-600">
            <FileText className="h-3.5 w-3.5 shrink-0" /> GSTIN: {gstin}
          </p>
        ) : null}
        {phone ? (
          <p className="flex items-center gap-2 text-xs text-slate-600">
            <Phone className="h-3.5 w-3.5 shrink-0" /> {phone}
          </p>
        ) : null}
        {email ? (
          <p className="flex items-center gap-2 text-xs text-slate-600">
            <Mail className="h-3.5 w-3.5 shrink-0" /> {email}
          </p>
        ) : null}
        {address ? (
          <p className="flex items-start gap-2 text-xs text-slate-600">
            <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" /> {address}
          </p>
        ) : null}
      </div>

      {/* Hidden RHF fields */}
      <input type="hidden" {...register(f.name)} />
      <input type="hidden" {...register(f.legalName)} />
      <input type="hidden" {...register(f.gstin)} />
      {f.pan ? <input type="hidden" {...register(f.pan)} /> : null}
      <input type="hidden" {...register(f.phone)} />
      <input type="hidden" {...register(f.email)} />
      <input type="hidden" {...register(f.addressLine1)} />
      <input type="hidden" {...register(f.addressLine2)} />
      <input type="hidden" {...register(f.city)} />
      <input type="hidden" {...register(f.state)} />
      <input type="hidden" {...register(f.stateCode)} />
      <input type="hidden" {...register(f.pincode)} />
      <input type="hidden" {...register(f.country)} />
      {f.bankName ? <input type="hidden" {...register(f.bankName)} /> : null}
      {f.bankAccountNumber ? (
        <input type="hidden" {...register(f.bankAccountNumber)} />
      ) : null}
      {f.bankIFSC ? <input type="hidden" {...register(f.bankIFSC)} /> : null}
      {f.bankBranch ? <input type="hidden" {...register(f.bankBranch)} /> : null}
      {f.upiId ? <input type="hidden" {...register(f.upiId)} /> : null}

      {(f.documentDate || f.validUntil) && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {f.documentDate ? (
            <FormField label="Quotation date" required>
              <div className="relative">
                <Calendar className="pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                <Input
                  type="date"
                  className="h-9 pl-8"
                  {...register(f.documentDate)}
                />
              </div>
            </FormField>
          ) : null}
          {f.validUntil ? (
            <FormField label="Valid until" required>
              <Input type="date" className="h-9" {...register(f.validUntil)} />
            </FormField>
          ) : null}
        </div>
      )}

      {/* Bank / UPI: toggle only — details are display-only when they exist */}
      {showBankSection && f.showBankDetails ? (
        <div className="space-y-3 border-t border-slate-100 pt-3">
          <div className="flex items-center justify-between gap-2">
            <span className="flex items-center gap-2 text-xs font-medium text-slate-600">
              <Landmark className="h-3.5 w-3.5" /> Show bank details on document
            </span>
            <Switch
              checked={showBank}
              disabled={!hasBank}
              onCheckedChange={(v) =>
                setValue(f.showBankDetails!, v, { shouldDirty: true })
              }
            />
          </div>
          {showBank && hasBank ? (
            <div className="space-y-1 rounded-md border border-slate-200 bg-white p-3 text-xs text-slate-700">
              {bankName ? <p className="font-medium">{bankName}</p> : null}
              {bankAcc ? <p>A/C: {bankAcc}</p> : null}
              {bankIfsc ? <p>IFSC: {bankIfsc}</p> : null}
              {bankBranch ? <p>Branch: {bankBranch}</p> : null}
            </div>
          ) : null}
          {!hasBank ? (
            <p className="text-[11px] text-slate-400">
              No bank details on business profile.
            </p>
          ) : null}

          {f.showUPIDetails ? (
            <>
              <div className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-2 text-xs font-medium text-slate-600">
                  <Smartphone className="h-3.5 w-3.5" /> Show UPI on document
                </span>
                <Switch
                  checked={showUpi}
                  disabled={!hasUpi}
                  onCheckedChange={(v) =>
                    setValue(f.showUPIDetails!, v, { shouldDirty: true })
                  }
                />
              </div>
              {showUpi && hasUpi ? (
                <div className="rounded-md border border-slate-200 bg-white p-3 text-xs text-slate-700">
                  UPI: {upiId}
                </div>
              ) : null}
            </>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
