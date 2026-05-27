'use client';

import { API_BASE_URL } from '@/lib/api';

import React, { useEffect, useState } from 'react';
import { 
  Building2, 
  ShieldCheck, 
  Settings, 
  MoreVertical, 
  Layout, 
  Hotel,
  ArrowUpRight,
  Plus,
  Users,
  X,
  ToggleLeft,
  ToggleRight,
  UtensilsCrossed,
  Package,
  Globe,
  Briefcase,
  Wallet,
  Check,
  Scissors
} from 'lucide-react';

const ALL_MODULES = [
  { key: 'DASHBOARD', label: 'Dashboard', icon: Layout, color: '#6366f1', description: 'Core business overview & KPIs', required: true },
  { key: 'HOTEL_MANAGEMENT', label: 'Hotel Management', icon: Hotel, color: '#f59e0b', description: 'Room inventory, bookings & hourly pricing' },
  { key: 'POS', label: 'Unified Billing & POS', icon: Wallet, color: '#f59e0b', description: 'Consolidated invoicing for rooms, food & services' },
  { key: 'RESTAURANT', label: 'F&B Management', icon: UtensilsCrossed, color: '#ef4444', description: 'Menu management, table orders & kitchen ticketing' },
  { key: 'PARLOR', label: 'Parlor Management', icon: Scissors, color: '#8b5cf6', description: 'Salon services, stylist scheduling & appointments' },
  { key: 'WEBSITE', label: 'Website Builder', icon: Globe, color: '#3b82f6', description: 'CMS pages, SEO & public brand site' },
  { key: 'INVENTORY', label: 'Inventory', icon: Package, color: '#10b981', description: 'Stock tracking, purchase orders & waste logs' },
  { key: 'HR', label: 'HR & Staffing', icon: Briefcase, color: '#8b5cf6', description: 'Employee records, payroll & attendance' },
  { key: 'FINANCE', label: 'Finance', icon: Wallet, color: '#ec4899', description: 'Invoicing, expenses & revenue reports' },
  { key: 'CRM', label: 'Customer CRM', icon: Users, color: '#e11d48', description: 'Client profiles directory, dynamic POS lookup & loyalty metrics' },
];

