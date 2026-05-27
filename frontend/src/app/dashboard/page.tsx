'use client';

import { API_BASE_URL } from '@/lib/api';

import React, { useEffect, useState } from 'react';
import { 
  CreditCard, Users, Hotel, Loader2, AlertTriangle, WifiOff,
  Utensils, Scissors, Globe, Package, DollarSign, User, ShieldAlert, Award, Star, Gem, Compass, Lock
} from 'lucide-react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

// Next.js Dynamic Imports (SSR Disabled)
const HotelWidget = dynamic(() => import('@/components/dashboard/HotelWidget'), { ssr: false });
const PosWidget = dynamic(() => import('@/components/dashboard/PosWidget'), { ssr: false });
const ParlorWidget = dynamic(() => import('@/components/dashboard/ParlorWidget'), { ssr: false });
const WebsiteWidget = dynamic(() => import('@/components/dashboard/WebsiteWidget'), { ssr: false });
const InventoryWidget = dynamic(() => import('@/components/dashboard/InventoryWidget'), { ssr: false });
const HrWidget = dynamic(() => import('@/components/dashboard/HrWidget'), { ssr: false });
const FinanceWidget = dynamic(() => import('@/components/dashboard/FinanceWidget'), { ssr: false });
const LiveWebsitePreviewShowcase = dynamic(() => import('@/components/dashboard/LiveWebsitePreviewShowcase'), { ssr: false });
const UserProfileWidget = dynamic(() => import('@/components/dashboard/UserProfileWidget'), { ssr: false });

