"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import BusinessList from "@/modules/business/components/BusinessList";
import { Branch } from "@/modules/business/types";
import {
  deleteBranch,
  deleteBusiness,
  fetchBusinesses,
  selectBusinessRecords,
  selectBusinessStatus,
  selectBusinesses,
} from "@/modules/business/store/businessSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

export default function BusinessPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const businesses = useAppSelector(selectBusinesses);
  const rawBusinesses = useAppSelector(selectBusinessRecords);
  const status = useAppSelector(selectBusinessStatus);

  useEffect(() => {
    void dispatch(fetchBusinesses());
  }, [dispatch]);

  const refresh = () => dispatch(fetchBusinesses());

  const handleDeleteBusiness = async (id: string) => {
    await dispatch(deleteBusiness(id)).unwrap();
  };

  const handleDeleteBranch = async (branch: Branch) => {
    await dispatch(deleteBranch(branch.id)).unwrap();
    await refresh();
  };

  return (
    <div>
      {status === "loading" && businesses.length === 0 ? (
        <div className="border border-dashed bg-white p-10 text-center text-muted">Loading businesses...</div>
      ) : (
        <>
          <BusinessList
            businesses={businesses}
            rawRecords={rawBusinesses}
            onAddBusiness={() => router.push("/business-setup")}
            onAddBranch={(businessId) => router.push(`/business-setup/manage-business/add-branch?businessId=${businessId}`)}
            onEditBusiness={(id) => router.push(`/business-setup/manage-business/edit?id=${id}`)}
            onDeleteBusiness={handleDeleteBusiness}
            onEditBranch={(branch) => {
              const business = rawBusinesses.find((record) =>
                Array.isArray(record.branches) && record.branches.some((item) => String(item.id) === branch.id)
              );
              if (business) {
                router.push(`/business-setup/manage-business/add-branch?businessId=${business.id}&branchId=${branch.id}`);
              }
            }}
            onDeleteBranch={handleDeleteBranch}
          />
        </>
      )}
    </div>
  );
}
