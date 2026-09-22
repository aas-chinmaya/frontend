"use client";

import { useMemo, useState } from "react";
import { DataTable, Pagination, Search, TableToolbar } from "@/components/data-table";
import { Switch } from "@/components/ui";
import { ServiceRow } from "@/modules/items/types";
import Container from "@/components/common/Container";
import ServiceActions from "./ServiceActions";

interface Props {
  services: ServiceRow[];
  loading?: boolean;
  page?: number;
  totalPages?: number;
  totalRecords?: number;
  onPageChange?: (page: number) => void;
  onStatusChange?: (id: string, status: boolean) => Promise<void> | void;
}

export default function ServiceTable({
  services,
  loading = false,
  page = 1,
  totalPages = 1,
  totalRecords = 0,
  onPageChange,
  onStatusChange,
}: Props) {
  const [search, setSearch] = useState("");

  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      const searchTerm = search.toLowerCase();
      return (
        service.serviceCode?.toLowerCase().includes(searchTerm) ||
        service.serviceName?.toLowerCase().includes(searchTerm) ||
        service.sacCode?.toLowerCase().includes(searchTerm) ||
        service.category?.categoryName?.toLowerCase().includes(searchTerm) ||
        service.tax?.hsnCode?.toLowerCase().includes(searchTerm)
      );
    });
  }, [services, search]);

  return (
    <div className="space-y-4">
      <TableToolbar>
        <Search placeholder="Search service..." value={search} onChange={setSearch} />
      </TableToolbar>

      <DataTable
        columns={[
          { accessorKey: "serviceCode", header: "Service Code" },
          { accessorKey: "serviceName", header: "Service Name" },
          {
            id: "category",
            header: "Category",
            cell: ({ row }) => <span>{row.original.category?.categoryName ?? "-"}</span>,
          },
          {
            id: "subCategory",
            header: "Sub Category",
            cell: ({ row }) => <span>{row.original.subCategory?.subCategoryName ?? "-"}</span>,
          },
          {
            id: "tax",
            header: "Tax",
            cell: ({ row }) => <span>{row.original.tax?.hsnCode ?? "-"}</span>,
          },
          { accessorKey: "sacCode", header: "SAC Code" },
          { accessorKey: "serviceCharge", header: "Service Charge" },
          { accessorKey: "gstRate", header: "GST Rate" },
          {
            id: "status",
            header: "Status",
            cell: ({ row }) => {
              const serviceId = String(row.original.id ?? "");
              return (
                <Switch
                  checked={row.original.status}
                  onCheckedChange={(next) => serviceId && onStatusChange?.(serviceId, !!next)}
                  aria-label="Toggle service status"
                />
              );
            },
          },
          {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => {
              const serviceId = String(row.original.id ?? "");
              return <ServiceActions id={serviceId} name={row.original.serviceName} />;
            },
            enableSorting: false,
            enableHiding: false,
          },
        ]}
        data={filteredServices}
        loading={loading}
        emptyMessage="No services found."
      />

      <Pagination page={page} totalPages={totalPages} totalRecords={totalRecords} onPageChange={(nextPage) => onPageChange?.(nextPage)} />
    </div>
  );
}
