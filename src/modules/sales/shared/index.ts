export { CustomerSearchSelect, ItemSearchSelect } from "./components";
export type { SelectedCustomer, CustomerAddress, SelectedItem } from "./components";

export {
  CustomerPartyFields,
  PROSPECT_FIELD_NAMES,
  BUYER_FIELD_NAMES,
} from "./components/party/customer-party-fields";
export type { CustomerPartyFieldNames } from "./components/party/customer-party-fields";

export {
  BusinessDetailsFields,
  BUSINESS_FIELD_NAMES,
  SELLER_FIELD_NAMES,
} from "./components/party/business-details-fields";
export type { BusinessFieldNames } from "./components/party/business-details-fields";

export { FormField } from "./components/ui/form-field";
export { PageHeader } from "./components/ui/page-header";
export { FormPageHeader } from "./components/ui/form-page-header";
export { StatusBadge } from "./components/ui/status-badge";
export { RowActions } from "./components/ui/row-actions";

export { useBusiness } from "./hooks/use-business";
export type { BusinessUser, BusinessInfo, BusinessContext } from "./hooks/use-business";
export { useCustomer } from "./hooks/use-customer";
export type { Customer } from "./hooks/use-customer";


export {
  amountInWords,
  formatINR,
  STATE_CODE_MAP,
  getStateCode,
  getStateOptions,
  normalizeStateKey,
} from "./utils";

export {
  SalesTable,
  SalesTableHead,
  SalesTh,
  SalesTableFoot,
  SalesSectionCard,
  SalesRowAddButton,
  SalesRowRemoveButton,
  SalesDiscountToggle,
} from "./components/ui/sales-table";
