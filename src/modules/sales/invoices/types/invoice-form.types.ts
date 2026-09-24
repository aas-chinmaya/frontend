import type { z } from "zod";
import type { Invoice } from "./invoice.types";
import { invoiceCreateSchema } from "../schemas/invoice.schema";

export type InvoiceFormMode = "create" | "edit";

export interface InvoiceFormProps {
  mode: InvoiceFormMode;
  invoice?: Invoice | null;
  onSuccess?: (invoice: Invoice) => void;
  onCancel?: () => void;
}

export type InvoiceFormValues = z.infer<typeof invoiceCreateSchema>;
