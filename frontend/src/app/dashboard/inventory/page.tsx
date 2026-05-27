'use client';

import { API_BASE_URL } from '@/lib/api';

import React, { useEffect, useState } from 'react';
import { 
  Package, 
  Plus, 
  X, 
  Loader2, 
  Store, 
  Search, 
  AlertTriangle, 
  Hotel, 
  CheckCircle,
  Clock,
  Hammer,
  Filter
} from 'lucide-react';
import { useToast } from '@/components/Toast';

export default function UnifiedInventoryPage() {
  const [activeTab, setActiveTab] = useState<'stock' | 'rooms'>('stock');
  const [items, setItems] = useState<any[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [user, setUser] = useState<any>(null);
  const { showToast } = useToast();

  useEffect(() => {
    const parsedUser = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(parsedUser);
    if (parsedUser.organization?.id) {
      fetchData(parsedUser.organization.id);
    }
  }, []);

  const fetchData = async (orgId: string) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      const [invRes, roomsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/v1/inventory`, { headers: { 'Authorization': `Bearer ${token}`, 'x-tenant-id': orgId } }),
        fetch(`${API_BASE_URL}/api/v1/hotel/rooms`, { headers: { 'Authorization': `Bearer ${token}`, 'x-tenant-id': orgId } })
      ]);
      
      if (invRes.ok) setItems(await invRes.json());
      if (roomsRes.ok) setRooms(await roomsRes.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const payload = {
      name: formData.get('name'),
      sku: formData.get('sku'),
      unit: formData.get('unit'),
      quantity: Number(formData.get('quantity')),
      minQuantity: Number(formData.get('minQuantity')),
    };

    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/inventory`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'x-tenant-id': user.organization.id
        },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setShowModal(false);
        fetchData(user.organization.id);
        showToast('Item added successfully!', 'success');
      }
    } catch (err) {
      showToast('Failed to add item', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'AVAILABLE': return '#10b981';
      case 'OCCUPIED': return '#3b82f6';
      case 'CLEANING': return '#f59e0b';
      case 'MAINTENANCE': return '#ef4444';
      default: return 'var(--text-muted)';
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-8)' }}>
        <div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800 }}>Asset & Inventory</h1>
          <p style={{ color: 'var(--text-muted)' }}>Manage your property inventory, from rooms to hotel supplies.</p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
           <div className="card" style={{ padding: '4px', display: 'flex', gap: '4px', background: 'var(--bg-main)', border: '1px solid var(--border)' }}>
             <button 
               onClick={() => setActiveTab('stock')}
               style={{ 
                 padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                 background: activeTab === 'stock' ? 'white' : 'transparent',
                 boxShadow: activeTab === 'stock' ? 'var(--shadow-sm)' : 'none',
                 fontWeight: activeTab === 'stock' ? 700 : 500,
                 color: activeTab === 'stock' ? 'var(--primary)' : 'var(--text-muted)'
               }}
             >
               <Package size={16} style={{ marginRight: '8px' }} /> Stock
             </button>
             <button 
               onClick={() => setActiveTab('rooms')}
               style={{ 
                 padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                 background: activeTab === 'rooms' ? 'white' : 'transparent',
                 boxShadow: activeTab === 'rooms' ? 'var(--shadow-sm)' : 'none',
                 fontWeight: activeTab === 'rooms' ? 700 : 500,
                 color: activeTab === 'rooms' ? 'var(--primary)' : 'var(--text-muted)'
               }}
             >
               <Hotel size={16} style={{ marginRight: '8px' }} /> Rooms
             </button>
           </div>
           {activeTab === 'stock' && (
             <button onClick={() => setShowModal(true)} className="btn btn-primary">
               <Plus size={18} /> Add Stock
             </button>
           )}
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-6)', marginBottom: 'var(--space-8)' }}>
        <div className="card" style={{ padding: 'var(--space-6)' }}>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 500 }}>Total Assets</p>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{activeTab === 'stock' ? items.length : rooms.length}</h3>
        </div>
        <div className="card" style={{ padding: 'var(--space-6)' }}>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 500 }}>
            {activeTab === 'stock' ? 'Low Stock Items' : 'Available Rooms'}
          </p>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: activeTab === 'stock' ? '#ef4444' : '#10b981' }}>
            {activeTab === 'stock' 
              ? items.filter(i => i.quantity <= i.minQuantity).length 
              : rooms.filter(r => r.status === 'AVAILABLE').length
            }
          </h3>
        </div>
        <div className="card" style={{ padding: 'var(--space-6)' }}>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 500 }}>
            {activeTab === 'stock' ? 'Active Suppliers' : 'Occupancy Rate'}
          </p>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>
            {activeTab === 'stock' ? '12' : `${Math.round((rooms.filter(r => r.status === 'OCCUPIED').length / (rooms.length || 1)) * 100)}%`}
          </h3>
        </div>
        <div className="card" style={{ padding: 'var(--space-6)' }}>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 500 }}>Value / RevPAR</p>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>$12,450</h3>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 'var(--space-10)' }}><Loader2 className="spin" size={48} /></div>
      ) : activeTab === 'stock' ? (
        /* STOCK VIEW */
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ background: 'var(--bg-main)', borderBottom: '1px solid var(--border)' }}>
              <tr>
                <th style={{ padding: 'var(--space-4)', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Item Name</th>
                <th style={{ padding: 'var(--space-4)', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Current Qty</th>
                <th style={{ padding: 'var(--space-4)', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: 'var(--space-4)' }}>
                    <div style={{ fontWeight: 600 }}>{item.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>SKU: {item.sku}</div>
                  </td>
                  <td style={{ padding: 'var(--space-4)', fontWeight: 700 }}>{item.quantity} {item.unit}</td>
                  <td style={{ padding: 'var(--space-4)' }}>
                    <span style={{ 
                      padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700,
                      background: item.quantity <= item.minQuantity ? '#fee2e2' : '#dcfce7',
                      color: item.quantity <= item.minQuantity ? '#ef4444' : '#10b981'
                    }}>
                      {item.quantity <= item.minQuantity ? 'LOW STOCK' : 'IN STOCK'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* ROOM INVENTORY VIEW */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 'var(--space-4)' }}>
          {rooms.map(room => (
            <div key={room.id} className="card" style={{ padding: 'var(--space-4)', borderTop: `4px solid ${getStatusColor(room.status)}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontWeight: 800, fontSize: '1.125rem' }}>#{room.number}</span>
                {room.status === 'AVAILABLE' && <CheckCircle size={16} color="#10b981" />}
                {room.status === 'OCCUPIED' && <Clock size={16} color="#3b82f6" />}
                {room.status === 'MAINTENANCE' && <Hammer size={16} color="#ef4444" />}
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '12px' }}>{room.type}</p>
              <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: getStatusColor(room.status), textTransform: 'uppercase' }}>
                {room.status}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* --- ADD ITEM MODAL --- */}
      {showModal && (activeTab === 'stock') && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="card" style={{ width: '100%', maxWidth: '400px', padding: 'var(--space-6)', position: 'relative' }}>
            <button onClick={() => setShowModal(false)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', cursor: 'pointer' }}>
              <X size={20} color="var(--text-muted)" />
            </button>
            <h2 style={{ fontSize: '1.25rem', marginBottom: 'var(--space-4)', fontWeight: 800 }}>Add Stock Item</h2>
            <form onSubmit={handleAddItem} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <div><label className="form-label">Item Name</label><input name="name" className="input" required /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div><label className="form-label">Quantity</label><input name="quantity" type="number" className="input" required /></div>
                <div><label className="form-label">Min Threshold</label><input name="minQuantity" type="number" className="input" required /></div>
              </div>
              <div>
                <label className="form-label">Unit</label>
                <select name="unit" className="input">
                  <option value="pcs">Pieces</option>
                  <option value="kg">Kilograms</option>
                  <option value="ltr">Liters</option>
                </select>
              </div>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? <Loader2 className="spin" size={18} /> : 'Save Item'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
