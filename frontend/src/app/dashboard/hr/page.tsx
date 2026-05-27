'use client';

import { API_BASE_URL } from '@/lib/api';
import React, { useEffect, useState } from 'react';
import { Briefcase, Plus, X, Loader2, Users, Calendar, Wallet, CheckCircle2, Search } from 'lucide-react';

export default function OrgHrPage() {
  const [staff, setStaff] = useState<any[]>([]);
  const [availableUsers, setAvailableUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState<any>(null);

  const fetchHRData = async (orgId: string) => {
    try {
      const [staffRes, usersRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/v1/hr`, {
          headers: { 
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
            'x-tenant-id': orgId
          }
        }),
        fetch(`${API_BASE_URL}/users/organization/${orgId}`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` }
        })
      ]);

      if (staffRes.ok) setStaff(await staffRes.json());
      if (usersRes.ok) setAvailableUsers(await usersRes.json());
    } catch (err) {
      console.error('HR Fetch Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const parsedUser = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(parsedUser);
    if (parsedUser.organization?.id) {
      fetchHRData(parsedUser.organization.id);
    }
  }, []);

  const handleAddStaff = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    
    const formData = new FormData(e.currentTarget);
    const payload = {
      userId: formData.get('userId'),
      designation: formData.get('designation'),
      salary: Number(formData.get('salary')),
      joiningDate: formData.get('joiningDate'),
    };

    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/hr`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'x-tenant-id': user.organization.id
        },
        body: JSON.stringify(payload)
      });
      
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to add staff member');
      }

      setShowModal(false);
      fetchHRData(user.organization.id);
      alert('Staff member added successfully!');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-8)' }}>
        <div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Briefcase size={32} color="#8b5cf6" />
            HR & Staffing
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>Manage employee records, roles, and payroll.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn btn-primary" style={{ gap: 'var(--space-2)' }}>
          <Plus size={18} /> Add New Staff
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-6)', marginBottom: 'var(--space-8)' }}>
        <div className="card stat-card">
          <span className="stat-label">Total Staff</span>
          <div className="stat-value">{staff.length}</div>
        </div>
        <div className="card stat-card">
          <span className="stat-label">Active Roles</span>
          <div className="stat-value" style={{ color: '#8b5cf6' }}>
            {[...new Set(staff.map(s => s.designation))].length}
          </div>
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--space-10)' }}>
          <Loader2 className="spin" size={32} color="var(--text-muted)" />
        </div>
      ) : staff.length === 0 ? (
        <div className="card glass" style={{ textAlign: 'center', padding: 'var(--space-10)', color: 'var(--text-muted)' }}>
          <Briefcase size={48} style={{ margin: '0 auto var(--space-4)', opacity: 0.3 }} />
          <h2>No Staff Members</h2>
          <p>Start building your team by assigning staff roles to your organization users.</p>
          <button onClick={() => setShowModal(true)} className="btn btn-primary" style={{ marginTop: 'var(--space-6)' }}>
            Add Your First Staff Member
          </button>
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-main)' }}>
                <th style={{ padding: 'var(--space-4)', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Employee</th>
                <th style={{ padding: 'var(--space-4)', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Designation</th>
                <th style={{ padding: 'var(--space-4)', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Salary</th>
                <th style={{ padding: 'var(--space-4)', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {staff.map((s: any) => (
                <tr key={s.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: 'var(--space-4)' }}>
                    <div style={{ fontWeight: 600 }}>{s.user?.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{s.user?.email}</div>
                  </td>
                  <td style={{ padding: 'var(--space-4)' }}>
                    <div style={{ fontWeight: 600 }}>{s.designation}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Joined: {new Date(s.joiningDate).toLocaleDateString()}</div>
                  </td>
                  <td style={{ padding: 'var(--space-4)' }}>
                    <div style={{ fontWeight: 700 }}>${s.salary?.toLocaleString()}/mo</div>
                  </td>
                  <td style={{ padding: 'var(--space-4)' }}>
                    <span style={{ padding: '2px 8px', borderRadius: '12px', background: '#dcfce7', color: '#10b981', fontSize: '0.75rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <CheckCircle2 size={12} /> {s.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* --- ADD STAFF MODAL --- */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="card" style={{ width: '100%', maxWidth: '400px', padding: 'var(--space-6)', position: 'relative' }}>
            <button onClick={() => setShowModal(false)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', cursor: 'pointer' }}>
              <X size={20} color="var(--text-muted)" />
            </button>
            <h2 style={{ fontSize: '1.25rem', marginBottom: 'var(--space-4)' }}>Assign Staff Role</h2>
            {error && <div style={{ padding: '10px', background: '#fee2e2', color: '#ef4444', borderRadius: '4px', marginBottom: '16px', fontSize: '14px' }}>{error}</div>}
            
            <form onSubmit={handleAddStaff} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              <div>
                <label className="form-label">Select User</label>
                <select name="userId" className="input" required>
                  <option value="">-- Choose User --</option>
                  {availableUsers.map(u => (
                    <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="form-label">Designation</label>
                <input name="designation" type="text" className="input" placeholder="e.g. Front Desk Manager" required />
              </div>
              <div>
                <label className="form-label">Monthly Salary ($)</label>
                <input name="salary" type="number" className="input" placeholder="0.00" required />
              </div>
              <div>
                <label className="form-label">Joining Date</label>
                <input name="joiningDate" type="date" className="input" required defaultValue={new Date().toISOString().split('T')[0]} />
              </div>
              <button type="submit" className="btn btn-primary" disabled={submitting} style={{ marginTop: 'var(--space-4)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                {submitting ? <Loader2 size={18} className="spin" /> : null}
                {submitting ? 'Adding...' : 'Save Staff Record'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