export default function OrganizationManagement() {
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedOrg, setSelectedOrg] = useState<any>(null);
  const [toggling, setToggling] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [orgsRes, statsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/organizations`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` }
        }),
        fetch(`${API_BASE_URL}/organizations/stats`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` }
        })
      ]);

      if (orgsRes.ok) setOrganizations(await orgsRes.json());
      if (statsRes.ok) setStats(await statsRes.json());
    } catch (err) {
      console.error('Failed to fetch org data:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleModule = async (orgId: string, moduleName: string) => {
    setToggling(moduleName);
    try {
      const res = await fetch(`${API_BASE_URL}/organizations/${orgId}/toggle-module`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}` 
        },
        body: JSON.stringify({ moduleName })
      });
      if (res.ok) {
        const updatedOrg = await res.json();
        // Update both the list and the selected org
        setOrganizations(prev => prev.map(org => org.id === orgId ? { ...org, enabledModules: updatedOrg.enabledModules } : org));
        setSelectedOrg((prev: any) => prev && prev.id === orgId ? { ...prev, enabledModules: updatedOrg.enabledModules } : prev);
      }
    } catch (err) {
      console.error('Failed to toggle module:', err);
    } finally {
      setToggling(null);
    }
  };

  const statCards = [
    { label: 'Total Organizations', value: stats?.orgCount || 0, icon: Building2, color: '#3b82f6' },
    { label: 'Active Users', value: stats?.userCount || 0, icon: Users, color: '#10b981' },
    { label: 'Total Hotels', value: stats?.hotelCount || 0, icon: Hotel, color: '#f59e0b' },
  ];

  const getModuleColor = (key: string) => {
    return ALL_MODULES.find(m => m.key === key)?.color || '#64748b';
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-8)' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 700, color: 'var(--secondary)' }}>Organization Management</h1>
          <p style={{ color: 'var(--text-muted)' }}>Assign modules and manage business owner access.</p>
        </div>
        <button className="btn btn-primary" style={{ gap: 'var(--space-2)' }}>
          <Plus size={18} /> New Organization
        </button>
      </div>

      <div className="stats-grid">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="card stat-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ padding: 'var(--space-2)', borderRadius: 'var(--radius-md)', background: `${stat.color}15`, color: stat.color }}>
                  <Icon size={24} />
                </div>
              </div>
              <div style={{ marginTop: 'var(--space-3)' }}>
                <span className="stat-label">{stat.label}</span>
                <div className="stat-value">{loading ? '...' : stat.value}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-main)' }}>
              <th style={{ padding: 'var(--space-4)', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Organization</th>
              <th style={{ padding: 'var(--space-4)', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Active Modules</th>
              <th style={{ padding: 'var(--space-4)', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Resources</th>
              <th style={{ padding: 'var(--space-4)', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Status</th>
              <th style={{ padding: 'var(--space-4)', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} style={{ padding: 'var(--space-10)', textAlign: 'center', color: 'var(--text-muted)' }}>Loading organizations...</td>
              </tr>
            ) : organizations.length === 0 ? (
               <tr>
                <td colSpan={5} style={{ padding: 'var(--space-10)', textAlign: 'center', color: 'var(--text-muted)' }}>No organizations found.</td>
              </tr>
            ) : organizations.map((org) => (
              <tr key={org.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: 'var(--space-4)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-md)', background: 'var(--bg-main)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Building2 size={20} color="var(--primary)" />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontWeight: 600, fontSize: '0.9375rem', color: 'var(--text-main)' }}>{org.name}</span>
                      <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>/{org.slug}</span>
                    </div>
                  </div>
                </td>
                <td style={{ padding: 'var(--space-4)' }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                    {org.enabledModules?.map((mod: string) => (
                      <span key={mod} style={{ 
                        padding: '2px 8px', 
                        borderRadius: '4px', 
                        fontSize: '0.6875rem', 
                        fontWeight: 700,
                        background: `${getModuleColor(mod)}15`,
                        color: getModuleColor(mod),
                        border: `1px solid ${getModuleColor(mod)}30`
                      }}>
                        {mod.replace(/_/g, ' ')}
                      </span>
                    ))}
                  </div>
                </td>
                <td style={{ padding: 'var(--space-4)' }}>
                  <div style={{ display: 'flex', gap: 'var(--space-4)', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Users size={14} /> {org._count?.users || 0}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Hotel size={14} /> {org._count?.hotels || 0}
                    </div>
                  </div>
                </td>
                <td style={{ padding: 'var(--space-4)' }}>
                  <span style={{ 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    gap: '6px',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    color: org.isActive ? '#10b981' : '#ef4444'
                  }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: org.isActive ? '#10b981' : '#ef4444' }}></div>
                    {org.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td style={{ padding: 'var(--space-4)' }}>
                  <button 
                    className="btn btn-primary" 
                    style={{ padding: 'var(--space-2) var(--space-4)', fontSize: '0.8125rem', gap: '6px' }}
                    onClick={() => setSelectedOrg(org)}
                  >
                    <Settings size={14} /> Manage Modules
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Module Management Modal */}
      {selectedOrg && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.55)', zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          backdropFilter: 'blur(4px)'
        }}>
          <div className="card glass" style={{ 
            width: '100%', maxWidth: '640px', padding: 0, position: 'relative',
            maxHeight: '90vh', overflow: 'hidden', display: 'flex', flexDirection: 'column'
          }}>
            {/* Modal Header */}
            <div style={{ 
              padding: 'var(--space-6)', 
              borderBottom: '1px solid var(--border)',
              background: 'linear-gradient(135deg, rgba(166, 118, 83, 0.05), rgba(59, 130, 246, 0.03))'
            }}>
              <button 
                onClick={() => setSelectedOrg(null)}
                style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <X size={20} />
              </button>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-md)', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                  <Building2 size={22} />
                </div>
                <div>
                  <h2 style={{ margin: 0, fontSize: '1.25rem' }}>{selectedOrg.name}</h2>
                  <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                    Toggle modules to enable or disable them for this organization.
                  </p>
                </div>
              </div>
            </div>

            {/* Module List */}
            <div style={{ padding: 'var(--space-4) var(--space-6)', overflowY: 'auto', flex: 1 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                {ALL_MODULES.map((mod) => {
                  const Icon = mod.icon;
                  const isEnabled = selectedOrg.enabledModules?.includes(mod.key);
                  const isToggling = toggling === mod.key;
                  const isRequired = mod.required;

                  return (
                    <div key={mod.key} style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: 'var(--space-4)',
                      borderRadius: 'var(--radius-md)',
                      border: `1px solid ${isEnabled ? mod.color + '40' : 'var(--border)'}`,
                      background: isEnabled ? `${mod.color}08` : 'transparent',
                      transition: 'all 0.2s ease'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                        <div style={{ 
                          width: '40px', height: '40px', borderRadius: 'var(--radius-md)',
                          background: `${mod.color}15`, color: mod.color,
                          display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                          <Icon size={20} />
                        </div>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                            <span style={{ fontWeight: 600, fontSize: '0.9375rem' }}>{mod.label}</span>
                            {isRequired && (
                              <span style={{ 
                                fontSize: '0.625rem', fontWeight: 700, padding: '1px 6px', 
                                borderRadius: '4px', background: 'rgba(100,116,139,0.1)', 
                                color: 'var(--text-muted)', textTransform: 'uppercase' 
                              }}>
                                Required
                              </span>
                            )}
                          </div>
                          <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>{mod.description}</span>
                        </div>
                      </div>

                      {isRequired ? (
                        <div style={{ 
                          display: 'flex', alignItems: 'center', gap: '6px',
                          padding: '6px 14px', borderRadius: '20px',
                          background: `${mod.color}15`, color: mod.color,
                          fontSize: '0.8125rem', fontWeight: 600
                        }}>
                          <Check size={14} /> Always On
                        </div>
                      ) : (
                        <button
                          disabled={isToggling}
                          onClick={() => toggleModule(selectedOrg.id, mod.key)}
                          style={{
                            display: 'flex', alignItems: 'center', gap: '6px',
                            padding: '6px 16px', borderRadius: '20px',
                            border: 'none', cursor: isToggling ? 'wait' : 'pointer',
                            fontWeight: 600, fontSize: '0.8125rem',
                            background: isEnabled ? mod.color : '#e2e8f0',
                            color: isEnabled ? 'white' : '#64748b',
                            transition: 'all 0.2s ease',
                            opacity: isToggling ? 0.6 : 1
                          }}
                        >
                          {isToggling ? (
                            'Saving...'
                          ) : isEnabled ? (
                            <><Check size={14} /> Enabled</>
                          ) : (
                            'Disabled'
                          )}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Modal Footer */}
            <div style={{ 
              padding: 'var(--space-4) var(--space-6)', 
              borderTop: '1px solid var(--border)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              background: '#f8fafc'
            }}>
              <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                {selectedOrg.enabledModules?.length || 0} of {ALL_MODULES.length} modules enabled
              </span>
              <button className="btn btn-primary" onClick={() => setSelectedOrg(null)}>
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
