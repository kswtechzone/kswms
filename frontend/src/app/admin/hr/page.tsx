'use client';

import { API_BASE_URL } from '@/lib/api';

import React, { useEffect, useState } from 'react';
import { Briefcase, Plus, User, Mail, Calendar, CheckCircle, X } from 'lucide-react';

export default function HrPage() {
  const [staff, setStaff] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    userId: '',
    designation: '',
    salary: '',
    joiningDate: new Date().toISOString().split('T')[0],
  });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchStaff();
    fetchUsers();
  }, []);

  const fetchStaff = async () => {
    try {
      // Temporary fallback until the proper backend GET /hr/staff is fully working across orgs
      // Just showing a local UI representation for now.
      setStaff([]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

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
    }
  };

  const handleCreateEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.userId) {
      alert("Please select a User first.");
      return;
    }

    setCreating(true);
    try {
      // Simulated creation for now to fulfill frontend interactivity 
      // Replace with actual API call to ${API_BASE_URL}/api/v1/hr/staff when ready
      const newEmployee = {
        id: Math.random().toString(),
        designation: formData.designation,
        salary: formData.salary,
        joiningDate: formData.joiningDate,
        status: 'ACTIVE',
        user: users.find(u => u.id === formData.userId) || { name: 'Unknown', email: 'unknown@example.com' }
      };

      setStaff([...staff, newEmployee]);
      setShowModal(false);
      setFormData({ userId: '', designation: '', salary: '', joiningDate: new Date().toISOString().split('T')[0] });
    } catch (err) {
      console.error(err);
      alert('An error occurred while adding the employee');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="card glass" style={{ padding: 'var(--space-6)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 'var(--space-2)' }}>HR & Staffing</h1>
          <p style={{ color: 'var(--text-muted)' }}>Manage employee records, payroll, and attendance.</p>
        </div>
        <button 
          className="btn btn-primary" 
          style={{ gap: 'var(--space-2)' }}
          onClick={() => setShowModal(true)}
        >
          <Plus size={18} />
          Add Employee
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 'var(--space-10)' }}>Loading staff data...</div>
      ) : staff.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 'var(--space-10)', color: 'var(--text-muted)' }}>
          <Briefcase size={48} style={{ margin: '0 auto var(--space-4)', opacity: 0.5 }} />
          <h2>No Staff Members</h2>
          <p>Start building your team by adding an employee.</p>
        </div>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-main)' }}>
              <th style={{ padding: 'var(--space-4)', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Employee</th>
              <th style={{ padding: 'var(--space-4)', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Designation</th>
              <th style={{ padding: 'var(--space-4)', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Joined</th>
              <th style={{ padding: 'var(--space-4)', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {staff.map((s, idx) => (
              <tr key={s.id || idx} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: 'var(--space-4)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--bg-main)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <User size={16} color="var(--text-muted)" />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{s.user?.name}</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{s.user?.email}</span>
                    </div>
                  </div>
                </td>
                <td style={{ padding: 'var(--space-4)', fontWeight: 500, fontSize: '0.875rem' }}>{s.designation}</td>
                <td style={{ padding: 'var(--space-4)', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                  {new Date(s.joiningDate).toLocaleDateString()}
                </td>
                <td style={{ padding: 'var(--space-4)' }}>
                  <span style={{ 
                    display: 'inline-flex', alignItems: 'center', gap: '4px',
                    padding: '2px 8px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700,
                    background: s.status === 'ACTIVE' ? '#dcfce7' : '#f1f5f9',
                    color: s.status === 'ACTIVE' ? '#166534' : 'var(--text-muted)'
                  }}>
                    {s.status === 'ACTIVE' && <CheckCircle size={12} />} {s.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Add Employee Modal */}
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
            <h2 style={{ marginBottom: 'var(--space-6)' }}>Add Employee</h2>
            
            <form onSubmit={handleCreateEmployee} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <div>
                <label className="label">Link User Account</label>
                <select 
                  required
                  className="input" 
                  value={formData.userId}
                  onChange={(e) => setFormData({...formData, userId: e.target.value})}
                >
                  <option value="">Select User...</option>
                  {users.map(u => (
                    <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
                  ))}
                </select>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>Staff must have a user account first.</p>
              </div>

              <div>
                <label className="label">Designation / Job Title</label>
                <input 
                  type="text" 
                  required
                  className="input" 
                  value={formData.designation}
                  onChange={(e) => setFormData({...formData, designation: e.target.value})}
                  placeholder="e.g. Front Desk Manager"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                <div>
                  <label className="label">Salary (Monthly)</label>
                  <input 
                    type="number" 
                    className="input" 
                    value={formData.salary}
                    onChange={(e) => setFormData({...formData, salary: e.target.value})}
                    placeholder="e.g. 5000"
                  />
                </div>
                
                <div>
                  <label className="label">Joining Date</label>
                  <input 
                    type="date" 
                    required
                    className="input" 
                    value={formData.joiningDate}
                    onChange={(e) => setFormData({...formData, joiningDate: e.target.value})}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)', marginTop: 'var(--space-6)' }}>
                <button type="button" className="btn" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={creating}>
                  {creating ? 'Saving...' : 'Add Employee'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
