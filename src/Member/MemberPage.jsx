import React from "react";
import { Outlet } from "react-router-dom";
import { Layout } from "../components/ui/Layout";
import { LayoutDashboard, Bell, FileText, User, PlusCircle } from "lucide-react";

export function MemberPage({ onLogout }) {
  const menuItems = [
    { label: "Dashboard", path: "/member", icon: LayoutDashboard },
    { label: "Notices", path: "/member/notices", icon: Bell },
    { label: "Loan History", path: "/member/loans", icon: FileText },
    { label: "Contact", path: "/member/contacts", icon: User },
    { label: "Create Request", path: "/member/createrequest", icon: PlusCircle },
  ];

  return (
    <Layout role="member" onLogout={onLogout} menuItems={menuItems}>
      <Outlet />
    </Layout>
  );
}
