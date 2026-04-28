"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

export default function Sidebar() {
  const { user, loading } = useAuth();

  // Helper to check for admin/owner role
  const isAdmin = user?.role === "superadmin" || user?.role === "owner";

  if (loading) return <div className="w-64 bg-gray-100 p-6 h-full">Loading...</div>;

  return (
    // Removed 'hidden', 'lg:flex', and 'fixed'
    // 'h-full' and 'w-full' ensure it fills the space given by the layout
    <div className="flex flex-col w-full h-full bg-gray-900 text-white p-6">
      <h3 className="font-bold text-lg mb-6 text-blue-400">Candy ERP</h3>

      <nav className="flex flex-col gap-4">
        
        {/* Intelligence Center: Admin Only */}
        {isAdmin && <Link href="/dashboard" className="text-gray-300 hover:text-white transition-colors">Intelligence Center</Link>}

        {/* Operational: All logged-in users */}
        <Link href="/expenses" className="text-gray-300 hover:text-white transition-colors">Expenses</Link>
        <Link href="/sales" className="text-gray-300 hover:text-white transition-colors">Sales</Link>
        <Link href="/production" className="text-gray-300 hover:text-white transition-colors">Production</Link>
        <Link href="/attendance" className="text-gray-300 hover:text-white transition-colors">Attendance</Link>

        {/* Management Links: Admin Only */}
        {isAdmin && (
          <>
            <Link href="/payroll" className="text-gray-300 hover:text-white transition-colors">Payroll</Link>
            <Link href="/staff" className="text-gray-300 hover:text-white transition-colors">Staff</Link>
            <Link href="/workers" className="text-gray-300 hover:text-white transition-colors">Workers</Link>
          </>
        )}
      </nav>
    </div>
  );
}