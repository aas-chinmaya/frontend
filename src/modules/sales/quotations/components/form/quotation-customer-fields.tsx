"use client";

import {
  CustomerPartyFields,
  PROSPECT_FIELD_NAMES,
} from "@/modules/sales/shared/components/party/customer-party-fields";

/** Create & edit — same customer block */
export function QuotationCustomerFields() {
  return (
    <CustomerPartyFields
      fields={PROSPECT_FIELD_NAMES}
      title="Customer"
      showPlaceOfSupply
      showReverseCharge
    />
  );
}
