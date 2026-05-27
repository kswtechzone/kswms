'use client';

import { API_BASE_URL } from '@/lib/api';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, Users, Hotel, Settings, LogOut, Bell, Search,
  ShieldCheck, Globe, UtensilsCrossed, Package, Wallet, Briefcase,
  Building2, Lock, AlertTriangle, RefreshCw, Loader2, Scissors
} from 'lucide-react';

import NotificationBell from './dashboard/NotificationBell';

export interface MenuItem {
  name: string;
  href: string;
  icon: any;
  moduleKey?: string; // If set, item is only visible when this module is enabled
}

interface DashboardShellProps {
  children: React.ReactNode;
  mode: 'admin' | 'org';
}

// ─── Admin Menu (Super Admin sees everything) ────────────────────────
const ADMIN_MENU: MenuItem[] = [
  { name: 'Overview', href: '/admin', icon: LayoutDashboard },
  { name: 'Organizations', href: '/admin/organizations', icon: Building2 },
  { name: 'Audit Logs', href: '/admin/logs', icon: ShieldCheck },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Brands', href: '/admin/brands', icon: Hotel },
  { name: 'Websites', href: '/admin/websites', icon: Globe },
  { name: 'F&B Management', href: '/admin/restaurant', icon: UtensilsCrossed },
  { name: 'Billing & POS', href: '/admin/pos', icon: Wallet },
  { name: 'Inventory', href: '/admin/inventory', icon: Package },
  { name: 'HR Staff', href: '/admin/hr', icon: Briefcase },
  { name: 'Finance', href: '/admin/finance', icon: Wallet },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

// ─── Org Menu (Org Admin — module-gated) ─────────────────────────────
const ORG_MENU: MenuItem[] = [
  { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Hotel Management', href: '/dashboard/hotel-management', icon: Hotel, moduleKey: 'HOTEL_MANAGEMENT' },
  { name: 'F&B Management', href: '/dashboard/restaurant', icon: UtensilsCrossed, moduleKey: 'RESTAURANT' },
  { name: 'Billing & POS', href: '/dashboard/pos', icon: Wallet, moduleKey: 'POS' },
  { name: 'Inventory', href: '/dashboard/inventory', icon: Package, moduleKey: 'INVENTORY' },
  { name: 'HR & Staffing', href: '/dashboard/hr', icon: Briefcase, moduleKey: 'HR' },
  { name: 'Finance', href: '/dashboard/finance', icon: Wallet, moduleKey: 'FINANCE' },
  { name: 'Website Builder', href: '/dashboard/website', icon: Globe, moduleKey: 'WEBSITE' },
  { name: 'Parlor Management', href: '/dashboard/parlor', icon: Scissors, moduleKey: 'PARLOR' },
  { name: 'Customer CRM', href: '/dashboard/crm', icon: Users, moduleKey: 'CRM' },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export default function DashboardShell({ children, mode }: DashboardShellProps) {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [enabledModules, setEnabledModules] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [fetchError, setFetchError] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      setUser(parsed);

      if (mode === 'org') {
        fetchLiveModules(parsed.organization?.id);
      } else {
        // Admin sees everything
        setEnabledModules([]);
        setLoaded(true);
      }
    } else {
      window.location.href = '/login';
    }
  }, [mode]);

  const fetchLiveModules = async (orgId: string) => {
    if (!orgId) { setLoaded(true); return; }
    setFetchError(false);
    try {
      const res = await fetch(`${API_BASE_URL}/organizations/${orgId}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` }
      });
      if (res.ok) {
        const org = await res.json();
        setEnabledModules(org.enabledModules || []);
        // Sync localStorage
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
          const parsed = JSON.parse(savedUser);
          parsed.organization = { ...parsed.organization, enabledModules: org.enabledModules };
          localStorage.setItem('user', JSON.stringify(parsed));
        }
      } else {
        if (res.status === 401) {
          localStorage.clear();
          window.location.href = '/login';
          return;
        }
        setFetchError(true);
        fallbackToLocal();
      }
    } catch {
      setFetchError(true);
      fallbackToLocal();
    } finally {
      setLoaded(true);
    }
  };

  const fallbackToLocal = () => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setEnabledModules(JSON.parse(savedUser).organization?.enabledModules || ['DASHBOARD']);
    }
  };

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      setUser(parsed);
      setLoaded(true);
      if (mode === 'org') {
        fetchLiveModules(parsed.organization?.id);
      }
    }
  }, [pathname]); // Re-sync on every navigation

  if (!loaded) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--content-bg)' }}>
        <div style={{ textAlign: 'center' }}>
          <Loader2 className="spin" size={48} color="var(--primary)" />
          <p style={{ marginTop: '16px', color: 'var(--text-muted)', fontWeight: 500 }}>Initializing your workspace...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const isAdmin = mode === 'admin';
  const menuItems = isAdmin ? ADMIN_MENU : ORG_MENU;

  // Sidebar brand
  const brandTitle = isAdmin
    ? <><span style={{ color: 'var(--accent)' }}>KSW</span><span style={{ color: 'var(--sidebar-text)' }}>HOSPITALITY</span></>
    : user.organization?.name || 'My Business';
  const brandSub = isAdmin ? 'Super Admin Console' : 'Business Workspace';

  return (
    <div style={{ minHeight: '100vh', background: 'var(--content-bg)' }}>
      {/* Realtime Route Loading Indicator */}
      <div 
        key={`loader-${pathname}`}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          height: '3px',
          background: 'var(--primary)',
          zIndex: 10000,
          boxShadow: '0 0 10px var(--primary)',
          animation: 'routeLoader 1.5s ease-out forwards'
        }}
      />
      <style>{`
        @keyframes routeLoader {
          0% { width: 0; opacity: 1; }
          20% { width: 30%; }
          50% { width: 70%; }
          100% { width: 100%; opacity: 0; }
        }
      `}</style>
      {/* ─── Sidebar ────────────────────────────────────── */}
      <aside className="admin-sidebar" style={{ background: 'var(--sidebar-bg)', borderRight: '1px solid var(--border)' }}>
        <div style={{ marginBottom: 'var(--space-8)', padding: '0 var(--space-2)' }}>
          <h2 style={{ fontSize: isAdmin ? '1.5rem' : '1.25rem', fontWeight: 800, letterSpacing: '-0.025em', display: 'flex', flexDirection: 'column' }}>
            {isAdmin ? brandTitle : <span style={{ color: 'var(--accent)' }}>{brandTitle}</span>}
            <span style={{ color: 'var(--sidebar-text)', fontSize: '0.75rem', fontWeight: 500, marginTop: '4px' }}>{brandSub}</span>
          </h2>
        </div>

        {fetchError && !isAdmin && (
          <div style={{ 
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '8px 12px', borderRadius: 'var(--radius-md)', 
            background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b',
            fontSize: '0.75rem', fontWeight: 600, marginBottom: 'var(--space-4)'
          }}>
            <AlertTriangle size={14} />
            Offline — using cached data
          </div>
        )}

        <nav style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
          {menuItems
            .filter((item) => !item.moduleKey || isAdmin || enabledModules.includes(item.moduleKey))
            .map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link 
                  key={item.name} 
                  href={item.href}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-3)',
                    padding: 'var(--space-3) var(--space-4)',
                    borderRadius: 'var(--radius-md)',
                    textDecoration: 'none',
                    color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                    background: isActive ? 'rgba(166, 118, 83, 0.1)' : 'transparent',
                    transition: 'all 0.2s',
                    fontWeight: 600,
                  }}
                >
                  <Icon size={20} />
                  {item.name}
                </Link>
              );
            })}
        </nav>

        <div style={{ marginTop: 'auto', paddingTop: 'var(--space-8)' }}>
          <button 
            className="btn" 
            style={{ width: '100%', justifyContent: 'flex-start', gap: 'var(--space-3)', background: 'transparent', color: '#ef4444', paddingLeft: 'var(--space-4)' }}
            onClick={() => { localStorage.clear(); window.location.href = '/login'; }}
          >
            <LogOut size={20} /> Sign Out
          </button>
        </div>
      </aside>

      {/* ─── Main Content ───────────────────────────────── */}
      <main className="admin-content">
        <header style={{ 
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
          marginBottom: 'var(--space-8)', paddingBottom: 'var(--space-4)', borderBottom: '1px solid var(--border)'
        }}>
          <div style={{ position: 'relative', width: '300px' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input type="text" placeholder={isAdmin ? 'Search everything...' : 'Search your business...'} className="input" style={{ paddingLeft: '40px', background: 'white' }} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
            {!isAdmin && (
              <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }} title="Refresh modules" onClick={() => fetchLiveModules(user.organization?.id)}>
                <RefreshCw size={18} />
              </button>
            )}
            <NotificationBell />
            <div style={{ height: '32px', width: '1px', background: 'var(--border)' }}></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
              <div style={{ 
                width: '36px', height: '36px', borderRadius: '50%', background: 'var(--primary)', 
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 600, fontSize: '0.875rem'
              }}>
                {user.name?.substring(0, 2).toUpperCase() || 'AD'}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{user.name}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user.role}</span>
              </div>
            </div>
          </div>
        </header>

        <section key={pathname}>{children}</section>
      </main>
    </div>
  );
}
