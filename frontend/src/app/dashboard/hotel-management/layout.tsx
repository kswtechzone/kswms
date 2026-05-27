'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  BedDouble, 
  CalendarCheck, 
  Users, 
  ChevronLeft,
  ArrowLeft
} from 'lucide-react';

export default function HMSLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const menuItems = [
    { name: 'HMS Overview', href: '/dashboard/hotel-management', icon: LayoutDashboard },
    { name: 'Room Inventory', href: '/dashboard/hotel-management/rooms', icon: BedDouble },
    { name: 'Bookings List', href: '/dashboard/hotel-management/bookings', icon: CalendarCheck },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      {/* HMS Top Navigation Bar */}
      <header style={{ 
        background: 'var(--bg-main)', 
        borderBottom: '1px solid var(--border)',
        padding: 'var(--space-4) var(--space-8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-6)' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)', margin: 0 }}>Hotel Management</h2>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0, marginTop: '2px' }}>OPERATIONS CORE</p>
          </div>
          
          <div style={{ width: '1px', height: '32px', background: 'var(--border)', margin: '0 var(--space-2)' }}></div>

          <nav style={{ display: 'flex', gap: 'var(--space-2)' }}>
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link 
                  key={item.name} 
                  href={item.href}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-2)',
                    padding: 'var(--space-2) var(--space-4)',
                    borderRadius: 'var(--radius-md)',
                    textDecoration: 'none',
                    color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                    background: isActive ? 'rgba(166, 118, 83, 0.1)' : 'transparent',
                    transition: 'all 0.2s',
                    fontWeight: isActive ? 600 : 500,
                    fontSize: '0.875rem'
                  }}
                >
                  <Icon size={16} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        <Link href="/dashboard" style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 'var(--space-2)', 
          color: 'var(--text-muted)',
          textDecoration: 'none',
          fontSize: '0.875rem',
          fontWeight: 500,
          padding: 'var(--space-2) var(--space-4)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border)'
        }}>
          <ArrowLeft size={16} /> Back
        </Link>
      </header>

      {/* HMS Content */}
      <main style={{ padding: 'var(--space-8)', flex: 1 }}>
        {children}
      </main>
    </div>
  );
}
