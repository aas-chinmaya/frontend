// "use client";

// import { useFormContext, useWatch } from "react-hook-form";
// import { Input } from "@/components/ui/input";
// import { Switch } from "@/components/ui/switch";
// import {
//   Building2,
//   Calendar,
//   FileText,
//   ImageIcon,
//   Landmark,
//   Mail,
//   MapPin,
//   Phone,
//   Smartphone,
// } from "lucide-react";
// import { FormField } from "@/modules/sales/shared/components/ui/form-field";

// export type BusinessFieldNames = {
//   name: string;
//   legalName: string;
//   gstin: string;
//   pan?: string;
//   phone: string;
//   email: string;
//   addressLine1: string;
//   addressLine2: string;
//   city: string;
//   state: string;
//   stateCode: string;
//   pincode: string;
//   country: string;
//   showBankDetails?: string;
//   bankName?: string;
//   bankAccountNumber?: string;
//   bankIFSC?: string;
//   bankBranch?: string;
//   showUPIDetails?: string;
//   upiId?: string;
//   documentDate?: string;
//   validUntil?: string;
//   logo?: string;
// };

// export const BUSINESS_FIELD_NAMES: BusinessFieldNames = {
//   name: "businessName",
//   legalName: "businessLegalName",
//   gstin: "businessGSTIN",
//   pan: "businessPAN",
//   phone: "businessPhone",
//   email: "businessEmail",
//   addressLine1: "businessAddressLine1",
//   addressLine2: "businessAddressLine2",
//   city: "businessCity",
//   state: "businessState",
//   stateCode: "businessStateCode",
//   pincode: "businessPincode",
//   country: "businessCountry",
//   showBankDetails: "showBankDetails",
//   bankName: "businessBankName",
//   bankAccountNumber: "businessBankAccountNumber",
//   bankIFSC: "businessBankIFSC",
//   bankBranch: "businessBankBranch",
//   showUPIDetails: "showUPIDetails",
//   upiId: "businessUPIId",
//   documentDate: "quotationDate",
//   validUntil: "validUntil",
//   logo: "businessLogo",
// };

// export const SELLER_FIELD_NAMES: BusinessFieldNames = {
//   name: "sellerTradeName",
//   legalName: "sellerLegalName",
//   gstin: "sellerGSTIN",
//   pan: "sellerPAN",
//   phone: "sellerPhone",
//   email: "sellerEmail",
//   addressLine1: "sellerAddressLine1",
//   addressLine2: "sellerAddressLine2",
//   city: "sellerCity",
//   state: "sellerState",
//   stateCode: "sellerStateCode",
//   pincode: "sellerPincode",
//   country: "sellerCountry",
//   documentDate: "invoiceDate",
//   logo: "businessLogo",
// };

// function join(...parts: Array<string | null | undefined>) {
//   return parts
//     .map((p) => (p || "").trim())
//     .filter(Boolean)
//     .join(", ");
// }

// type Props = {
//   fields?: BusinessFieldNames;
//   title?: string;
//   showBankSection?: boolean;
// };

// export function BusinessDetailsFields({
//   fields = BUSINESS_FIELD_NAMES,
//   title = "From (business)",
//   showBankSection = true,
// }: Props) {
//   const { control, register, setValue } = useFormContext();
//   const f = fields;

//   const name = useWatch({ control, name: f.name });
//   const legal = useWatch({ control, name: f.legalName });
//   const gstin = useWatch({ control, name: f.gstin });
//   const phone = useWatch({ control, name: f.phone });
//   const email = useWatch({ control, name: f.email });
//   const a1 = useWatch({ control, name: f.addressLine1 });
//   const a2 = useWatch({ control, name: f.addressLine2 });
//   const city = useWatch({ control, name: f.city });
//   const state = useWatch({ control, name: f.state });
//   const pincode = useWatch({ control, name: f.pincode });
//   const country = useWatch({ control, name: f.country });
//   const logo = useWatch({ control, name: f.logo || f.name });

//   const bankName = useWatch({ control, name: f.bankName || f.name });
//   const bankAcc = useWatch({ control, name: f.bankAccountNumber || f.name });
//   const bankIfsc = useWatch({ control, name: f.bankIFSC || f.name });
//   const bankBranch = useWatch({ control, name: f.bankBranch || f.name });
//   const upiId = useWatch({ control, name: f.upiId || f.name });
//   const showBankRaw = useWatch({ control, name: f.showBankDetails || f.name });
//   const showUpiRaw = useWatch({ control, name: f.showUPIDetails || f.name });

