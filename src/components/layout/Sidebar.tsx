"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

export default function Sidebar() {
  const { user, loading } = useAuth();

  // Helper to check for admin/owner role
  const isAdmin = user?.role === "superadmin" || user?.role === "owner";

  if (loading) return <div className="w-64 bg-gray-100 p-6 h-full">Loading...</div>;

  return (
    // 'hidden' on mobile (by default), 'flex' on large screens (lg:)
    // 'fixed' ensures it sits on top of content for mobile toggle
    <div className="hidden lg:flex flex-col w-64 bg-gray-100 p-6 h-screen fixed top-0 left-0">
      <h3 className="font-bold text-lg mb-6">ERP</h3>

      <nav className="flex flex-col gap-4">
        
        {/* Intelligence Center: Admin Only */}
        {isAdmin && <Link href="/dashboard" className="text-gray-700 hover:text-black">Intelligence Center</Link>}

        {/* Operational: All logged-in users */}
        <Link href="/expenses" className="text-gray-700 hover:text-black">Expenses</Link>
        <Link href="/sales" className="text-gray-700 hover:text-black">Sales</Link>
        <Link href="/production" className="text-gray-700 hover:text-black">Production</Link>
        <Link href="/attendance" className="text-gray-700 hover:text-black">Attendance</Link>

        {/* Management Links: Admin Only */}
        {isAdmin && (
          <>
            <Link href="/payroll" className="text-gray-700 hover:text-black">Payroll</Link>
            <Link href="/staff" className="text-gray-700 hover:text-black">Staff</Link>
            <Link href="/workers" className="text-gray-700 hover:text-black">Workers</Link>
          </>
        )}
      </nav>
    </div>
  );
}