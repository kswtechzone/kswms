'use client';

import { API_BASE_URL } from '@/lib/api';

import React, { useEffect, useState } from 'react';
import { 
  MoreVertical, 
  UserPlus, 
  Shield, 
  User, 
  Mail,
  Filter,
  Building,
  X,
  Eye,
  EyeOff
} from 'lucide-react';

export default function UserManagement() {
  const [users, setUsers] = useState<any[]>([]);
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'ORG_ADMIN',
    orgId: ''
  });
  const [creating, setCreating] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    fetchUsers();
    fetchOrganizations();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/users`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` }
      });
      if (res.ok) {
        setUsers(await res.json());
      }
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrganizations = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/organizations`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` }
      });
      if (res.ok) {
        setOrganizations(await res.json());
      }
    } catch (err) {
      console.error('Failed to fetch orgs:', err);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.orgId) {
      alert("Please select an organization");
      return;
    }
    
    setCreating(true);
    try {
      const res = await fetch(`${API_BASE_URL}/users/organization/${formData.orgId}`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}` 
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role
        })
      });
      
      if (res.ok) {
        setShowModal(false);
        setFormData({ name: '', email: '', password: '', role: 'ORG_ADMIN', orgId: '' });
        fetchUsers(); // Refresh list
      } else {
        const err = await res.json();
        alert(err.message || 'Failed to create user');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred while creating the user');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-8)' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 700, color: 'var(--secondary)' }}>User Management</h1>
          <p style={{ color: 'var(--text-muted)' }}>Manage platform access and user roles.</p>
        </div>
        <button 
          className="btn btn-primary" 
          style={{ gap: 'var(--space-2)' }}
          onClick={() => setShowModal(true)}
        >
          <UserPlus size={18} /> Add User
        </button>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: 'var(--space-4)', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', background: '#f8fafc' }}>
          <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
            <button className="btn" style={{ background: 'white', border: '1px solid var(--border)', padding: 'var(--space-2) var(--space-4)', fontSize: '0.875rem' }}>
              All Users
            </button>
            <button className="btn" style={{ background: 'transparent', color: 'var(--text-muted)', padding: 'var(--space-2) var(--space-4)', fontSize: '0.875rem' }}>
              Admins
            </button>
          </div>
          <button className="btn" style={{ background: 'transparent', color: 'var(--text-muted)', border: '1px solid var(--border)', padding: 'var(--space-2) var(--space-4)', fontSize: '0.875rem', gap: 'var(--space-2)' }}>
            <Filter size={14} /> Filter
          </button>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-main)' }}>
              <th style={{ padding: 'var(--space-4)', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>User</th>
              <th style={{ padding: 'var(--space-4)', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Organization</th>
              <th style={{ padding: 'var(--space-4)', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Role</th>
              <th style={{ padding: 'var(--space-4)', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} style={{ padding: 'var(--space-10)', textAlign: 'center', color: 'var(--text-muted)' }}>Loading users...</td>
              </tr>
            ) : users.length === 0 ? (
               <tr>
                <td colSpan={4} style={{ padding: 'var(--space-10)', textAlign: 'center', color: 'var(--text-muted)' }}>No users found.</td>
              </tr>
            ) : users.map((u) => (
              <tr key={u.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: 'var(--space-4)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--bg-main)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <User size={20} color="var(--text-muted)" />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontWeight: 600, fontSize: '0.9375rem', color: 'var(--text-main)' }}>{u.name}</span>
                      <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Mail size={12} /> {u.email}
                      </span>
                    </div>
                  </div>
                </td>
                <td style={{ padding: 'var(--space-4)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                    <Building size={16} />
                    {u.organization?.name || 'N/A'}
                  </div>
                </td>
                <td style={{ padding: 'var(--space-4)' }}>
                  <span style={{ 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    gap: '4px',
                    padding: '4px 10px', 
                    borderRadius: '20px', 
                    fontSize: '0.75rem', 
                    fontWeight: 600,
                    background: u.role.includes('ADMIN') ? 'rgba(245, 158, 11, 0.1)' : 'rgba(100, 116, 139, 0.1)',
                    color: u.role.includes('ADMIN') ? '#f59e0b' : 'var(--text-muted)'
                  }}>
                    {u.role.includes('ADMIN') && <Shield size={12} />}
                    {u.role}
                  </span>
                </td>
                <td style={{ padding: 'var(--space-4)' }}>
                  <button style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                    <MoreVertical size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create User Modal */}
      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div className="card glass" style={{ width: '100%', maxWidth: '500px', padding: 'var(--space-6)', position: 'relative' }}>
            <button 
              onClick={() => setShowModal(false)}
              style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
            >
              <X size={20} />
            </button>
            <h2 style={{ marginBottom: 'var(--space-6)' }}>Create New User</h2>
            
            <form onSubmit={handleCreateUser} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <div>
                <label className="label">Full Name</label>
                <input 
                  type="text" 
                  required
                  className="input" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              
              <div>
                <label className="label">Email Address</label>
                <input 
                  type="email" 
                  required
                  className="input" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>

              <div>
                <label className="label">Password</label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    required
                    minLength={6}
                    className="input" 
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    style={{ paddingRight: 'var(--space-10)' }}
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: 'var(--space-3)',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                <div>
                  <label className="label">Role</label>
                  <select 
                    className="input" 
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                  >
                    <option value="ORG_ADMIN">Org Admin</option>
                    <option value="STAFF">Staff</option>
                  </select>
                </div>
                
                <div>
                  <label className="label">Organization</label>
                  <select 
                    required
                    className="input" 
                    value={formData.orgId}
                    onChange={(e) => setFormData({...formData, orgId: e.target.value})}
                  >
                    <option value="">Select Org...</option>
                    {organizations.map(org => (
                      <option key={org.id} value={org.id}>{org.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)', marginTop: 'var(--space-6)' }}>
                <button type="button" className="btn" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={creating}>
                  {creating ? 'Creating...' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