//   const showBank = f.showBankDetails ? !!showBankRaw : false;
//   const showUpi = f.showUPIDetails ? !!showUpiRaw : false;
//   const hasBank = !!(bankName || bankAcc || bankIfsc || bankBranch);
//   const hasUpi = !!upiId;
//   const address = join(a1, a2, city, state, pincode, country);

//   const onLogoFile = (file: File | undefined) => {
//     if (!f.logo || !file) return;
//     // Allow up to ~1.5MB for device photos
//     if (file.size > 1_500_000) return;
//     const reader = new FileReader();
//     reader.onload = () =>
//       setValue(f.logo!, String(reader.result || ""), { shouldDirty: true });
//     reader.readAsDataURL(file);
//   };

//   return (
//     <div className="space-y-4">
//       <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
//         {title}
//       </p>

//       <div className="flex flex-row items-start gap-3">
//         {/* Logo */}
//         {f.logo ? (
//           <div className="order-2 ml-auto flex shrink-0 flex-col items-center gap-1.5">
//             <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-white">
//               {logo ? (
//                 // eslint-disable-next-line @next/next/no-img-element
//                 <img
//                   src={String(logo)}
//                   alt="Logo"
//                   className="h-full w-full object-contain p-1"
//                 />
//               ) : (
//                 <ImageIcon className="h-6 w-6 text-slate-300" />
//               )}
//             </div>
//             <label className="inline-flex cursor-pointer items-center justify-center rounded-md border border-slate-200 bg-white px-2 py-1 text-[10px] font-semibold text-slate-700 shadow-sm hover:bg-slate-50">
//               {logo ? "Change logo" : "Choose file"}
//               <input
//                 type="file"
//                 accept="image/*"
//                 className="sr-only"
//                 onChange={(e) => {
//                   onLogoFile(e.target.files?.[0]);
//                   e.target.value = "";
//                 }}
//               />
//             </label>
//             {logo ? (
//               <button
//                 type="button"
//                 className="text-[10px] text-red-500 hover:text-red-600"
//                 onClick={() => setValue(f.logo!, null, { shouldDirty: true })}
//               >
//                 Remove
//               </button>
//             ) : null}
//             <input type="hidden" {...register(f.logo)} />
//           </div>
//         ) : null}

//         {/* Business card */}
//         <div className="order-1 min-w-0 flex-1 space-y-2 rounded-lg border border-slate-200 bg-slate-50/80 p-3 text-sm">
//           <div className="flex items-start gap-2">
//             <Building2 className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />
//             <div className="min-w-0">
//               <p className="font-medium text-slate-900">{name || "—"}</p>
//               {legal && legal !== name ? (
//                 <p className="text-xs text-slate-500">{legal}</p>
//               ) : null}
//             </div>
//           </div>
//           {gstin ? (
//             <p className="flex items-center gap-2 text-xs text-slate-600">
//               <FileText className="h-3.5 w-3.5 shrink-0" /> GSTIN: {gstin}
//             </p>
//           ) : null}
//           {phone ? (
//             <p className="flex items-center gap-2 text-xs text-slate-600">
//               <Phone className="h-3.5 w-3.5 shrink-0" /> {phone}
//             </p>
//           ) : null}
//           {email ? (
//             <p className="flex items-center gap-2 text-xs text-slate-600">
//               <Mail className="h-3.5 w-3.5 shrink-0" /> {email}
//             </p>
//           ) : null}
//           {address ? (
//             <p className="flex items-start gap-2 text-xs text-slate-600">
//               <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" /> {address}
//             </p>
//           ) : null}
//         </div>
//       </div>

