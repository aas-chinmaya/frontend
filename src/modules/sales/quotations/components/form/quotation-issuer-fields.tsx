"use client";

import {
  BusinessDetailsFields,
  BUSINESS_FIELD_NAMES,
} from "@/modules/sales/shared/components/party/business-details-fields";

/** Quotation issuer block — reuses shared BusinessDetailsFields */
export function QuotationIssuerFields() {
  return (
    <BusinessDetailsFields
      fields={BUSINESS_FIELD_NAMES}
      title="From (your business)"
      showBankSection
    />
  );
}
