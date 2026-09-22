
"use client";

import { use } from "react";
import { useRouter } from "next/navigation";

import QuotationForm from "@/modules/sales/quotations/components/form/quotation-form";
import { useGetQuotationByIdQuery } from "@/modules/sales/quotations/api/quotation.api";

interface EditQuotationPageProps {
  params: Promise<{ id: string }>;
}

export default function EditQuotationPage({
  params,
}: EditQuotationPageProps) {
  const { id } = use(params);
  const router = useRouter();

  const { data, isLoading, isError } = useGetQuotationByIdQuery(id);

  if (isLoading) {
    return (
      <div className="py-10 text-center text-sm text-muted-foreground">
        Loading quotation…
      </div>
    );
  }

  if (isError || !data?.data) {
    return (
      <div className="py-10 text-center text-sm text-destructive">
        Unable to load quotation.
      </div>
    );
  }

  const quotation = data.data;

  return (
    <div className="w-full space-y-4 px-4 py-6 sm:px-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">
          Edit quotation
        </h1>

        <p className="text-sm text-muted-foreground">
          {quotation.quotationNumber || id}
        </p>
      </div>

      <QuotationForm
        mode="edit"
        quotation={quotation}
        onSuccess={() => router.push("/sales/quotations")}
        onCancel={() => router.push(`/sales/quotations/${id}`)}
      />
    </div>
  );
}
