"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

export default function Sidebar() {
  const { user, loading } = useAuth();

  // Helper to check for admin/owner role
  const isAdmin = user?.role === "superadmin" || user?.role === "owner";

  if (loading) return <div style={{ width: "200px", background: "#eee", padding: "20px" }}>Loading...</div>;

  return (
    <div style={{ width: "200px", background: "#eee", padding: "20px" }}>
      <h3>ERP</h3>

      <nav style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        
        {/* Intelligence Center: Admin Only */}
        {isAdmin && <Link href="/dashboard">Intelligence Center</Link>}

        {/* Operational: All logged-in users */}
        <Link href="/expenses">Expenses</Link>
        <Link href="/sales">Sales</Link>
        <Link href="/production">Production</Link>
        <Link href="/attendance">Attendance</Link>

        {/* Management Links: Admin Only */}
        {isAdmin && (
          <>
            <Link href="/payroll">Payroll</Link>
            <Link href="/staff">Staff</Link>
            <Link href="/workers">Workers</Link>
          </>
        )}
      </nav>
    </div>
  );
}