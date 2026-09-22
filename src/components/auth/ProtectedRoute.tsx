"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

import { useAppSelector } from "@/store/hooks";

const PUBLIC_ROUTES = [
  "/",
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
];

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({
  children,
}: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();

  const {
    user,
    isAuthenticated,
    loading,
    initialized,
  } = useAppSelector((state) => state.auth);

  const isPublicRoute = PUBLIC_ROUTES.some(
    (route) =>
      pathname === route ||
      (route !== "/" && pathname.startsWith(`${route}/`))
  );

  useEffect(() => {
    if (!initialized || loading) {
      return;
    }

    // Logged-in user trying to access login/register/etc.
    if (
      isPublicRoute &&
      isAuthenticated &&
      user
    ) {
      router.replace("/dashboard");
      return;
    }

    // Logged-out user trying to access protected page.
    if (
      !isPublicRoute &&
      (!isAuthenticated || !user)
    ) {
      router.replace("/login");
    }
  }, [
    initialized,
    loading,
    isAuthenticated,
    user,
    isPublicRoute,
    router,
  ]);

  // Wait for auth check.
  if (!initialized || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-sm text-gray-500">
          Loading...
        </div>
      </div>
    );
  }

  // Authenticated user on public page.
  if (
    isPublicRoute &&
    isAuthenticated &&
    user
  ) {
    return null;
  }

  // Unauthenticated user on protected page.
  if (
    !isPublicRoute &&
    (!isAuthenticated || !user)
  ) {
    return null;
  }

  return <>{children}</>;
}