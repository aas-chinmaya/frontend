"use client";

import { useBranchesByUser } from "@/modules/business/hooks/useBranchesByUser";

export default function TestPage() {
  const { debug } = useBranchesByUser("");

  console.log("User → Branch → Business:", debug);

  return null;
}