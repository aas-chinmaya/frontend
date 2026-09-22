"use client";

/**
 * Reusable customer / prospect / buyer block for sales documents.
 * Pass field names so quotation (prospect*) and invoice (buyer*) both reuse this UI.
 */
import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { STATE_CODE_MAP } from "@/modules/sales/shared/utils/state-code";
import CustomerSearchSelect, {
  type SelectedCustomer,
} from "@/modules/sales/shared/components/customer-search-select";
import { FormField } from "@/modules/sales/shared/components/ui/form-field";

const STATES = Object.keys(STATE_CODE_MAP).map((state) => ({
  value: state,
  label: state
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" "),
  code: STATE_CODE_MAP[state],
}));

export type CustomerPartyFieldNames = {
  customerId: string;
  name: string;
  companyName: string;
  phone: string;
  email: string;
  gstin: string;
  pan: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  stateCode: string;
  pincode: string;
  country: string;
  /** optional quotation/invoice tax fields */
  placeOfSupply?: string;
  placeOfSupplyCode?: string;
  reverseCharge?: string;
  taxType?: string;
};

/** Quotation defaults */
export const PROSPECT_FIELD_NAMES: CustomerPartyFieldNames = {
  customerId: "customerId",
  name: "prospectName",
  companyName: "prospectCompanyName",
  phone: "prospectPhone",
  email: "prospectEmail",
  gstin: "prospectGSTIN",
  pan: "prospectPAN",
  addressLine1: "prospectAddressLine1",
  addressLine2: "prospectAddressLine2",
  city: "prospectCity",
  state: "prospectState",
  stateCode: "prospectStateCode",
  pincode: "prospectPincode",
  country: "prospectCountry",
  placeOfSupply: "placeOfSupply",
  placeOfSupplyCode: "placeOfSupplyCode",
  reverseCharge: "reverseCharge",
  taxType: "taxType",
};

/** Invoice-style defaults (reuse later) */
export const BUYER_FIELD_NAMES: CustomerPartyFieldNames = {
  customerId: "customerId",
  name: "buyerName",
  companyName: "buyerCompanyName",
  phone: "buyerPhone",
  email: "buyerEmail",
  gstin: "buyerGSTIN",
  pan: "buyerPAN",
  addressLine1: "billingAddressLine1",
  addressLine2: "billingAddressLine2",
  city: "billingCity",
  state: "billingState",
  stateCode: "billingStateCode",
  pincode: "billingPincode",
  country: "billingCountry",
  placeOfSupply: "placeOfSupply",
  placeOfSupplyCode: "placeOfSupplyCode",
  reverseCharge: "reverseCharge",
  taxType: "taxType",
};

type Props = {
  fields?: CustomerPartyFieldNames;
  showPlaceOfSupply?: boolean;
  showReverseCharge?: boolean;
  title?: string;
};

