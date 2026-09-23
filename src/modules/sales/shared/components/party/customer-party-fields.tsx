"use client";

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
  placeOfSupply?: string;
  placeOfSupplyCode?: string;
  taxType?: string;
};

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
  taxType: "taxType",
};

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
  taxType: "taxType",
};

type Props = {
  fields?: CustomerPartyFieldNames;
  showPlaceOfSupply?: boolean;
  title?: string;
};

export function CustomerPartyFields({
  fields = PROSPECT_FIELD_NAMES,
  showPlaceOfSupply = true,
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
  const taxType = f.taxType ? watch(f.taxType) : "";
  const clearCustomerFields = () => {
    setValue(f.customerId, null, { shouldDirty: true });
    setValue(f.name, "", { shouldDirty: true, shouldValidate: true });
    setValue(f.companyName, "", { shouldDirty: true });
    setValue(f.phone, "", { shouldDirty: true, shouldValidate: true });
    setValue(f.email, "", { shouldDirty: true });
    setValue(f.gstin, "", { shouldDirty: true });
    setValue(f.pan, "", { shouldDirty: true });
    setValue(f.addressLine1, "", { shouldDirty: true, shouldValidate: true });
    setValue(f.addressLine2, "", { shouldDirty: true });
    setValue(f.city, "", { shouldDirty: true, shouldValidate: true });
    setValue(f.state, "", { shouldDirty: true, shouldValidate: true });
    setValue(f.stateCode, "", { shouldDirty: true });
    setValue(f.pincode, "", { shouldDirty: true, shouldValidate: true });
    setValue(f.country, "India", { shouldDirty: true, shouldValidate: true });
    if (f.placeOfSupply)
      setValue(f.placeOfSupply, "", { shouldDirty: true, shouldValidate: true });
    if (f.placeOfSupplyCode)
      setValue(f.placeOfSupplyCode, null, { shouldDirty: true });
  };

  const applyCustomer = (customer: SelectedCustomer | null) => {
    if (!customer) {
      clearCustomerFields();
      return;
    }
    setValue(f.customerId, customer.id, { shouldDirty: true });
    setValue(f.name, customer.name || customer.companyName || "", {
      shouldDirty: true,
      shouldValidate: true,
    });
    setValue(f.companyName, customer.companyName ?? "", { shouldDirty: true });
    const mob = (customer.mobile || "").replace(/[\s-]/g, "");
    const phone =
      mob.startsWith("+") ? mob : mob ? `+91${mob.replace(/^0/, "")}` : "";
    setValue(f.phone, phone, { shouldDirty: true, shouldValidate: true });
    setValue(f.email, customer.email ?? "", { shouldDirty: true });
    setValue(f.gstin, customer.gstin ?? "", { shouldDirty: true });
    setValue(f.pan, customer.pan ?? "", { shouldDirty: true });

    const bill = customer.billingAddress;
    if (!bill) return;
    setValue(f.addressLine1, bill.addressLine1 ?? "", {
      shouldDirty: true,
      shouldValidate: true,
    });
    setValue(f.addressLine2, bill.addressLine2 ?? "", { shouldDirty: true });
    setValue(f.city, bill.city ?? "", {
      shouldDirty: true,
      shouldValidate: true,
    });
    setValue(f.state, bill.state ?? "", {
      shouldDirty: true,
      shouldValidate: true,
    });
    setValue(
      f.stateCode,
      bill.stateCode ?? (STATE_CODE_MAP[bill.state || ""] || ""),
      { shouldDirty: true },
    );
    setValue(f.pincode, bill.pincode ?? "", {
      shouldDirty: true,
      shouldValidate: true,
    });
    setValue(f.country, bill.country ?? "India", {
      shouldDirty: true,
      shouldValidate: true,
    });
    if (f.placeOfSupply && bill.state) {
      setValue(f.placeOfSupply, bill.state, {
        shouldDirty: true,
        shouldValidate: true,
      });
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
      <CustomerSearchSelect onSelect={applyCustomer} hideLabel />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <FormField label="Customer name" required error={err(f.name)}>
          <Input className="h-9 border-slate-200 bg-white" maxLength={120} {...register(f.name)} />
        </FormField>
        <FormField label="Company name" error={err(f.companyName)}>
          <Input className="h-9 border-slate-200 bg-white" maxLength={150} {...register(f.companyName)} />
        </FormField>

        <FormField label="Phone" required error={err(f.phone)}>
          <Input
            className="h-9 border-slate-200 bg-white"
            inputMode="tel"
            maxLength={16}
            placeholder="+919876543210"
            value={watch(f.phone) || ""}
            onChange={(e) => {
              // Allow + and digits only (country code + number as one string)
              let v = e.target.value.replace(/[^0-9+]/g, "");
              if (v.indexOf("+") > 0) v = v.replace(/\+/g, "");
              if (v.startsWith("+")) {
                v = "+" + v.slice(1).replace(/\+/g, "");
              }
              setValue(f.phone, v.slice(0, 16), {
                shouldDirty: true,
                shouldValidate: true,
              });
            }}
          />
        </FormField>

        <FormField label="Email" error={err(f.email)}>
          <Input
            className="h-9 border-slate-200 bg-white"
            type="email"
            maxLength={100}
            {...register(f.email)}
          />
        </FormField>
        <FormField label="GSTIN" error={err(f.gstin)}>
          <Input className="h-9 border-slate-200 bg-white uppercase" maxLength={15} {...register(f.gstin)} />
        </FormField>
        <FormField label="PAN" error={err(f.pan)}>
          <Input className="h-9 border-slate-200 bg-white uppercase" maxLength={10} {...register(f.pan)} />
        </FormField>

        <FormField
          label="Address line 1"
          required
          error={err(f.addressLine1)}
          className="space-y-1 sm:col-span-2"
        >
          <Input className="h-9 border-slate-200 bg-white" maxLength={200} {...register(f.addressLine1)} />
        </FormField>
        <FormField
          label="Address line 2"
          error={err(f.addressLine2)}
          className="space-y-1 sm:col-span-2"
        >
          <Input className="h-9 border-slate-200 bg-white" maxLength={200} {...register(f.addressLine2)} />
        </FormField>

        <FormField label="City" required error={err(f.city)}>
          <Input className="h-9 border-slate-200 bg-white" maxLength={80} {...register(f.city)} />
        </FormField>
        <FormField label="Pincode" required error={err(f.pincode)}>
          <Input
            className="h-9 border-slate-200 bg-white"
            inputMode="numeric"
            maxLength={6}
            placeholder="6 digits"
            value={watch(f.pincode) || ""}
            onChange={(e) =>
              setValue(f.pincode, e.target.value.replace(/\D/g, "").slice(0, 6), {
                shouldDirty: true,
                shouldValidate: true,
              })
            }
          />
        </FormField>
        <FormField label="State" required error={err(f.state)}>
          <Select
            value={watch(f.state) || ""}
            onValueChange={(value) => {
              setValue(f.state, value, {
                shouldDirty: true,
                shouldValidate: true,
              });
              setValue(f.stateCode, STATE_CODE_MAP[value] || "", {
                shouldDirty: true,
              });
            }}
          >
            <SelectTrigger className="h-9 border-slate-200 bg-white">
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
        <FormField label="Country" required error={err(f.country)}>
          <Input className="h-9 border-slate-200 bg-white" maxLength={60} {...register(f.country)} />
        </FormField>
      </div>

      {showPlaceOfSupply && f.placeOfSupply ? (
        <FormField label="Place of supply" required error={err(f.placeOfSupply)}>
          <Select
            value={placeOfSupply || ""}
            onValueChange={(value) => {
              const code = STATE_CODE_MAP[value] || "";
              setValue(f.placeOfSupply!, value, {
                shouldDirty: true,
                shouldValidate: true,
              });
              if (f.placeOfSupplyCode) {
                setValue(f.placeOfSupplyCode, code || null, {
                  shouldDirty: true,
                });
              }
            }}
          >
            <SelectTrigger className="h-9 border-slate-200 bg-white">
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
            {taxType === "INTER_STATE"
              ? "IGST (inter-state)"
              : "CGST + SGST (intra-state)"}
          </p>
        </FormField>
      ) : null}
    </div>
  );
}
