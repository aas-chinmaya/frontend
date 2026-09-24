// ============================================================
// INVOICE TYPES
// ============================================================

export type InvoiceStatus =
  | "DRAFT"
  | "FINALIZED"
  | "SENT"
  | "PAID"
  | "PARTIALLY_PAID"
  | "OVERDUE"
  | "CANCELLED";

export type InvoiceType = "B2B" | "B2C" | "EXPORT" | "SEZ";

export type PaymentStatus =
  | "PENDING"
  | "PARTIAL"
  | "PAID"
  | "OVERDUE";

export type DiscountType = "PERCENTAGE" | "FIXED";

/** INTRA_STATE → CGST+SGST | INTER_STATE → IGST */
export type TaxType = "INTRA_STATE" | "INTER_STATE";

export interface InvoiceCustomer {
  id: string;
  name: string;
  phone?: string | null;
  email?: string | null;
  gstin?: string | null;
}

export interface InvoiceItem {
  id?: string;
  itemId?: string | null;
  itemName?: string | null;
  description?: string | null;
  hsnSac?: string | null;
  unit?: string | null;
  quantity: number;
  /** Unit price */
  price?: number;
  /** Alias of price (API / legacy) */
  rate?: number;
  discount?: number;
  discountType?: DiscountType;
  /** Combined GST rate % — split into CGST/SGST or IGST by taxType */
  taxRate?: number;
  taxAmount?: number;
  cgstRate?: number;
  cgstAmount?: number;
  sgstRate?: number;
  sgstAmount?: number;
  igstRate?: number;
  igstAmount?: number;
  /** Line total after discount + tax */
  total?: number;
  /** Alias of total (API / legacy) */
  amount?: number;
  stockAvailable?: number | null;
}

export interface Invoice {
  id: string;
  tenantId: string;
  branchId?: string | null;
  invoiceNumber?: string | null;
  invoiceDate: string;
  dueDate?: string | null;
  financialYear?: string | null;
  invoiceStatus: InvoiceStatus;
  invoiceType?: InvoiceType | null;

  businessName: string;
  businessLegalName?: string | null;
  businessGSTIN?: string | null;
  businessPAN?: string | null;
  businessPhone?: string | null;
  businessEmail?: string | null;
  businessAddressLine1?: string | null;
  businessAddressLine2?: string | null;
  businessCity?: string | null;
  businessState?: string | null;
  businessStateCode?: string | null;
  businessPincode?: string | null;
  businessCountry: string;


businessBankName?: string | null;
businessBankAccountNumber?: string | null;
businessBankIFSC?: string | null;
businessBankBranch?: string | null;
businessUPIId?: string | null;

showBankDetails: boolean;
showUPIDetails: boolean;

  prospectName: string;
  prospectCompanyName?: string | null;
  prospectGSTIN?: string | null;
  prospectPAN?: string | null;
  prospectPhone?: string | null;
  prospectEmail?: string | null;
  prospectAddressLine1?: string | null;
  prospectAddressLine2?: string | null;
  prospectCity?: string | null;
  prospectState?: string | null;
  prospectStateCode?: string | null;
  prospectPincode?: string | null;
  prospectCountry: string;

  customerId?: string | null;
  customer?: InvoiceCustomer | null;

  placeOfSupply?: string | null;
  placeOfSupplyCode?: string | null;
  taxType?: TaxType | null;
  reverseCharge: boolean;
  isExport: boolean;
  isSEZ: boolean;
  currency: string;
  exchangeRate?: number | null;

  totalItems: number;
  totalQuantity: number;
  taxableAmount: number;
  discountAmount: number;
  cgstAmount: number;
  sgstAmount: number;
  igstAmount: number;
  cessAmount: number;
  roundOffAmount: number;
  grandTotal: number;

  acceptedAt?: string | null;
  acceptedBy?: string | null;
  rejectedAt?: string | null;
  rejectedBy?: string | null;
  rejectionReason?: string | null;

  paymentStatus?: PaymentStatus | null;
  paymentMethod?: string | null;
  paidAmount?: number | null;
  paymentDate?: string | null;
  transactionId?: string | null;

  notes?: string | null;
  termsAndConditions?: string | null;
  signature?: string | null;
  printCount: number;
  items: InvoiceItem[];

  createdBy: string;
  updatedBy?: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface InvoiceListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: InvoiceStatus;
  customerId?: string;
  branchId?: string;
  financialYear?: string;
  fromDate?: string;
  toDate?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface InvoicePagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface InvoiceListResponse {
  success: boolean;
  message: string;
  data: Invoice[];
  pagination?: InvoicePagination;
}

export interface InvoiceResponse {
  success: boolean;
  message: string;
  data: Invoice;
}

export interface InvoiceCreatePayload {
  /** @deprecated never send — backend auth */
  tenantId?: string;
  /** @deprecated never send — backend auth */
  branchId?: string | null;
  invoiceDate: string;
  dueDate?: string | null;
  financialYear?: string | null;

  businessName: string;
  businessLegalName?: string | null;
  businessGSTIN?: string | null;
  businessPAN?: string | null;
  businessPhone?: string | null;
  businessEmail?: string | null;
  businessAddressLine1?: string | null;
  businessAddressLine2?: string | null;
  businessCity?: string | null;
  businessState?: string | null;
  businessStateCode?: string | null;
  businessPincode?: string | null;
  businessCountry?: string;


businessBankName?: string | null;
businessBankAccountNumber?: string | null;
businessBankIFSC?: string | null;
businessBankBranch?: string | null;
businessUPIId?: string | null;

showBankDetails?: boolean;
showUPIDetails?: boolean;

  prospectName: string;
  prospectCompanyName?: string | null;
  prospectGSTIN?: string | null;
  prospectPAN?: string | null;
  prospectPhone?: string | null;
  prospectEmail?: string | null;
  prospectAddressLine1?: string | null;
  prospectAddressLine2?: string | null;
  prospectCity?: string | null;
  prospectState?: string | null;
  prospectStateCode?: string | null;
  prospectPincode?: string | null;
  prospectCountry?: string;

  customerId?: string | null;
  placeOfSupply?: string | null;
  placeOfSupplyCode?: string | null;
  taxType?: TaxType | null;
  reverseCharge?: boolean;
  isExport?: boolean;
  isSEZ?: boolean;
  currency?: string;
  exchangeRate?: number | null;

  items: InvoiceItem[];

  totalItems?: number;
  totalQuantity?: number;
  taxableAmount?: number;
  discountAmount?: number;
  cgstAmount?: number;
  sgstAmount?: number;
  igstAmount?: number;
  cessAmount?: number;
  roundOffAmount?: number;
  grandTotal?: number;

  notes?: string | null;
  termsAndConditions?: string | null;
  signature?: string | null;
  status?: InvoiceStatus;
  /** @deprecated never send — backend auth */
  createdBy?: string;
}

export interface InvoiceUpdatePayload
  extends Partial<Omit<InvoiceCreatePayload, "tenantId" | "createdBy">> {
  updatedBy?: string;
}

/** PATCH /invoices/:id/status */
export interface InvoiceStatusChangePayload {
  status: InvoiceStatus;
  remarks?: string;
}