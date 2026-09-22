import type { Quotation } from "./quotation.types";
import type { QuotationCreateSchema } from "../schemas/quotation.schema";

export type QuotationFormMode = "create" | "edit";

export interface QuotationFormProps {
  mode: QuotationFormMode;
  quotation?: Quotation | null;
  onSuccess?: (quotation: Quotation) => void;
  onCancel?: () => void;
}

export type QuotationFormValues = QuotationCreateSchema;