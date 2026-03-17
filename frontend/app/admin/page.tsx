"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function AdminRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");

  useEffect(() => {
    const adminToken = localStorage.getItem("adminToken");
    if (adminToken) {
      // Already logged in — go to redirect target or dashboard
      router.push(redirect ?? "/admin/dashboard");
    } else {
      // Not logged in — preserve redirect param through login
      const loginUrl = redirect
        ? `/admin/login?redirect=${encodeURIComponent(redirect)}`
        : "/admin/login";
      router.push(loginUrl);
    }
  }, [router, redirect]);

  // Show loading state while checking
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        <p className="mt-4 text-gray-600">Redirecting...</p>
      </div>
    </div>
  );
}

export default function AdminPage() {
  return (
    <Suspense fallback={null}>
      <AdminRedirect />
    </Suspense>
  );
}
