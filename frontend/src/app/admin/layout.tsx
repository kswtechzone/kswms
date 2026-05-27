'use client';

import DashboardShell from '../../components/DashboardShell';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <DashboardShell mode="admin">{children}</DashboardShell>;
}
