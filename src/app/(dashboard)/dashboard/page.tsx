"use client";

import { useSearchParams } from "next/navigation";

import { EmptyBusinessDashboard } from "@/config/dashboard";
import BusinessDetails from "@/modules/business/components/BusinessDetails";

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const businessId = searchParams.get("businessId");

  if (!businessId) return <EmptyBusinessDashboard />;

  return <BusinessDetails businessId={businessId} />;
}