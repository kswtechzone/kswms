'use client';

import { API_BASE_URL } from '@/lib/api';
import React, { useEffect, useState } from 'react';
import { UtensilsCrossed, Plus, X, Loader2, Store, Building2 } from 'lucide-react';
import { ManageMenuModal, POSModal } from '../../../components/FnbModals';

export default function OrgPosPage() {
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState<any>(null);

  const [activeMenuRest, setActiveMenuRest] = useState<any>(null);
  const [activePosRest, setActivePosRest] = useState<any>(null);

  const fetchRestaurants = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/restaurants`, {
        headers: { 
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'x-tenant-id': JSON.parse(localStorage.getItem('user') || '{}').organization?.id
        }
      });
      if (res.ok) {
        const data = await res.json();
        setRestaurants(data);
      }
    } catch (err) {
      console.error('Failed to fetch restaurants:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const parsedUser = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(parsedUser);
    if (parsedUser.organization?.id) {
      fetchRestaurants();
    }
  }, []);

  const handleAddRestaurant = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    
    const formData = new FormData(e.currentTarget);
    const payload = {
      name: formData.get('name'),
      description: formData.get('description'),
    };

    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/restaurants`, {
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
        throw new Error(err.message || 'Failed to add F&B property');
      }

      setShowModal(false);
      fetchRestaurants();
      alert('Property added successfully!');
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
            Restaurant POS
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>Manage menus, orders, and table service for your F&B outlets.</p>
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
          <h2>No F&B Locations</h2>
          <p>You haven't added any cafes or restaurants yet. Create one to start taking orders.</p>
          <button onClick={() => setShowModal(true)} className="btn btn-primary" style={{ marginTop: 'var(--space-6)' }}>
            Create Location
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--space-6)' }}>
          {restaurants.map((rest: any) => (
            <div key={rest.id} className="card glass" style={{ borderTop: '4px solid #ef4444' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 'var(--space-2)' }}>{rest.name}</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: 'var(--space-6)' }}>
                {rest.description || 'No description provided.'}
              </p>
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
            <h2 style={{ fontSize: '1.25rem', marginBottom: 'var(--space-4)' }}>Add F&B Location</h2>
            {error && <div style={{ padding: '10px', background: '#fee2e2', color: '#ef4444', borderRadius: '4px', marginBottom: '16px', fontSize: '14px' }}>{error}</div>}
            
            <form onSubmit={handleAddRestaurant} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
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