interface LoyaltyItem {
  organizationName: string;
  organizationSlug: string;
  loyaltyPoints: number;
  notes?: string;
  tags?: string[];
}

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [orgData, setOrgData] = useState<any>(null);
  const [enabledModules, setEnabledModules] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const [errorCode, setErrorCode] = useState<number | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      setUser(parsed);
      
      const isIndividual = parsed.organization?.slug === 'kswuser' || 
                           parsed.organization?.slug?.startsWith('kswuser-') ||
                           parsed.role === 'USER';

      if (isIndividual) {
        setLoading(false);
      } else {
        fetchLiveOrg(parsed.organization?.id);
      }
    } else {
      window.location.href = '/login';
    }
  }, []);

  const fetchLiveOrg = async (orgId: string) => {
    if (!orgId) { setLoading(false); return; }
    setFetchError(false);
    setErrorCode(null);
    try {
      const res = await fetch(`${API_BASE_URL}/organizations/${orgId}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` }
      });
      if (res.ok) {
        const org = await res.json();
        setOrgData(org);
        setEnabledModules(org.enabledModules || []);
      } else {
        if (res.status === 401) {
          localStorage.clear();
          window.location.href = '/login';
          return;
        }
        setErrorCode(res.status);
        setFetchError(true);
        fallback();
      }
    } catch {
      setFetchError(true);
      fallback();
    } finally {
      setLoading(false);
    }
  };

  const fallback = () => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      setEnabledModules(parsed.organization?.enabledModules || ['DASHBOARD']);
    }
  };

  if (!user) return null;

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px', color: 'var(--text-muted)' }}>
        <Loader2 size={24} style={{ marginRight: '8px' }} className="animate-spin" />
        Loading your workspace...
      </div>
    );
  }

  const isIndividual = user.organization?.slug === 'kswuser' || 
                       user.organization?.slug?.startsWith('kswuser-') ||
                       user.role === 'USER';

  // --- RENDERING INDIVIDUAL USER BASIC PROFILE LAYOUT ---
  if (isIndividual) {
    return <UserProfileWidget user={user} />;
  }

  // --- RENDERING REGULAR BUSINESS ORGANIZATION DASHBOARD ---
  const userCount = orgData?._count?.users ?? 0;
  const hotelCount = orgData?._count?.hotels ?? 0;
  const restaurantCount = orgData?._count?.restaurants ?? 0;
  const parlorCount = orgData?._count?.parlorServices ?? 0;
  const websiteCount = orgData?._count?.websites ?? 0;
  const inventoryCount = orgData?._count?.inventory ?? 0;
  const staffCount = orgData?._count?.staff ?? 0;
  const expensesCount = orgData?._count?.expenses ?? 0;
  const guestCount = orgData?._count?.guests ?? 0;

  const totalPossibleModules = 8;

  // Dynamically map active modules to stat cards
  const activeModuleKPIs: any[] = [];
  if (enabledModules.includes('HOTEL_MANAGEMENT')) {
    activeModuleKPIs.push({
      title: 'Hotels',
      value: hotelCount,
      icon: <Hotel size={24} />,
      bg: 'rgba(245, 158, 11, 0.1)',
      color: '#f59e0b'
    });
  }
  if (enabledModules.includes('POS')) {
    activeModuleKPIs.push({
      title: 'Restaurants',
      value: restaurantCount,
      icon: <Utensils size={24} />,
      bg: 'rgba(16, 185, 129, 0.1)',
      color: '#10b981'
    });
  }
  if (enabledModules.includes('CRM')) {
    activeModuleKPIs.push({
      title: 'CRM Registered Guests',
      value: guestCount,
      icon: <Users size={24} />,
      bg: 'rgba(225, 29, 72, 0.1)',
      color: '#e11d48'
    });
  }
  if (enabledModules.includes('PARLOR')) {
    activeModuleKPIs.push({
      title: 'Parlor Treatments',
      value: parlorCount,
      icon: <Scissors size={24} />,
      bg: 'rgba(139, 92, 246, 0.1)',
      color: '#8b5cf6'
    });
  }
  if (enabledModules.includes('WEBSITE')) {
    activeModuleKPIs.push({
      title: 'Published Sites',
      value: websiteCount,
      icon: <Globe size={24} />,
      bg: 'rgba(59, 130, 246, 0.1)',
      color: '#3b82f6'
    });
  }
  if (enabledModules.includes('INVENTORY')) {
    activeModuleKPIs.push({
      title: 'Stock Items',
      value: inventoryCount,
      icon: <Package size={24} />,
      bg: 'rgba(236, 72, 153, 0.1)',
      color: '#ec4899'
    });
  }
  if (enabledModules.includes('HR')) {
    activeModuleKPIs.push({
      title: 'Active Staff',
      value: staffCount,
      icon: <Users size={24} />,
      bg: 'rgba(14, 165, 233, 0.1)',
      color: '#0ea5e9'
    });
  }
  if (enabledModules.includes('FINANCE')) {
    activeModuleKPIs.push({
      title: 'Expenses Tracked',
      value: expensesCount,
      icon: <DollarSign size={24} />,
      bg: 'rgba(16, 185, 129, 0.1)',
      color: '#10b981'
    });
  }

  return (
    <div>
      {/* Error Banner */}
      {fetchError && (
        <div style={{ 
          display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
          padding: 'var(--space-4)', borderRadius: 'var(--radius-md)',
          background: errorCode === 404 ? 'rgba(239, 68, 68, 0.08)' : 'rgba(245, 158, 11, 0.08)',
          border: `1px solid ${errorCode === 404 ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.2)'}`,
          marginBottom: 'var(--space-6)'
        }}>
          {errorCode === 404 ? <AlertTriangle size={20} color="#ef4444" /> : <WifiOff size={20} color="#f59e0b" />}
          <div>
            <span style={{ fontWeight: 600, fontSize: '0.875rem', color: errorCode === 404 ? '#ef4444' : '#f59e0b' }}>
              {errorCode === 404 ? 'Organization Not Found' : 'Connection Issue'}
            </span>
            <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
              {errorCode === 404 
                ? 'Your organization could not be found. Contact your Super Admin.' 
                : 'Could not reach the server. Showing cached data.'}
            </p>
          </div>
          <button className="btn" style={{ marginLeft: 'auto', fontSize: '0.8125rem', padding: '6px 14px', border: '1px solid var(--border)' }} onClick={() => fetchLiveOrg(user.organization?.id)}>
            Retry
          </button>
        </div>
      )}

      <div style={{ marginBottom: 'var(--space-8)' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 'var(--space-2)' }}>Business Overview</h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Welcome back, <span style={{ color: 'var(--primary)', fontWeight: 600 }}>{user.name}</span>! Here is the latest on <span style={{ fontWeight: 600 }}>{user.organization?.name}</span>.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="stats-grid" style={{ marginBottom: 'var(--space-8)' }}>
        <div className="card stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ padding: 'var(--space-2)', borderRadius: 'var(--radius-md)', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>
              <CreditCard size={24} />
            </div>
          </div>
          <div style={{ marginTop: 'var(--space-3)' }}>
            <span className="stat-label">Enabled Modules</span>
            <div className="stat-value">{enabledModules.filter(m => m !== 'DASHBOARD').length}</div>
          </div>
        </div>

        <div className="card stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ padding: 'var(--space-2)', borderRadius: 'var(--radius-md)', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
              <Users size={24} />
            </div>
          </div>
          <div style={{ marginTop: 'var(--space-3)' }}>
            <span className="stat-label">Team Members</span>
            <div className="stat-value">{userCount}</div>
          </div>
        </div>

        {activeModuleKPIs.map((kpi, idx) => (
          <div className="card stat-card" key={idx}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ padding: 'var(--space-2)', borderRadius: 'var(--radius-md)', background: kpi.bg, color: kpi.color }}>
                {kpi.icon}
              </div>
            </div>
            <div style={{ marginTop: 'var(--space-3)' }}>
              <span className="stat-label">{kpi.title}</span>
              <div className="stat-value">{kpi.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--space-6)', marginTop: 'var(--space-8)' }}>
        {/* Module Grid */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-5)' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Modules</h3>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
              {enabledModules.filter(m => m !== 'DASHBOARD').length} of {totalPossibleModules} enabled
            </span>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
            {enabledModules.includes('HOTEL_MANAGEMENT') && <HotelWidget />}
            {enabledModules.includes('POS') && <PosWidget />}
            {enabledModules.includes('PARLOR') && <ParlorWidget />}
            {enabledModules.includes('WEBSITE') && <WebsiteWidget />}
            {enabledModules.includes('INVENTORY') && <InventoryWidget />}
            {enabledModules.includes('HR') && <HrWidget />}
            {enabledModules.includes('FINANCE') && <FinanceWidget />}
            
            {enabledModules.filter(m => m !== 'DASHBOARD').length === 0 && (
              <div style={{ gridColumn: 'span 2', textAlign: 'center', padding: 'var(--space-10)', border: '2px dashed var(--border)', borderRadius: 'var(--radius-lg)' }}>
                <Lock size={48} style={{ margin: '0 auto var(--space-4)', opacity: 0.1 }} />
                <h3 style={{ color: 'var(--text-muted)' }}>No Modules Enabled</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Please contact your administrator to assign services to your organization.</p>
              </div>
            )}
          </div>

          {/* Live Website Preview Showcase */}
          {enabledModules.includes('WEBSITE') && (
            <div style={{ marginTop: 'var(--space-6)' }}>
              <LiveWebsitePreviewShowcase />
            </div>
          )}
        </div>

        {/* Sidebar Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          <div className="card glass" style={{ padding: 'var(--space-6)' }}>
            <h3 style={{ marginBottom: 'var(--space-4)', fontSize: '1.125rem' }}>Organization Status</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', color: fetchError ? '#f59e0b' : '#10b981', fontWeight: 600, marginBottom: 'var(--space-4)' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: fetchError ? '#f59e0b' : '#10b981', boxShadow: `0 0 10px ${fetchError ? 'rgba(245, 158, 11, 0.5)' : 'rgba(16, 185, 129, 0.5)'}` }}></div>
              {fetchError ? 'Using Cached Data' : 'System Active'}
            </div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {enabledModules.includes('HOTEL_MANAGEMENT') && (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Hotels</span><span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{hotelCount}</span></div>
              )}
              {enabledModules.includes('POS') && (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Restaurants</span><span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{restaurantCount}</span></div>
              )}
              {enabledModules.includes('PARLOR') && (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Parlor Treatments</span><span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{parlorCount}</span></div>
              )}
              {enabledModules.includes('WEBSITE') && (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Published Sites</span><span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{websiteCount}</span></div>
              )}
              {enabledModules.includes('INVENTORY') && (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Stock Items</span><span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{inventoryCount}</span></div>
              )}
              {enabledModules.includes('HR') && (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Active Staff</span><span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{staffCount}</span></div>
              )}
              {enabledModules.includes('FINANCE') && (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Expenses Tracked</span><span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{expensesCount}</span></div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Team Members</span><span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{userCount}</span></div>
            </div>
          </div>

          <div className="card glass" style={{ padding: 'var(--space-6)' }}>
            <h3 style={{ marginBottom: 'var(--space-5)', fontSize: '1.125rem' }}>Quick Actions</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {enabledModules.includes('HOTEL_MANAGEMENT') && (
                <Link href="/dashboard/hotel-management" className="btn btn-primary" style={{ width: '100%', textDecoration: 'none', textAlign: 'center' }}>New Reservation</Link>
              )}
              {enabledModules.includes('POS') && (
                <Link href="/dashboard/pos" className="btn" style={{ width: '100%', background: 'var(--secondary)', color: 'white', textDecoration: 'none', textAlign: 'center' }}>Create Order</Link>
              )}
              {enabledModules.includes('HR') && (
                <Link href="/dashboard/hr" className="btn" style={{ width: '100%', background: 'transparent', border: '1px solid var(--border)', textDecoration: 'none', textAlign: 'center' }}>Add Employee</Link>
              )}
              {enabledModules.filter(m => m !== 'DASHBOARD').length === 0 && (
                <div style={{ textAlign: 'center', padding: 'var(--space-4)', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                  <Lock size={20} style={{ margin: '0 auto var(--space-2)', display: 'block', opacity: 0.4 }} />
                  No modules enabled yet. Contact your Super Admin.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
