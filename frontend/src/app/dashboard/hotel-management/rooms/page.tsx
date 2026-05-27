'use client';

import { API_BASE_URL } from '@/lib/api';

import React, { useEffect, useState } from 'react';
import { 
  BedDouble, 
  Plus, 
  Search, 
  Filter,
  MoreVertical,
  Edit,
  Trash
} from 'lucide-react';

export default function RoomsManagement() {
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user.organization?.id) return;

    const fetchRooms = async () => {
      try {
        // First get hotels for this org
        const hotelRes = await fetch(`${API_BASE_URL}/api/v1/hotel`, {
          headers: { 
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
            'x-tenant-id': user.organization.id
          }
        });
        if (hotelRes.ok) {
          const hotels = await hotelRes.json();
          if (hotels.length > 0) {
            // Then get rooms for the first hotel
            const roomRes = await fetch(`${API_BASE_URL}/api/v1/hotel/${hotels[0].id}/rooms`, {
              headers: { 
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                'x-tenant-id': user.organization.id
              }
            });
            if (roomRes.ok) {
              setRooms(await roomRes.json());
            }
          }
        }
      } catch (err) {
        console.error('Fetch Rooms Error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-8)' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Room Inventory</h1>
          <p style={{ color: 'var(--text-muted)' }}>Manage room types, rates, and current status.</p>
        </div>
        <button className="btn btn-primary" style={{ gap: 'var(--space-2)' }}>
          <Plus size={18} /> Add New Room
        </button>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: 'var(--space-4)', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ position: 'relative', width: '300px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input type="text" placeholder="Search rooms..." className="input" style={{ paddingLeft: '40px' }} />
          </div>
          <button className="btn" style={{ background: 'transparent', border: '1px solid var(--border)', gap: 'var(--space-2)' }}>
            <Filter size={16} /> Filter
          </button>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-main)' }}>
              <th style={{ padding: 'var(--space-4)', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Room No.</th>
              <th style={{ padding: 'var(--space-4)', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Type</th>
              <th style={{ padding: 'var(--space-4)', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Rates (H / D)</th>
              <th style={{ padding: 'var(--space-4)', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Status</th>
              <th style={{ padding: 'var(--space-4)', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} style={{ padding: 'var(--space-10)', textAlign: 'center' }}>Loading rooms...</td></tr>
            ) : rooms.length === 0 ? (
              <tr><td colSpan={5} style={{ padding: 'var(--space-10)', textAlign: 'center' }}>No rooms configured yet.</td></tr>
            ) : rooms.map((room) => (
              <tr key={room.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: 'var(--space-4)', fontWeight: 700, color: 'var(--text-main)' }}>{room.roomNumber}</td>
                <td style={{ padding: 'var(--space-4)' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                     <BedDouble size={16} color="var(--primary)" />
                     {room.type}
                   </div>
                </td>
                <td style={{ padding: 'var(--space-4)' }}>
                  <div style={{ fontSize: '0.9375rem' }}>
                    <span style={{ fontWeight: 700, color: 'var(--primary)' }}>${room.dailyRate}</span> /day
                  </div>
                  {room.isHourlyAvailable && (
                    <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                      Hourly Enabled
                    </div>
                  )}
                </td>
                <td style={{ padding: 'var(--space-4)' }}>
                  <span style={{ 
                    padding: '4px 10px', 
                    borderRadius: '20px', 
                    fontSize: '0.75rem', 
                    fontWeight: 700,
                    background: room.status === 'AVAILABLE' ? '#dcfce7' : '#f1f5f9',
                    color: room.status === 'AVAILABLE' ? '#166534' : '#475569'
                  }}>
                    {room.status}
                  </span>
                </td>
                <td style={{ padding: 'var(--space-4)' }}>
                  <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                    <button className="btn" style={{ padding: 'var(--space-2)', background: 'transparent', border: '1px solid var(--border)' }}>
                      <Edit size={16} />
                    </button>
                    <button className="btn" style={{ padding: 'var(--space-2)', background: 'transparent', border: '1px solid var(--border)', color: '#ef4444' }}>
                      <Trash size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
