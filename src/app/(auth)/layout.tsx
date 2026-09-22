"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

import "@/app/globals.css";
import AuthBanner from "@/modules/auth/components/AuthBanner";
import { useAppSelector } from "@/store/hooks";

const AUTH_ROUTES = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/verify-otp",
  "/create-password",
];

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const {
    user,
    isAuthenticated,
    loading,
    initialized,
  } = useAppSelector((state) => state.auth);

  const isAuthRoute = AUTH_ROUTES.some(
    (route) =>
      pathname === route ||
      pathname.startsWith(`${route}/`)
  );

  useEffect(() => {
    // Don't do anything until checkAuth has completed.
    if (!initialized || loading) {
      return;
    }

    // Already logged in → don't allow any auth page.
    if (isAuthRoute && isAuthenticated && user) {
      router.replace("/dashboard");
    }
  }, [
    initialized,
    loading,
    isAuthenticated,
    user,
    isAuthRoute,
    pathname,
    router,
  ]);

  // Wait until authentication status is known.

  // if (!initialized || loading) {
  //   return (
  //     <main className="flex min-h-screen items-center justify-center bg-gray-50">
  //       <div className="text-sm text-gray-500">
  //         Loading...
  //       </div>
  //     </main>
  //   );
  // }

  // Prevent authenticated users from seeing auth pages
  // while router.replace() is executing.
  if (isAuthRoute && isAuthenticated && user) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* Left Side */}
        <div className="hidden lg:flex">
          <AuthBanner />
        </div>

        {/* Right Side */}
        <div className="flex items-center justify-center bg-white px-6 py-10">
          <div className="w-full max-w-md">
            {children}
          </div>
        </div>
      </div>
    </main>
  );
}







// import "@/app/globals.css";
// import AuthBanner from "@/modules/auth/components/AuthBanner";

// export default function AuthLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <main className="min-h-screen bg-gray-50">
//       <div className="grid min-h-screen lg:grid-cols-2">
//         {/* Left Side */}
//         <div className="hidden lg:flex">
//           <AuthBanner />
//         </div>

//         {/* Right Side */}
//         <div className="flex items-center justify-center bg-white px-6 py-10">
//           <div className="w-full max-w-md">
//             {children}
//           </div>
//         </div>
//       </div>
//     </main>
//   );
// }