export function CustomerPartyFields({
  fields = PROSPECT_FIELD_NAMES,
  showPlaceOfSupply = true,
  showReverseCharge = true,
  title = "Customer",
}: Props) {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  const f = fields;
  const err = (name: string) =>
    (errors as Record<string, { message?: string } | undefined>)[name]?.message;

  const placeOfSupply = f.placeOfSupply ? watch(f.placeOfSupply) : "";
  const placeOfSupplyCode = f.placeOfSupplyCode
    ? watch(f.placeOfSupplyCode)
    : "";
  const reverseCharge = f.reverseCharge ? watch(f.reverseCharge) : false;
  const taxType = f.taxType ? watch(f.taxType) : "";

  const applyCustomer = (customer: SelectedCustomer | null) => {
    if (!customer) {
      setValue(f.customerId, null, { shouldDirty: true });
      return;
    }
    setValue(f.customerId, customer.id, { shouldDirty: true });
    setValue(f.name, customer.name || customer.companyName || "", {
      shouldDirty: true,
      shouldValidate: true,
    });
    setValue(f.companyName, customer.companyName ?? "", { shouldDirty: true });
    setValue(f.phone, customer.mobile ?? "", { shouldDirty: true });
    setValue(f.email, customer.email ?? "", { shouldDirty: true });
    setValue(f.gstin, customer.gstin ?? "", { shouldDirty: true });
    setValue(f.pan, customer.pan ?? "", { shouldDirty: true });

    const bill = customer.billingAddress;
    if (!bill) return;
    setValue(f.addressLine1, bill.addressLine1 ?? "", { shouldDirty: true });
    setValue(f.addressLine2, bill.addressLine2 ?? "", { shouldDirty: true });
    setValue(f.city, bill.city ?? "", { shouldDirty: true });
    setValue(f.state, bill.state ?? "", { shouldDirty: true });
    setValue(f.stateCode, bill.stateCode ?? (STATE_CODE_MAP[bill.state || ""] || ""), {
      shouldDirty: true,
    });
    setValue(f.pincode, bill.pincode ?? "", { shouldDirty: true });
    setValue(f.country, bill.country ?? "India", { shouldDirty: true });

    if (f.placeOfSupply && bill.state) {
      setValue(f.placeOfSupply, bill.state, { shouldDirty: true });
      if (f.placeOfSupplyCode) {
        setValue(
          f.placeOfSupplyCode,
          bill.stateCode ?? (STATE_CODE_MAP[bill.state || ""] || null),
          { shouldDirty: true },
        );
      }
    }
  };

  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {title} <span className="text-red-500">*</span>
      </p>

      <FormField label="Search customer">
        <CustomerSearchSelect onSelect={applyCustomer} />
      </FormField>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <FormField label="Customer name" required error={err(f.name)}>
          <Input className="h-9" {...register(f.name)} />
        </FormField>
        <FormField label="Company" error={err(f.companyName)}>
          <Input className="h-9" {...register(f.companyName)} />
        </FormField>
        <FormField label="Phone" error={err(f.phone)}>
          <Input className="h-9" {...register(f.phone)} />
        </FormField>
        <FormField label="Email" error={err(f.email)}>
          <Input className="h-9" {...register(f.email)} />
        </FormField>
        <FormField label="GSTIN" error={err(f.gstin)}>
          <Input className="h-9" {...register(f.gstin)} />
        </FormField>
        <FormField label="PAN" error={err(f.pan)}>
          <Input className="h-9" {...register(f.pan)} />
        </FormField>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <FormField label="Address line 1" error={err(f.addressLine1)}>
          <Input className="h-9" {...register(f.addressLine1)} />
        </FormField>
        <FormField label="Address line 2" error={err(f.addressLine2)}>
          <Input className="h-9" {...register(f.addressLine2)} />
        </FormField>
        <FormField label="City" error={err(f.city)}>
          <Input className="h-9" {...register(f.city)} />
        </FormField>
        <FormField label="Pincode" error={err(f.pincode)}>
          <Input className="h-9" {...register(f.pincode)} />
        </FormField>
        <FormField label="State" error={err(f.state)}>
          <Select
            value={watch(f.state) || ""}
            onValueChange={(value) => {
              setValue(f.state, value, { shouldDirty: true });
              setValue(f.stateCode, STATE_CODE_MAP[value] || "", {
                shouldDirty: true,
              });
            }}
          >
            <SelectTrigger className="h-9">
              <SelectValue placeholder="Select state" />
            </SelectTrigger>
            <SelectContent>
              {STATES.map((s) => (
                <SelectItem key={s.code} value={s.value}>
                  {s.label} ({s.code})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>
        <FormField label="Country" error={err(f.country)}>
          <Input className="h-9" placeholder="India" {...register(f.country)} />
        </FormField>
      </div>

      {(showPlaceOfSupply || showReverseCharge) && f.placeOfSupply ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {showPlaceOfSupply ? (
            <FormField label="Place of supply" required>
              <Select
                value={placeOfSupply || ""}
                onValueChange={(value) => {
                  const code = STATE_CODE_MAP[value] || "";
                  setValue(f.placeOfSupply!, value, { shouldDirty: true });
                  if (f.placeOfSupplyCode) {
                    setValue(f.placeOfSupplyCode, code || null, {
                      shouldDirty: true,
                    });
                  }
                }}
              >
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  {STATES.map((s) => (
                    <SelectItem key={s.code} value={s.value}>
                      {s.label} ({s.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="mt-1 text-[11px] text-slate-500">
                {placeOfSupply
                  ? `${placeOfSupply}${placeOfSupplyCode ? ` (${placeOfSupplyCode})` : ""} · `
                  : ""}
                {taxType === "INTER_STATE" ? "IGST" : "CGST + SGST"}
              </p>
            </FormField>
          ) : null}
          {showReverseCharge && f.reverseCharge ? (
            <FormField label="Reverse charge">
              <Select
                value={reverseCharge ? "yes" : "no"}
                onValueChange={(v) =>
                  setValue(f.reverseCharge!, v === "yes", { shouldDirty: true })
                }
              >
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="no">No</SelectItem>
                  <SelectItem value="yes">Yes</SelectItem>
                </SelectContent>
              </Select>
            </FormField>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
