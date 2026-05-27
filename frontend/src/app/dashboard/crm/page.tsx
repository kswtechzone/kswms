'use client';

import { API_BASE_URL } from '@/lib/api';

import React, { useEffect, useState } from 'react';
import DashboardShell from '@/components/DashboardShell';
import { 
  Users, Plus, Search, Edit2, Trash2, Mail, Phone, 
  Award, ShieldAlert, Loader2, Sparkles, MessageSquare 
} from 'lucide-react';

interface GuestProfile {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  preferences: string | null;
  loyaltyPoints: number;
  createdAt: string;
}

export default function CustomerCrmPage() {
  const [user, setUser] = useState<any>(null);
  const [guests, setGuests] = useState<GuestProfile[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [isModuleEnabled, setIsModuleEnabled] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedGuest, setSelectedGuest] = useState<GuestProfile | null>(null);

  useEffect(() => {
    const parsedUser = JSON.parse(localStorage.getItem('user') || '{}');
    if (!parsedUser.organization?.id) return;
    setUser(parsedUser);

    // Verify if CRM module is enabled
    const enabledModules = parsedUser.organization?.enabledModules || [];
    const isCrmEnabled = enabledModules.includes('CRM');
    setIsModuleEnabled(isCrmEnabled);

    if (isCrmEnabled) {
      fetchGuests(parsedUser.organization.id);
    } else {
      setLoading(false);
    }
  }, []);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchGuests = async (orgId: string) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/crm/guests`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'x-tenant-id': orgId
        }
      });
      if (res.ok) {
        setGuests(await res.json());
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to load customers', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddGuest = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const payload = {
      name: formData.get('name'),
      email: formData.get('email') || null,
      phone: formData.get('phone') || null,
      preferences: formData.get('preferences') || null,
    };

    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/crm/guests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'x-tenant-id': user.organization.id
        },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setShowAddModal(false);
        fetchGuests(user.organization.id);
        showToast('Customer profile created!', 'success');
      } else {
        showToast('Failed to create profile', 'error');
      }
    } catch (err) {
      showToast('Error creating profile', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditGuest = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedGuest) return;
    setSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const payload = {
      name: formData.get('name'),
      email: formData.get('email') || null,
      phone: formData.get('phone') || null,
      preferences: formData.get('preferences') || null,
    };

    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/crm/guests/${selectedGuest.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'x-tenant-id': user.organization.id
        },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setShowEditModal(false);
        setSelectedGuest(null);
        fetchGuests(user.organization.id);
        showToast('Customer profile updated!', 'success');
      } else {
        showToast('Failed to update profile', 'error');
      }
    } catch (err) {
      showToast('Error updating profile', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteGuest = async (id: string) => {
    if (!confirm('Are you sure you want to delete this customer profile? This will break references to past standalone bookings.')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/crm/guests/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'x-tenant-id': user.organization.id
        }
      });
      if (res.ok) {
        fetchGuests(user.organization.id);
        showToast('Customer profile deleted', 'success');
      } else {
        showToast('Failed to delete customer', 'error');
      }
    } catch (err) {
      showToast('Error deleting customer', 'error');
    }
  };

  const filteredGuests = guests.filter(g => 
    g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (g.phone && g.phone.includes(searchQuery)) ||
    (g.email && g.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <DashboardShell mode="org">
      <div style={{ paddingBottom: 'var(--space-10)' }}>
        {/* Toast Notification */}
        {toast && (
          <div style={{
            position: 'fixed', top: '24px', right: '24px', zIndex: 1100,
            background: toast.type === 'success' ? '#10b981' : '#ef4444',
            color: 'white', padding: '12px 24px', borderRadius: '12px',
            boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontWeight: 700,
            animation: 'slideIn 0.3s ease'
          }}>
            {toast.message}
          </div>
        )}

        {/* 🔒 CRM Gate Screen */}
        {!isModuleEnabled && !loading && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
            <div className="card glass" style={{ maxWidth: '500px', textAlign: 'center', padding: 'var(--space-8)' }}>
              <div style={{ display: 'inline-flex', padding: '16px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', marginBottom: '20px' }}>
                <ShieldAlert size={48} />
              </div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '12px' }}>Customer CRM Disabled</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.5', marginBottom: '24px' }}>
                Your organization does not currently have the <strong>Customer Management CRM</strong> module enabled. 
                Please contact the Super Admin or access the <strong>Super Admin Console</strong> to assign this subscription feature to your profile.
              </p>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
                Feature ID: <code>CRM_MODULE_TENANT</code>
              </div>
            </div>
          </div>
        )}

        {isModuleEnabled && (
          <>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-8)' }}>
              <div>
                <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Customer CRM</h1>
                <p style={{ color: 'var(--text-muted)' }}>Manage organization-isolated guest directory and instant POS lookups.</p>
              </div>
              <button 
                onClick={() => setShowAddModal(true)}
                className="btn btn-primary" 
                style={{ gap: '8px' }}
              >
                <Plus size={18} /> New Customer Profile
              </button>
            </div>

            {/* KPI Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--space-6)', marginBottom: 'var(--space-8)' }}>
              <div className="card" style={{ padding: 'var(--space-6)', borderLeft: '4px solid var(--primary)' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Registered</span>
                <h2 style={{ fontSize: '2rem', fontWeight: 900, marginTop: '8px', color: 'var(--primary)' }}>
                  {loading ? '...' : guests.length}
                </h2>
              </div>
              <div className="card" style={{ padding: 'var(--space-6)', borderLeft: '4px solid #ec4899' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Loyalty Points</span>
                <h2 style={{ fontSize: '2rem', fontWeight: 900, marginTop: '8px', color: '#ec4899' }}>
                  {loading ? '...' : guests.reduce((sum, g) => sum + g.loyaltyPoints, 0)}
                </h2>
              </div>
              <div className="card" style={{ padding: 'var(--space-6)', borderLeft: '4px solid #10b981' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Loyalty Tier Active</span>
                <h2 style={{ fontSize: '2rem', fontWeight: 900, marginTop: '8px', color: '#10b981' }}>
                  100% Tenant Secure
                </h2>
              </div>
            </div>

            {/* Directory Card */}
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ padding: 'var(--space-6)', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontWeight: 800 }}>Client Directory</h3>
                <div style={{ position: 'relative', width: '280px' }}>
                  <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input 
                    type="text" 
                    placeholder="Search by name, email, or phone..." 
                    className="input" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ paddingLeft: '36px', height: '38px', fontSize: '0.85rem', background: 'var(--bg-main)' }} 
                  />
                </div>
              </div>

              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead style={{ background: 'var(--bg-main)', borderBottom: '1px solid var(--border)' }}>
                  <tr>
                    <th style={{ padding: 'var(--space-4)', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Customer</th>
                    <th style={{ padding: 'var(--space-4)', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Phone</th>
                    <th style={{ padding: 'var(--space-4)', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Email</th>
                    <th style={{ padding: 'var(--space-4)', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Loyalty Points</th>
                    <th style={{ padding: 'var(--space-4)', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Stylist Preference / Notes</th>
                    <th style={{ padding: 'var(--space-4)', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={6} style={{ padding: '40px', textAlign: 'center' }}><Loader2 className="spin" /></td></tr>
                  ) : filteredGuests.length === 0 ? (
                    <tr><td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>No customer profiles found.</td></tr>
                  ) : filteredGuests.map(guest => (
                    <tr key={guest.id} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: 'var(--space-4)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(166, 118, 83, 0.1)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                            {guest.name.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <span style={{ fontWeight: 700, display: 'block', fontSize: '0.9rem' }}>{guest.name}</span>
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Joined {new Date(guest.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: 'var(--space-4)', fontSize: '0.85rem' }}>
                        {guest.phone ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Phone size={12} color="var(--text-muted)" />
                            {guest.phone}
                          </div>
                        ) : <span style={{ color: 'var(--text-muted)' }}>—</span>}
                      </td>
                      <td style={{ padding: 'var(--space-4)', fontSize: '0.85rem' }}>
                        {guest.email ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Mail size={12} color="var(--text-muted)" />
                            {guest.email}
                          </div>
                        ) : <span style={{ color: 'var(--text-muted)' }}>—</span>}
                      </td>
                      <td style={{ padding: 'var(--space-4)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Award size={14} color="#ec4899" />
                          <span style={{ fontWeight: 800, fontSize: '0.85rem' }}>{guest.loyaltyPoints} pts</span>
                        </div>
                      </td>
                      <td style={{ padding: 'var(--space-4)', fontSize: '0.8rem', maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {guest.preferences ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <MessageSquare size={12} color="var(--primary)" />
                            {guest.preferences}
                          </div>
                        ) : <span style={{ color: 'var(--text-muted)' }}>No treatment notes logged</span>}
                      </td>
                      <td style={{ padding: 'var(--space-4)', textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                          <button 
                            onClick={() => {
                              setSelectedGuest(guest);
                              setShowEditModal(true);
                            }}
                            className="btn btn-sm"
                            style={{ padding: '6px', background: 'transparent', border: '1px solid var(--border)' }}
                          >
                            <Edit2 size={14} />
                          </button>
                          <button 
                            onClick={() => handleDeleteGuest(guest.id)}
                            className="btn btn-sm"
                            style={{ padding: '6px', background: 'rgba(239, 68, 68, 0.1)', border: 'none', color: '#ef4444' }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* ➕ Add Customer Modal */}
        {showAddModal && (
          <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.5)', zIndex: 1000,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backdropFilter: 'blur(3px)'
          }}>
            <div className="card glass" style={{ width: '100%', maxWidth: '480px', padding: 0, overflow: 'hidden' }}>
              <div style={{ padding: 'var(--space-6)', borderBottom: '1px solid var(--border)', background: 'linear-gradient(135deg, rgba(166, 118, 83, 0.05), rgba(236, 72, 153, 0.03))' }}>
                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Sparkles size={18} color="var(--primary)" />
                  New Customer Profile
                </h3>
              </div>
              <form onSubmit={handleAddGuest} style={{ padding: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label className="form-label">Full Name *</label>
                  <input name="name" className="input" placeholder="e.g. Sarah Jenkins" required />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label className="form-label">Phone Number</label>
                    <input name="phone" className="input" placeholder="e.g. +1234567890" />
                  </div>
                  <div>
                    <label className="form-label">Email Address</label>
                    <input name="email" type="email" className="input" placeholder="e.g. sarah@example.com" />
                  </div>
                </div>
                <div>
                  <label className="form-label">Stylist Notes / Preferences</label>
                  <textarea name="preferences" className="input" placeholder="e.g. Prefers organic hair dyes, prefers morning salon sessions..." rows={3}></textarea>
                </div>

                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }}>
                  <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-sm" style={{ background: 'transparent', border: '1px solid var(--border)' }}>Cancel</button>
                  <button type="submit" disabled={submitting} className="btn btn-sm btn-primary">
                    {submitting ? <Loader2 className="spin" size={16} /> : 'Create Customer'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ✏️ Edit Customer Modal */}
        {showEditModal && selectedGuest && (
          <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.5)', zIndex: 1000,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backdropFilter: 'blur(3px)'
          }}>
            <div className="card glass" style={{ width: '100%', maxWidth: '480px', padding: 0, overflow: 'hidden' }}>
              <div style={{ padding: 'var(--space-6)', borderBottom: '1px solid var(--border)', background: 'linear-gradient(135deg, rgba(166, 118, 83, 0.05), rgba(236, 72, 153, 0.03))' }}>
                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>Edit Customer Profile</h3>
              </div>
              <form onSubmit={handleEditGuest} style={{ padding: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label className="form-label">Full Name *</label>
                  <input name="name" defaultValue={selectedGuest.name} className="input" required />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label className="form-label">Phone Number</label>
                    <input name="phone" defaultValue={selectedGuest.phone || ''} className="input" />
                  </div>
                  <div>
                    <label className="form-label">Email Address</label>
                    <input name="email" type="email" defaultValue={selectedGuest.email || ''} className="input" />
                  </div>
                </div>
                <div>
                  <label className="form-label">Stylist Notes / Preferences</label>
                  <textarea name="preferences" defaultValue={selectedGuest.preferences || ''} className="input" rows={3}></textarea>
                </div>

                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }}>
                  <button type="button" onClick={() => { setShowEditModal(false); setSelectedGuest(null); }} className="btn btn-sm" style={{ background: 'transparent', border: '1px solid var(--border)' }}>Cancel</button>
                  <button type="submit" disabled={submitting} className="btn btn-sm btn-primary">
                    {submitting ? <Loader2 className="spin" size={16} /> : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
