'use client';

import { API_BASE_URL } from '@/lib/api';
import React, { useEffect, useState } from 'react';
import { UtensilsCrossed, Plus, X, Loader2, Store, Building2 } from 'lucide-react';
import { ManageMenuModal, POSModal } from '../../../components/FnbModals';

export default function AdminRestaurantPage() {
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [activeMenuRest, setActiveMenuRest] = useState<any>(null);
  const [activePosRest, setActivePosRest] = useState<any>(null);

  const fetchGlobalData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('access_token');
      
      // Fetch all restaurants globally
      const resRest = await fetch(`${API_BASE_URL}/api/v1/restaurants/all`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (resRest.ok) {
        setRestaurants(await resRest.json());
      }

      // Fetch all orgs for the dropdown
      const resOrgs = await fetch(`${API_BASE_URL}/organizations`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (resOrgs.ok) {
        setOrganizations(await resOrgs.json());
      }
    } catch (err) {
      console.error('Failed to fetch data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGlobalData();
  }, []);

  const handleAddRestaurant = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    
    const formData = new FormData(e.currentTarget);
    const payload = {
      name: formData.get('name'),
      description: formData.get('description'),
      organizationId: formData.get('organizationId'),
    };

    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/restaurants`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify(payload)
      });
      
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to add F&B property');
      }

      setShowModal(false);
      fetchGlobalData();
      alert('Property added successfully globally!');
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
            <UtensilsCrossed size={32} color="#ef4444" />
            Global F&B Management
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>Super Admin view of all cafes and restaurants across all organizations.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn btn-primary" style={{ gap: 'var(--space-2)' }}>
          <Plus size={18} /> Add F&B Location
        </button>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--space-10)' }}>
          <Loader2 className="spin" size={32} color="var(--text-muted)" />
        </div>
      ) : restaurants.length === 0 ? (
        <div className="card glass" style={{ textAlign: 'center', padding: 'var(--space-10)', color: 'var(--text-muted)' }}>
          <Store size={48} style={{ margin: '0 auto var(--space-4)', opacity: 0.3 }} />
          <h2>No F&B Locations System-Wide</h2>
          <p>No cafes or restaurants have been configured in any organization yet.</p>
          <button onClick={() => setShowModal(true)} className="btn btn-primary" style={{ marginTop: 'var(--space-6)' }}>
            Create Location
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 'var(--space-6)' }}>
          {restaurants.map((rest: any) => (
            <div key={rest.id} className="card glass" style={{ borderTop: '4px solid #ef4444' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 'var(--space-1)' }}>{rest.name}</h3>
                <span style={{ fontSize: '0.7rem', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '2px 8px', borderRadius: '10px', fontWeight: 600 }}>ID: {rest.id.split('-')[0]}</span>
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: 'var(--space-3)' }}>
                {rest.description || 'No description provided.'}
              </p>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-main)', marginBottom: 'var(--space-4)', background: 'var(--bg-main)', padding: '8px', borderRadius: 'var(--radius-md)' }}>
                <Building2 size={16} color="var(--text-muted)" />
                <strong>Org:</strong> {rest.organization?.name || rest.organizationId.split('-')[0]}
              </div>

              <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                <button onClick={() => setActiveMenuRest(rest)} className="btn" style={{ flex: 1, border: '1px solid var(--border)' }}>Manage Menu</button>
                <button onClick={() => setActivePosRest(rest)} className="btn" style={{ flex: 1, background: '#ef4444', color: 'white', border: 'none' }}>Open POS</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* --- ADD LOCATION MODAL --- */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="card" style={{ width: '100%', maxWidth: '400px', padding: 'var(--space-6)', position: 'relative' }}>
            <button onClick={() => setShowModal(false)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', cursor: 'pointer' }}>
              <X size={20} color="var(--text-muted)" />
            </button>
            <h2 style={{ fontSize: '1.25rem', marginBottom: 'var(--space-4)' }}>Add F&B Location (Global)</h2>
            {error && <div style={{ padding: '10px', background: '#fee2e2', color: '#ef4444', borderRadius: '4px', marginBottom: '16px', fontSize: '14px' }}>{error}</div>}
            
            <form onSubmit={handleAddRestaurant} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              <div>
                <label className="form-label">Target Organization</label>
                <select name="organizationId" className="input" required>
                  <option value="">Select an organization...</option>
                  {organizations.map(org => (
                    <option key={org.id} value={org.id}>{org.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="form-label">Type</label>
                <select className="input" required>
                  <option value="Cafe">Cafe</option>
                  <option value="Restaurant">Restaurant</option>
                  <option value="Bar">Bar / Lounge</option>
                </select>
              </div>
              <div>
                <label className="form-label">Location Name</label>
                <input name="name" type="text" className="input" placeholder="e.g. The Corner Cafe" required />
              </div>
              <div>
                <label className="form-label">Description (Optional)</label>
                <textarea name="description" className="input" rows={2} placeholder="Brief description of the venue..."></textarea>
              </div>
              <button type="submit" className="btn btn-primary" disabled={submitting} style={{ marginTop: 'var(--space-4)' }}>
                {submitting ? 'Adding...' : 'Save Location'}
              </button>
            </form>
          </div>
        </div>
      )}

      {activeMenuRest && <ManageMenuModal restaurant={activeMenuRest} onClose={() => setActiveMenuRest(null)} />}
      {activePosRest && <POSModal restaurant={activePosRest} onClose={() => setActivePosRest(null)} />}
    </div>
  );
}
