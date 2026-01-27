import React from "react";
import { Outlet } from "react-router";
import { Layout } from "../components/ui/Layout";
import { LayoutDashboard, Bell, Wallet, Users, CreditCard } from "lucide-react";

export function AdminPage({ onLogout }) {
  const menuItems = [
    { label: "Dashboard", path: "/admin", icon: LayoutDashboard },
    { label: "Notices", path: "/admin/notice", icon: Bell },
    { label: "Budget", path: "/admin/budget", icon: Wallet },
    { label: "Loan Requests", path: "/admin/loanRequest", icon: CreditCard },
    { label: "Members", path: "/admin/membersdetails", icon: Users },
  ];

  return (
    <Layout role="admin" onLogout={onLogout} menuItems={menuItems}>
      <Outlet />
    </Layout>
  );
}
