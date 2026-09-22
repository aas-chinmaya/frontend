"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { PageHeader } from "@/modules/sales/shared/components/ui/page-header";
import { useGetQuotationsQuery } from "@/modules/sales/quotations/api/quotation.api";
import QuotationTable from "@/modules/sales/quotations/components/list/quotation-table";

function dateParams(period: string): { fromDate?: string; toDate?: string } {
  if (period === "all") return {};
  const now = new Date();
  const fmt = (d: Date) => d.toISOString().split("T")[0];
  switch (period) {
    case "today":
      return { fromDate: fmt(now), toDate: fmt(now) };
    case "7d": {
      const from = new Date(now);
      from.setDate(now.getDate() - 6);
      return { fromDate: fmt(from), toDate: fmt(now) };
    }
    case "30d": {
      const from = new Date(now);
      from.setDate(now.getDate() - 29);
      return { fromDate: fmt(from), toDate: fmt(now) };
    }
    case "month":
      return {
        fromDate: fmt(new Date(now.getFullYear(), now.getMonth(), 1)),
        toDate: fmt(now),
      };
    case "year":
      return {
        fromDate: fmt(new Date(now.getFullYear(), 0, 1)),
        toDate: fmt(now),
      };
    default:
      return {};
  }
}

export default function SalesQuotationListPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [period, setPeriod] = useState("all");

  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 350);
    return () => clearTimeout(t);
  }, [searchInput]);

  const { data, isLoading, isFetching } = useGetQuotationsQuery({
    page,
    limit: 10,
    search: search || undefined,
    status: status
      ? (status as
          | "DRAFT"
          | "SENT"
          | "ACCEPTED"
          | "REJECTED"
          | "EXPIRED"
          | "CANCELLED")
      : undefined,
    ...dateParams(period),
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Quotations"
        description="Manage customer quotations"
        actionLabel="Create Quotation"
        onAction={() => router.push("/sales/quotations/create")}
      />

      <QuotationTable
        quotations={data?.data ?? []}
        loading={isLoading || isFetching}
        page={page}
        totalPages={data?.pagination?.totalPages ?? 1}
        search={searchInput}
        status={status}
        period={period}
        onSearchChange={setSearchInput}
        onStatusChange={(v) => {
          setStatus(v);
          setPage(1);
        }}
        onPeriodChange={(v) => {
          setPeriod(v);
          setPage(1);
        }}
        onPageChange={setPage}
      />
    </div>
  );
}
