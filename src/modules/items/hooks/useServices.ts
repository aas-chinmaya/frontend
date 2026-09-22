"use client";

import { useEffect, useState } from "react";
import { ServiceRow } from "../types";
import { serviceservice } from "../services/service.service";

export function useServices() {
  const [services, setServices] = useState<ServiceRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  async function fetchServices(nextPage = 1) {
    try {
      setLoading(true);
      const response = await serviceservice.getServices(nextPage, 10);
      const payload = response?.data?.data;
      const list = Array.isArray(payload?.data)
        ? payload.data
        : Array.isArray(response?.data?.data)
          ? response.data.data
          : [];

      const normalizedList = list.map((service: any) => ({
        ...service,
        id: String(service?.id ?? service?._id ?? service?.serviceId ?? ""),
      }));

      setServices(normalizedList);
      setPage(Number(payload?.page || nextPage));
      setTotalPages(Number(payload?.totalPages || 1));
      setTotalRecords(Number(payload?.total || normalizedList.length));
    } finally {
      setLoading(false);
    }
  }

  async function changeServiceStatus(id: string, status: boolean) {
    try {
      await serviceservice.updateServiceStatus(id, status);
      await fetchServices(page);
    } catch (error: any) {
      throw error;
    }
  }

  useEffect(() => {
    fetchServices(1);
  }, []);

  return {
    services,
    loading,
    page,
    totalPages,
    totalRecords,
    refetch: fetchServices,
    setPage,
    changeServiceStatus,
  };
}