//       <input type="hidden" {...register(f.name)} />
//       <input type="hidden" {...register(f.legalName)} />
//       <input type="hidden" {...register(f.gstin)} />
//       {f.pan ? <input type="hidden" {...register(f.pan)} /> : null}
//       <input type="hidden" {...register(f.phone)} />
//       <input type="hidden" {...register(f.email)} />
//       <input type="hidden" {...register(f.addressLine1)} />
//       <input type="hidden" {...register(f.addressLine2)} />
//       <input type="hidden" {...register(f.city)} />
//       <input type="hidden" {...register(f.state)} />
//       <input type="hidden" {...register(f.stateCode)} />
//       <input type="hidden" {...register(f.pincode)} />
//       <input type="hidden" {...register(f.country)} />
//       {f.bankName ? <input type="hidden" {...register(f.bankName)} /> : null}
//       {f.bankAccountNumber ? (
//         <input type="hidden" {...register(f.bankAccountNumber)} />
//       ) : null}
//       {f.bankIFSC ? <input type="hidden" {...register(f.bankIFSC)} /> : null}
//       {f.bankBranch ? <input type="hidden" {...register(f.bankBranch)} /> : null}
//       {f.upiId ? <input type="hidden" {...register(f.upiId)} /> : null}

//       {(f.documentDate || f.validUntil) && (
//         <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
//           {f.documentDate ? (
//             <FormField label="Quotation date" required>
//               <div className="relative">
//                 <Calendar className="pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
//                 <Input
//                   type="date"
//                   className="h-9 pl-8"
//                   {...register(f.documentDate)}
//                 />
//               </div>
//             </FormField>
//           ) : null}
//           {f.validUntil ? (
//             <FormField label="Valid until" required>
//               <Input type="date" className="h-9" {...register(f.validUntil)} />
//             </FormField>
//           ) : null}
//         </div>
//       )}

//       {showBankSection && f.showBankDetails ? (
//         <div className="space-y-3 border-t border-slate-100 pt-3">
//           <div className="flex items-center justify-between gap-2">
//             <span className="flex items-center gap-2 text-xs font-medium text-slate-600">
//               <Landmark className="h-3.5 w-3.5" /> Show bank details on document
//             </span>
//             <Switch
//               checked={showBank}
//               disabled={!hasBank}
//               onCheckedChange={(v) =>
//                 setValue(f.showBankDetails!, v, { shouldDirty: true })
//               }
//             />
//           </div>
//           {showBank && hasBank ? (
//             <div className="space-y-1 rounded-md border border-slate-200 bg-white p-3 text-xs text-slate-700">
//               {bankName ? <p className="font-medium">{bankName}</p> : null}
//               {bankAcc ? <p>A/C: {bankAcc}</p> : null}
//               {bankIfsc ? <p>IFSC: {bankIfsc}</p> : null}
//               {bankBranch ? <p>Branch: {bankBranch}</p> : null}
//             </div>
//           ) : null}

//           {f.showUPIDetails ? (
//             <>
//               <div className="flex items-center justify-between gap-2">
//                 <span className="flex items-center gap-2 text-xs font-medium text-slate-600">
//                   <Smartphone className="h-3.5 w-3.5" /> Show UPI on document
//                 </span>
//                 <Switch
//                   checked={showUpi}
//                   disabled={!hasUpi}
//                   onCheckedChange={(v) =>
//                     setValue(f.showUPIDetails!, v, { shouldDirty: true })
//                   }
//                 />
//               </div>
//               {showUpi && hasUpi ? (
//                 <div className="rounded-md border border-slate-200 bg-white p-3 text-xs text-slate-700">
//                   UPI: {upiId}
//                 </div>
//               ) : null}
//             </>
//           ) : null}
//         </div>
//       ) : null}
//     </div>
//   );
// }









"use client";

import { useFormContext, useWatch } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Building2,
  Calendar,
  FileText,
  ImageIcon,
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
  /** Quotation validity — do not use on invoices */
  validUntil?: string;
  /** Invoice due date (invoices only) */
  dueDate?: string;
  logo?: string;
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
  logo: "businessLogo",
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
  logo: "businessLogo",
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
  /** Label for documentDate input (e.g. "Invoice date") */
  documentDateLabel?: string;
  /** Always show bank/UPI details; toggle only controls document visibility */
  alwaysShowBankDetails?: boolean;
};

