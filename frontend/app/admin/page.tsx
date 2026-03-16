"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    // Check if admin token exists
    const adminToken = localStorage.getItem("adminToken");

    if (adminToken) {
      // User is logged in, redirect to dashboard
      router.push("/admin/dashboard");
    } else {
      // User is not logged in, redirect to login
      router.push("/admin/login");
    }
  }, [router]);

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
