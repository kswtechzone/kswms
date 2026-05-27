'use client';

import { API_BASE_URL } from '@/lib/api';

import React, { useEffect, useState } from 'react';
import { 
  BedDouble, 
  CalendarCheck, 
  TrendingUp, 
  Clock,
  ArrowRight,
  Plus,
  X,
  Loader2
} from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/components/Toast';

export default function HMSOverview() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const { showToast } = useToast();

  // Modals state
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [showHotelModal, setShowHotelModal] = useState(false);
  
  // Data for Modals
  const [hotels, setHotels] = useState<any[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [selectedHotelId, setSelectedHotelId] = useState<string>('');

  // Form states
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isHourlyAvailable, setIsHourlyAvailable] = useState(false);

  const fetchHMSStats = async (orgId: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/hotel/recent`, {
        headers: { 
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'x-tenant-id': orgId
        }
      });
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error('HMS Stats Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchHotels = async (orgId: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/hotel`, {
        headers: { 
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'x-tenant-id': orgId
        }
      });
      if (res.ok) {
        const data = await res.json();
        setHotels(data);
        if (data.length > 0) {
          setSelectedHotelId(data[0].id);
          fetchRooms(data[0].id, orgId);
        }
      }
    } catch (err) {
      console.error('Failed to fetch hotels:', err);
    }
  };

  const fetchBrands = async (orgId: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/organizations/${orgId}/brands`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` }
      });
      if (res.ok) {
        const data = await res.json();
        setBrands(data);
      }
    } catch (err) {
      console.error('Failed to fetch brands:', err);
    }
  };

  const fetchRooms = async (hotelId: string, orgId: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/hotel/${hotelId}/rooms`, {
        headers: { 
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'x-tenant-id': orgId
        }
      });
      if (res.ok) {
        const data = await res.json();
        setRooms(data);
      }
    } catch (err) {
      console.error('Failed to fetch rooms:', err);
    }
  };

  useEffect(() => {
    const parsedUser = JSON.parse(localStorage.getItem('user') || '{}');
    if (!parsedUser.organization?.id) return;
    setUser(parsedUser);
    
    fetchHMSStats(parsedUser.organization.id);
    fetchHotels(parsedUser.organization.id);
    fetchBrands(parsedUser.organization.id);
  }, []);

  const handleHotelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const hId = e.target.value;
    setSelectedHotelId(hId);
    if (user?.organization?.id) {
      fetchRooms(hId, user.organization.id);
    }
  };

  const handleAddHotel = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    
    const formData = new FormData(e.currentTarget);
    const payload = {
      name: formData.get('name'),
      address: formData.get('address'),
      organizationId: user.organization.id,
      brandId: formData.get('brandId')
    };

    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/hotel`, {
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
        throw new Error(err.message || 'Failed to add property');
      }

      setShowHotelModal(false);
      fetchHotels(user.organization.id);
      showToast('Property added successfully!', 'success');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddRoom = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedHotelId) {
      setError('Please select a hotel property first');
      return;
    }
    setSubmitting(true);
    setError('');
    
    const formData = new FormData(e.currentTarget);
    const payload = {
      hotelId: selectedHotelId,
      roomNumber: formData.get('roomNumber'),
      type: formData.get('type'),
      dailyRate: Number(formData.get('dailyRate')),
      capacity: Number(formData.get('capacity')) || 2,
      isHourlyAvailable: isHourlyAvailable,
      rate3h: formData.get('rate3h') ? Number(formData.get('rate3h')) : undefined,
      rate6h: formData.get('rate6h') ? Number(formData.get('rate6h')) : undefined,
      rate9h: formData.get('rate9h') ? Number(formData.get('rate9h')) : undefined,
      rate12h: formData.get('rate12h') ? Number(formData.get('rate12h')) : undefined,
    };

    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/hotel/room`, {
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
        throw new Error(err.message || 'Failed to add room');
      }

      setShowRoomModal(false);
      fetchRooms(selectedHotelId, user.organization.id);
      showToast('Room added successfully!', 'success');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleNewBooking = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const payload = {
      roomId: formData.get('roomId'),
      guestName: formData.get('guestName'),
      guestEmail: formData.get('guestEmail'),
      guestPhone: formData.get('guestPhone'),
      startTime: new Date(formData.get('startTime') as string).toISOString(),
      endTime: new Date(formData.get('endTime') as string).toISOString(),
      notes: formData.get('notes')
    };

    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/hotel/booking`, {
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
        throw new Error(err.message || 'Failed to create booking');
      }

      setShowBookingModal(false);
      fetchHMSStats(user.organization.id);
      showToast('Booking created successfully!', 'success');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const cards = [
    { label: 'Available Rooms', value: rooms.length > 0 ? rooms.length.toString() : '0', icon: BedDouble, color: '#3b82f6' },
    { label: 'Today\'s Bookings', value: stats ? stats.length.toString() : '0', icon: CalendarCheck, color: '#10b981' },
    { label: 'Total Revenue', value: '$0', icon: TrendingUp, color: '#f59e0b' },
  ];

  return (
    <div>
      <div style={{ marginBottom: 'var(--space-8)' }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--text-main)' }}>HMS Overview</h1>
        <p style={{ color: 'var(--text-muted)' }}>Real-time operations and property performance.</p>
      </div>

      <div className="stats-grid" style={{ marginBottom: 'var(--space-10)' }}>
        {cards.map((card) => (
          <div key={card.label} className="card stat-card">
            <div style={{ padding: 'var(--space-2)', borderRadius: 'var(--radius-md)', background: `${card.color}15`, color: card.color, width: 'fit-content', marginBottom: 'var(--space-4)' }}>
              <card.icon size={24} />
            </div>
            <span className="stat-label">{card.label}</span>
            <div className="stat-value">{card.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--space-6)' }}>
        <div className="card" style={{ padding: 'var(--space-6)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Recent Bookings</h3>
            <Link href="/dashboard/hotel-management/bookings" style={{ color: 'var(--primary)', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
              View All <ArrowRight size={14} />
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {loading ? (
              <div style={{ padding: 'var(--space-6)', textAlign: 'center' }}><Loader2 className="spin" /></div>
            ) : !stats || stats.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 'var(--space-10)', border: '1px dashed var(--border)', borderRadius: 'var(--radius-lg)' }}>
                 <Clock size={32} style={{ color: 'var(--text-muted)', marginBottom: 'var(--space-4)' }} />
                 <p style={{ color: 'var(--text-muted)' }}>No recent bookings found.</p>
              </div>
            ) : (
              stats.map((booking: any) => (
                <div key={booking.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-4)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
                  <div>
                    <div style={{ fontWeight: 600 }}>{booking.guestName}</div>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Room {booking.room?.roomNumber} • {booking.room?.type}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 700, color: 'var(--primary)' }}>${booking.totalPrice}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {new Date(booking.startTime).toLocaleDateString()} {new Date(booking.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          <div className="card" style={{ padding: 'var(--space-6)', background: 'var(--primary)', color: 'white' }}>
            <h3 style={{ marginBottom: 'var(--space-2)' }}>Quick Actions</h3>
            <p style={{ fontSize: '0.875rem', opacity: 0.9, marginBottom: 'var(--space-6)' }}>Operational shortcuts for property managers.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              <button onClick={() => setShowBookingModal(true)} className="btn" style={{ background: 'white', color: 'var(--primary)', width: '100%', fontWeight: 700 }}>
                <Plus size={18} /> New Booking
              </button>
              <button onClick={() => setShowRoomModal(true)} className="btn" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', width: '100%' }}>
                Add Room
              </button>
              <button onClick={() => setShowHotelModal(true)} className="btn" style={{ background: 'transparent', color: 'white', border: '1px solid rgba(255,255,255,0.2)', width: '100%', marginTop: 'var(--space-2)' }}>
                Add Property
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* --- ADD HOTEL MODAL --- */}
      {showHotelModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="card" style={{ width: '100%', maxWidth: '400px', padding: 'var(--space-6)', position: 'relative' }}>
            <button onClick={() => setShowHotelModal(false)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', cursor: 'pointer' }}>
              <X size={20} color="var(--text-muted)" />
            </button>
            <h2 style={{ fontSize: '1.25rem', marginBottom: 'var(--space-4)' }}>Add Accommodation</h2>
            {error && <div style={{ padding: '10px', background: '#fee2e2', color: '#ef4444', borderRadius: '4px', marginBottom: '16px', fontSize: '14px' }}>{error}</div>}
            
            <form onSubmit={handleAddHotel} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              <div>
                <label className="form-label">Brand</label>
                <select name="brandId" className="input" required>
                  {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
              </div>
              <div>
                <label className="form-label">Property Name</label>
                <input name="name" type="text" className="input" placeholder="e.g. Sunrise Guest House" required />
              </div>
              <div>
                <label className="form-label">Address</label>
                <input name="address" type="text" className="input" placeholder="123 Main St, City" required />
              </div>
              <button type="submit" className="btn btn-primary" disabled={submitting} style={{ marginTop: 'var(--space-4)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                {submitting ? <Loader2 size={18} className="spin" /> : null}
                {submitting ? 'Saving Property...' : 'Save Property'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- ADD ROOM MODAL --- */}
      {showRoomModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="card" style={{ width: '100%', maxWidth: '400px', padding: 'var(--space-6)', position: 'relative' }}>
            <button onClick={() => setShowRoomModal(false)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', cursor: 'pointer' }}>
              <X size={20} color="var(--text-muted)" />
            </button>
            <h2 style={{ fontSize: '1.25rem', marginBottom: 'var(--space-4)' }}>Add New Room</h2>
            {error && <div style={{ padding: '10px', background: '#fee2e2', color: '#ef4444', borderRadius: '4px', marginBottom: '16px', fontSize: '14px' }}>{error}</div>}
            
            <form onSubmit={handleAddRoom} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              <div>
                <label className="form-label">Hotel Property</label>
                <select className="input" value={selectedHotelId} onChange={handleHotelChange} required>
                  {hotels.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
                </select>
              </div>
              <div>
                <label className="form-label">Room Number</label>
                <input name="roomNumber" type="text" className="input" placeholder="e.g. 101" required />
              </div>
              <div>
                <label className="form-label">Room Type</label>
                <select name="type" className="input" required>
                  <option value="Standard">Standard</option>
                  <option value="Deluxe">Deluxe</option>
                  <option value="Suite">Suite</option>
                </select>
              </div>
              <div>
                <label className="form-label">Daily Rate ($)</label>
                <input name="dailyRate" type="number" step="0.01" className="input" placeholder="0.00" required />
              </div>

              <div>
                <label className="form-label">Capacity (Persons)</label>
                <input name="capacity" type="number" className="input" defaultValue={2} required />
              </div>

              <div style={{ background: 'var(--bg-main)', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontWeight: 600, cursor: 'pointer', marginBottom: isHourlyAvailable ? 'var(--space-3)' : '0' }}>
                  <input name="isHourlyAvailable" type="checkbox" checked={isHourlyAvailable} onChange={(e) => setIsHourlyAvailable(e.target.checked)} />
                  Available for hourly stay (Fixed Blocks)
                </label>
                
                {isHourlyAvailable && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-2)' }}>
                    <div>
                      <label className="form-label">3-Hour Rate ($)</label>
                      <input name="rate3h" type="number" step="0.01" className="input" placeholder="0.00" />
                    </div>
                    <div>
                      <label className="form-label">6-Hour Rate ($)</label>
                      <input name="rate6h" type="number" step="0.01" className="input" placeholder="0.00" />
                    </div>
                    <div>
                      <label className="form-label">9-Hour Rate ($)</label>
                      <input name="rate9h" type="number" step="0.01" className="input" placeholder="0.00" />
                    </div>
                    <div>
                      <label className="form-label">12-Hour Rate ($)</label>
                      <input name="rate12h" type="number" step="0.01" className="input" placeholder="0.00" />
                    </div>
                  </div>
                )}
              </div>

              <button type="submit" className="btn btn-primary" disabled={submitting} style={{ marginTop: 'var(--space-4)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                {submitting ? <Loader2 size={18} className="spin" /> : null}
                {submitting ? 'Saving Room...' : 'Save Room'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- NEW BOOKING MODAL --- */}
      {showBookingModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="card" style={{ width: '100%', maxWidth: '500px', padding: 'var(--space-6)', position: 'relative' }}>
            <button onClick={() => setShowBookingModal(false)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', cursor: 'pointer' }}>
              <X size={20} color="var(--text-muted)" />
            </button>
            <h2 style={{ fontSize: '1.25rem', marginBottom: 'var(--space-4)' }}>New Booking</h2>
            {error && <div style={{ padding: '10px', background: '#fee2e2', color: '#ef4444', borderRadius: '4px', marginBottom: '16px', fontSize: '14px' }}>{error}</div>}
            
            <form onSubmit={handleNewBooking} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                <div style={{ flex: 1 }}>
                  <label className="form-label">Hotel</label>
                  <select className="input" value={selectedHotelId} onChange={handleHotelChange} required>
                    {hotels.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label className="form-label">Room</label>
                  <select name="roomId" className="input" required>
                    {rooms.map(r => <option key={r.id} value={r.id}>Room {r.roomNumber} - {r.type}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="form-label">Guest Name</label>
                <input name="guestName" type="text" className="input" placeholder="John Doe" required />
              </div>

              <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                <div style={{ flex: 1 }}>
                  <label className="form-label">Guest Email</label>
                  <input name="guestEmail" type="email" className="input" placeholder="john@example.com" required />
                </div>
                <div style={{ flex: 1 }}>
                  <label className="form-label">Phone Number</label>
                  <input name="guestPhone" type="text" className="input" placeholder="+1..." />
                </div>
              </div>

              <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                <div style={{ flex: 1 }}>
                  <label className="form-label">Check-In</label>
                  <input name="startTime" type="datetime-local" className="input" required />
                </div>
                <div style={{ flex: 1 }}>
                  <label className="form-label">Check-Out</label>
                  <input name="endTime" type="datetime-local" className="input" required />
                </div>
              </div>

              <div>
                <label className="form-label">Notes</label>
                <textarea name="notes" className="input" rows={2} placeholder="Optional notes..."></textarea>
              </div>

              <button type="submit" className="btn btn-primary" disabled={submitting} style={{ marginTop: 'var(--space-4)' }}>
                {submitting ? 'Confirming...' : 'Confirm Booking'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
