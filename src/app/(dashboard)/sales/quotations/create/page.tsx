"use client";

import { useRouter } from "next/navigation";
import { QuotationForm } from "@/modules/sales/quotations/components/form/quotation-form";

export default function CreateQuotationPage() {
  const router = useRouter();

  return (
    <div className="w-full space-y-4 ">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">New quotation</h1>
        <p className="text-sm text-muted-foreground">
          Customer, issuer, items, and payment
        </p>
      </div>

      <QuotationForm
        mode="create"
        onSuccess={(quotation) =>
          router.push(`/sales/quotations/${quotation.id}`)
        }
        onCancel={() => router.push("/sales/quotations")}
      />
    </div>
  );
}