export function BusinessDetailsFields({
  fields = BUSINESS_FIELD_NAMES,
  title = "From (business)",
  showBankSection = true,
  documentDateLabel = "Quotation date",
  alwaysShowBankDetails = false,
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
  const logo = useWatch({ control, name: f.logo || f.name });

  const bankName = useWatch({ control, name: f.bankName || f.name });
  const bankAcc = useWatch({ control, name: f.bankAccountNumber || f.name });
  const bankIfsc = useWatch({ control, name: f.bankIFSC || f.name });
  const bankBranch = useWatch({ control, name: f.bankBranch || f.name });
  const upiId = useWatch({ control, name: f.upiId || f.name });
  const showBankRaw = useWatch({ control, name: f.showBankDetails || f.name });
  const showUpiRaw = useWatch({ control, name: f.showUPIDetails || f.name });

  const showBank = f.showBankDetails ? !!showBankRaw : false;
  const showUpi = f.showUPIDetails ? !!showUpiRaw : false;
  const hasBank = !!(bankName || bankAcc || bankIfsc || bankBranch);
  const hasUpi = !!upiId;
  const address = join(a1, a2, city, state, pincode, country);

  const onLogoFile = (file: File | undefined) => {
    if (!f.logo || !file) return;
    // Allow up to ~1.5MB for device photos
    if (file.size > 1_500_000) return;
    const reader = new FileReader();
    reader.onload = () =>
      setValue(f.logo!, String(reader.result || ""), { shouldDirty: true });
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {title}
      </p>

      <div className="flex flex-row items-start gap-3">
        {/* Logo */}
        {f.logo ? (
          <div className="order-2 ml-auto flex shrink-0 flex-col items-center gap-1.5">
            <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-white">
              {logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={String(logo)}
                  alt="Logo"
                  className="h-full w-full object-contain p-1"
                />
              ) : (
                <ImageIcon className="h-6 w-6 text-slate-300" />
              )}
            </div>
            <label className="inline-flex cursor-pointer items-center justify-center rounded-md border border-slate-200 bg-white px-2 py-1 text-[10px] font-semibold text-slate-700 shadow-sm hover:bg-slate-50">
              {logo ? "Change logo" : "Choose file"}
              <input
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(e) => {
                  onLogoFile(e.target.files?.[0]);
                  e.target.value = "";
                }}
              />
            </label>
            {logo ? (
              <button
                type="button"
                className="text-[10px] text-red-500 hover:text-red-600"
                onClick={() => setValue(f.logo!, null, { shouldDirty: true })}
              >
                Remove
              </button>
            ) : null}
            <input type="hidden" {...register(f.logo)} />
          </div>
        ) : null}

        {/* Business card */}
        <div className="order-1 min-w-0 flex-1 space-y-2 rounded-lg border border-slate-200 bg-slate-50/80 p-3 text-sm">
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
      </div>

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

      {(f.documentDate || f.validUntil || f.dueDate) && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {f.documentDate ? (
            <FormField label={documentDateLabel} required>
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
          {f.dueDate ? (
            <FormField label="Due date" required>
              <Input type="date" className="h-9" {...register(f.dueDate)} />
            </FormField>
          ) : null}
          {f.validUntil && !f.dueDate ? (
            <FormField label="Valid until" required>
              <Input type="date" className="h-9" {...register(f.validUntil)} />
            </FormField>
          ) : null}
        </div>
      )}

      {showBankSection && f.showBankDetails ? (
        <div className="space-y-3 border-t border-slate-100 pt-3">
          {alwaysShowBankDetails ? (
            <>
              <div className="flex flex-col gap-2 rounded-lg border border-slate-200 bg-slate-50/80 p-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="flex items-center gap-2 text-xs font-medium text-slate-700">
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
                {f.showUPIDetails ? (
                  <div className="flex items-center justify-between gap-2 border-t border-slate-200/80 pt-2">
                    <span className="flex items-center gap-2 text-xs font-medium text-slate-700">
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
                ) : null}
              </div>
              {hasBank ? (
                <div className="space-y-1 rounded-md border border-slate-200 bg-white p-3 text-xs text-slate-700">
                  {bankName ? <p className="font-medium">{bankName}</p> : null}
                  {bankAcc ? <p>A/C: {bankAcc}</p> : null}
                  {bankIfsc ? <p>IFSC: {bankIfsc}</p> : null}
                  {bankBranch ? <p>Branch: {bankBranch}</p> : null}
                </div>
              ) : (
                <p className="text-xs text-slate-400">No bank details on file.</p>
              )}
              {f.showUPIDetails ? (
                hasUpi ? (
                  <div className="rounded-md border border-slate-200 bg-white p-3 text-xs text-slate-700">
                    UPI: {upiId}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400">No UPI on file.</p>
                )
              ) : null}
            </>
          ) : (
            <>
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
            </>
          )}
        </div>
      ) : null}
    </div>
  );
}
