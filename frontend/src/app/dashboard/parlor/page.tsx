'use client';

import { API_BASE_URL } from '@/lib/api';

import React, { useEffect, useState } from 'react';
import { 
  Scissors, 
  CalendarCheck, 
  Plus, 
  X, 
  Loader2, 
  Clock, 
  DollarSign,
  User,
  Filter,
  Search,
  Tag,
  Check,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useToast } from '@/components/Toast';

export default function ParlorOverview() {
  const [services, setServices] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [user, setUser] = useState<any>(null);
  const { showToast } = useToast();

  // Modals
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);

  // Multi-service selection state
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [serviceImage, setServiceImage] = useState<string>('');
  const [posCategoryFilter, setPosCategoryFilter] = useState('ALL');
  const [posSearchQuery, setPosSearchQuery] = useState('');
  const [updatingBookingId, setUpdatingBookingId] = useState<string | null>(null);
  const [reschedulingBookingId, setReschedulingBookingId] = useState<string | null>(null);
  const [selectedRescheduleDate, setSelectedRescheduleDate] = useState<string>('');
  
  // POS Discount & Payment selectors
  const [posDiscount, setPosDiscount] = useState<number>(0);
  const [posDiscountType, setPosDiscountType] = useState<'PERCENT' | 'AMOUNT'>('PERCENT');
  const [posPaymentMethod, setPosPaymentMethod] = useState<'CASH' | 'CARD' | 'PAY_ON_VISIT'>('CASH');

  // Controlled POS guest details
  const [posGuestName, setPosGuestName] = useState('');
  const [posGuestPhone, setPosGuestPhone] = useState('');
  const [posGuestEmail, setPosGuestEmail] = useState('');

  // CRM Search state
  const [crmSearchQuery, setCrmSearchQuery] = useState('');
  const [crmSearchResults, setCrmSearchResults] = useState<any[]>([]);
  const [isCrmSearching, setIsCrmSearching] = useState(false);
  const [showCrmDropdown, setShowCrmDropdown] = useState(false);

  useEffect(() => {
    if (!crmSearchQuery) {
      setCrmSearchResults([]);
      setShowCrmDropdown(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsCrmSearching(true);
      try {
        const res = await fetch(`${API_BASE_URL}/api/v1/crm/guests/search?q=${encodeURIComponent(crmSearchQuery)}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
            'x-tenant-id': user.organization.id
          }
        });
        if (res.ok) {
          setCrmSearchResults(await res.json());
          setShowCrmDropdown(true);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsCrmSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [crmSearchQuery]);

  useEffect(() => {
    const parsedUser = JSON.parse(localStorage.getItem('user') || '{}');
    if (!parsedUser.organization?.id) return;
    setUser(parsedUser);
    fetchData(parsedUser.organization.id);
  }, []);

  const fetchData = async (orgId: string) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      const [svcRes, catRes, bkgRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/v1/parlor/services`, { headers: { 'Authorization': `Bearer ${token}`, 'x-tenant-id': orgId } }),
        fetch(`${API_BASE_URL}/api/v1/parlor/categories`, { headers: { 'Authorization': `Bearer ${token}`, 'x-tenant-id': orgId } }),
        fetch(`${API_BASE_URL}/api/v1/parlor/bookings`, { headers: { 'Authorization': `Bearer ${token}`, 'x-tenant-id': orgId } })
      ]);
      
      if (svcRes.ok) setServices(await svcRes.json());
      if (catRes.ok) setCategories(await catRes.json());
      if (bkgRes.ok) setBookings(await bkgRes.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateBookingStatus = async (bookingId: string, status: string, paymentStatus?: string, bookingTime?: string) => {
    setUpdatingBookingId(bookingId);
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/parlor/bookings/${bookingId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'x-tenant-id': user.organization.id
        },
        body: JSON.stringify({ status, paymentStatus, bookingTime })
      });
      if (res.ok) {
        showToast('Appointment updated successfully!', 'success');
        fetchData(user.organization.id);
      } else {
        showToast('Failed to update appointment.', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Error updating appointment.', 'error');
    } finally {
      setUpdatingBookingId(null);
    }
  };

  const handleAddCategory = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name');

    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/parlor/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'x-tenant-id': user.organization.id
        },
        body: JSON.stringify({ name })
      });
      if (res.ok) {
        setShowCategoryModal(false);
        fetchData(user.organization.id);
        showToast('Category added successfully!', 'success');
      }
    } catch (err) {
      showToast('Failed to add category', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddService = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const payload = {
      name: formData.get('name'),
      categoryId: formData.get('categoryId'),
      price: Number(formData.get('price')),
      duration: Number(formData.get('duration')),
      description: formData.get('description'),
      image: serviceImage || undefined
    };

    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/parlor/services`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'x-tenant-id': user.organization.id
        },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setShowServiceModal(false);
        setServiceImage('');
        fetchData(user.organization.id);
        showToast('Service added successfully!', 'success');
      }
    } catch (err) {
      showToast('Failed to add service', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleNewBooking = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (selectedServices.length === 0) {
      showToast('Please select at least one service', 'error');
      return;
    }
    setSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const payload = {
      serviceIds: selectedServices,
      guestName: formData.get('guestName'),
      guestPhone: formData.get('guestPhone'),
      guestEmail: formData.get('guestEmail'),
      bookingTime: new Date(formData.get('bookingTime') as string).toISOString(),
      notes: formData.get('notes'),
      paymentMethod: posPaymentMethod,
      discount: getDiscountAmount(),
      registerCustomerProfile: formData.get('registerCustomerProfile') === 'on'
    };

    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/parlor/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'x-tenant-id': user.organization.id
        },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setShowBookingModal(false);
        setSelectedServices([]);
        setPosDiscount(0);
        setPosPaymentMethod('CASH');
        setPosGuestName('');
        setPosGuestPhone('');
        setPosGuestEmail('');
        fetchData(user.organization.id);
        showToast('Booking scheduled successfully!', 'success');
      }
    } catch (err) {
      showToast('Failed to schedule booking', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const toggleServiceSelection = (id: string) => {
    setSelectedServices(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const getBaseTotal = () => {
    return services
      .filter(s => selectedServices.includes(s.id))
      .reduce((sum, s) => sum + s.price, 0);
  };

  const getDiscountAmount = () => {
    const base = getBaseTotal();
    if (posDiscountType === 'PERCENT') {
      return base * (posDiscount / 100);
    } else {
      return posDiscount;
    }
  };

  const calculateSelectedTotal = () => {
    const base = getBaseTotal();
    return Math.max(0, base - getDiscountAmount());
  };

  return (
    <div style={{ paddingBottom: 'var(--space-10)' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-8)' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Parlor Management</h1>
          <p style={{ color: 'var(--text-muted)' }}>Manage salon services, categories, and multi-service appointments.</p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
          <button className="btn" onClick={() => setShowCategoryModal(true)} style={{ background: 'white', border: '1px solid var(--border)' }}>
             <Tag size={18} /> Categories
          </button>
          <button className="btn" onClick={() => setShowServiceModal(true)} style={{ background: 'white', border: '1px solid var(--border)' }}>
             <Scissors size={18} /> Manage Services
          </button>
          <button className="btn btn-primary" onClick={() => setShowBookingModal(true)}>
             <Plus size={18} /> New Appointment
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-6)', marginBottom: 'var(--space-10)' }}>
        {[
          { label: 'Today Appointments', value: bookings.length, icon: CalendarCheck, color: 'var(--primary)' },
          { label: 'Service Categories', value: categories.length, icon: Tag, color: '#8b5cf6' },
          { label: 'Estimated Revenue', value: `$${bookings.reduce((s,b) => s + b.totalPrice, 0)}`, icon: DollarSign, color: '#10b981' },
          { label: 'Active Services', value: services.length, icon: Scissors, color: '#f59e0b' },
        ].map((stat, i) => (
          <div key={i} className="card" style={{ padding: 'var(--space-6)', display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
            <div style={{ padding: '12px', background: `${stat.color}15`, borderRadius: '12px' }}>
              <stat.icon size={24} color={stat.color} />
            </div>
            <div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 500 }}>{stat.label}</p>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--space-8)' }}>
        {/* Recent Appointments */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: 'var(--space-6)', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontWeight: 800 }}>Recent Appointments</h3>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="btn btn-sm" style={{ background: 'transparent', border: '1px solid var(--border)' }}><Filter size={14} /></button>
              <button className="btn btn-sm" style={{ background: 'transparent', border: '1px solid var(--border)' }}><Search size={14} /></button>
            </div>
          </div>
          
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ background: 'var(--bg-main)', borderBottom: '1px solid var(--border)' }}>
              <tr>
                <th style={{ padding: 'var(--space-4)', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Client</th>
                <th style={{ padding: 'var(--space-4)', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Services</th>
                <th style={{ padding: 'var(--space-4)', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total</th>
                <th style={{ padding: 'var(--space-4)', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Payment</th>
                <th style={{ padding: 'var(--space-4)', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Status</th>
                <th style={{ padding: 'var(--space-4)', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} style={{ padding: '40px', textAlign: 'center' }}><Loader2 className="spin" /></td></tr>
              ) : bookings.length === 0 ? (
                <tr><td colSpan={6} style={{ padding: '40px', textAlign: 'center' }}>No appointments scheduled.</td></tr>
              ) : bookings.map(b => (
                <tr key={b.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: 'var(--space-4)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <User size={14} />
                      </div>
                      <div>
                        <span style={{ fontWeight: 600, display: 'block' }}>{b.guestName}</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>{new Date(b.bookingTime).toLocaleString()}</span>
                        {b.guestPhone && <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>📞 {b.guestPhone}</span>}
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: 'var(--space-4)' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                      {b.services?.map((item: any) => (
                        <span key={item.id} style={{ padding: '2px 8px', background: 'var(--bg-main)', border: '1px solid var(--border)', borderRadius: '4px', fontSize: '0.6875rem' }}>
                          {item.service?.name}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td style={{ padding: 'var(--space-4)', fontWeight: 800, color: 'var(--primary)' }}>
                    ${b.totalPrice}
                  </td>
                  <td style={{ padding: 'var(--space-4)' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <span style={{ 
                        fontSize: '0.65rem', fontWeight: 700, width: 'fit-content', padding: '2px 8px', borderRadius: '4px',
                        background: b.paymentMethod === 'PAY_NOW' ? 'rgba(166, 118, 83, 0.1)' : 'rgba(100, 116, 139, 0.1)',
                        color: b.paymentMethod === 'PAY_NOW' ? 'var(--primary)' : 'var(--text-muted)'
                      }}>
                        {b.paymentMethod === 'PAY_NOW' ? 'Prepaid (Online)' : 'Pay on Visit'}
                      </span>
                      
                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                        <span style={{ 
                          fontSize: '0.65rem', fontWeight: 800, padding: '1px 6px', borderRadius: '3px',
                          background: b.paymentStatus === 'PAID' ? '#dcfce7' : b.paymentStatus === 'REFUNDED' ? '#fee2e2' : '#f1f5f9',
                          color: b.paymentStatus === 'PAID' ? '#166534' : b.paymentStatus === 'REFUNDED' ? '#991b1b' : '#475569'
                        }}>
                          {b.paymentStatus || 'UNPAID'}
                        </span>

                        {b.paymentStatus === 'UNPAID' && b.status !== 'CANCELLED' && (
                          <button 
                            onClick={() => handleUpdateBookingStatus(b.id, b.status, 'PAID')}
                            disabled={updatingBookingId === b.id}
                            style={{ 
                              background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.65rem', 
                              color: 'var(--primary)', padding: 0, fontWeight: 700, textDecoration: 'underline'
                            }}
                          >
                            Mark Paid
                          </button>
                        )}
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: 'var(--space-4)' }}>
                    <span style={{ 
                      padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700,
                      background: b.status === 'CONFIRMED' ? '#dcfce7' : b.status === 'PENDING' ? '#fef3c7' : b.status === 'REFUNDED' ? '#fee2e2' : b.status === 'CANCELLED' ? '#f1f5f9' : b.status === 'RESCHEDULED' ? 'rgba(14, 165, 233, 0.15)' : '#e2e8f0',
                      color: b.status === 'CONFIRMED' ? '#166534' : b.status === 'PENDING' ? '#92400e' : b.status === 'REFUNDED' ? '#991b1b' : b.status === 'CANCELLED' ? '#475569' : b.status === 'RESCHEDULED' ? '#0ea5e9' : '#0f172a'
                    }}>
                      {b.status}
                    </span>
                  </td>
                  <td style={{ padding: 'var(--space-4)', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                      {b.status === 'PENDING' && (
                        <>
                          <button 
                            onClick={() => handleUpdateBookingStatus(b.id, 'CONFIRMED')}
                            disabled={updatingBookingId === b.id}
                            className="btn btn-sm btn-primary" 
                            style={{ padding: '4px 8px', fontSize: '0.7rem', height: 'auto' }}
                          >
                            Confirm
                          </button>
                          <button 
                            onClick={() => {
                              setReschedulingBookingId(b.id);
                              setSelectedRescheduleDate(new Date(b.bookingTime).toISOString().slice(0, 16));
                            }}
                            disabled={updatingBookingId === b.id}
                            className="btn btn-sm" 
                            style={{ padding: '4px 8px', fontSize: '0.7rem', height: 'auto', background: 'rgba(14, 165, 233, 0.1)', color: '#0ea5e9', border: 'none' }}
                          >
                            Reschedule
                          </button>
                          <button 
                            onClick={() => handleUpdateBookingStatus(b.id, 'CANCELLED')}
                            disabled={updatingBookingId === b.id}
                            className="btn btn-sm" 
                            style={{ padding: '4px 8px', fontSize: '0.7rem', height: 'auto', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: 'none' }}
                          >
                            Cancel
                          </button>
                        </>
                      )}
                      {b.status === 'CONFIRMED' && (
                        <>
                           <button 
                            onClick={() => {
                              setReschedulingBookingId(b.id);
                              setSelectedRescheduleDate(new Date(b.bookingTime).toISOString().slice(0, 16));
                            }}
                            disabled={updatingBookingId === b.id}
                            className="btn btn-sm" 
                            style={{ padding: '4px 8px', fontSize: '0.7rem', height: 'auto', background: 'rgba(14, 165, 233, 0.1)', color: '#0ea5e9', border: 'none' }}
                          >
                            Reschedule
                          </button>
                          {b.paymentStatus === 'PAID' && (
                            <button 
                              onClick={() => handleUpdateBookingStatus(b.id, 'REFUNDED')}
                              disabled={updatingBookingId === b.id}
                              className="btn btn-sm" 
                              style={{ padding: '4px 8px', fontSize: '0.7rem', height: 'auto', background: 'rgba(245, 158, 11, 0.1)', color: '#d97706', border: 'none' }}
                            >
                              Refund
                            </button>
                          )}
                          <button 
                            onClick={() => handleUpdateBookingStatus(b.id, 'CANCELLED')}
                            disabled={updatingBookingId === b.id}
                            className="btn btn-sm" 
                            style={{ padding: '4px 8px', fontSize: '0.7rem', height: 'auto', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: 'none' }}
                          >
                            Cancel
                          </button>
                        </>
                      )}
                      {b.status === 'RESCHEDULED' && (
                        <>
                          <button 
                            onClick={() => handleUpdateBookingStatus(b.id, 'CONFIRMED')}
                            disabled={updatingBookingId === b.id}
                            className="btn btn-sm btn-primary" 
                            style={{ padding: '4px 8px', fontSize: '0.7rem', height: 'auto' }}
                          >
                            Confirm
                          </button>
                          <button 
                            onClick={() => handleUpdateBookingStatus(b.id, 'CANCELLED')}
                            disabled={updatingBookingId === b.id}
                            className="btn btn-sm" 
                            style={{ padding: '4px 8px', fontSize: '0.7rem', height: 'auto', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: 'none' }}
                          >
                            Cancel
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Categories & Services */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
          <div className="card" style={{ padding: 'var(--space-6)' }}>
            <h3 style={{ fontWeight: 800, marginBottom: 'var(--space-6)' }}>Service Menu</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              {services.filter(s => s.isActive !== false).map(s => (
                <div key={s.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', background: 'var(--bg-main)', borderRadius: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'white', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border)' }}>
                      {s.image ? (
                        <img src={s.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={s.name} />
                      ) : (
                        <Scissors size={20} color="var(--primary)" />
                      )}
                    </div>
                    <div>
                      <h4 style={{ fontSize: '0.9375rem', fontWeight: 700 }}>{s.name}</h4>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{s.duration} mins • {s.category?.name}</p>
                    </div>
                  </div>
                  <div style={{ fontWeight: 800, color: 'var(--primary)' }}>${s.price}</div>
                </div>
              ))}
              {services.filter(s => s.isActive !== false).length === 0 && <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No services configured.</p>}
            </div>
          </div>
        </div>
      </div>

      {/* --- MODALS --- */}
      {showCategoryModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="card" style={{ width: '100%', maxWidth: '400px', padding: 'var(--space-6)', position: 'relative' }}>
            <button onClick={() => setShowCategoryModal(false)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', cursor: 'pointer' }}>
              <X size={20} color="var(--text-muted)" />
            </button>
            <h2 style={{ fontSize: '1.25rem', marginBottom: 'var(--space-4)', fontWeight: 800 }}>Manage Categories</h2>
            <form onSubmit={handleAddCategory} style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              <input name="name" className="input" placeholder="New Category Name" required />
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? <Loader2 className="spin" size={18} /> : <Plus size={18} />}
              </button>
            </form>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {categories.map(cat => (
                <span key={cat.id} style={{ padding: '4px 12px', background: 'var(--bg-main)', border: '1px solid var(--border)', borderRadius: '20px', fontSize: '0.875rem' }}>
                  {cat.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {showServiceModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="card" style={{ width: '100%', maxWidth: '400px', padding: 'var(--space-6)', position: 'relative' }}>
            <button onClick={() => setShowServiceModal(false)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', cursor: 'pointer' }}>
              <X size={20} color="var(--text-muted)" />
            </button>
            <h2 style={{ fontSize: '1.25rem', marginBottom: 'var(--space-4)', fontWeight: 800 }}>Add Parlor Service</h2>
            <form onSubmit={handleAddService} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <div><label className="form-label">Service Name</label><input name="name" className="input" placeholder="e.g. Haircut & Styling" required /></div>
              <div>
                <label className="form-label">Category</label>
                <select name="categoryId" className="input" required>
                  <option value="">Select Category</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div><label className="form-label">Price ($)</label><input name="price" type="number" className="input" placeholder="50" required /></div>
                <div><label className="form-label">Duration (min)</label><input name="duration" type="number" className="input" placeholder="45" required /></div>
              </div>
              <div><label className="form-label">Description</label><textarea name="description" className="input" placeholder="Optional details..." /></div>
              <div>
                <label className="form-label">Service Image</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {serviceImage ? (
                    <div style={{ position: 'relative', width: '100%', height: '140px', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border)' }}>
                      <img src={serviceImage} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Preview" />
                      <button 
                        type="button" 
                        onClick={() => setServiceImage('')}
                        style={{ position: 'absolute', top: '8px', right: '8px', background: 'rgba(239, 68, 68, 0.9)', color: 'white', border: 'none', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div 
                      onClick={() => document.getElementById('parlor-service-image-input')?.click()}
                      style={{ 
                        border: '2px dashed var(--border)', borderRadius: '12px', padding: '20px', 
                        textAlign: 'center', cursor: 'pointer', background: 'var(--bg-main)',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
                        transition: 'border-color 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
                      onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
                    >
                      <Plus size={20} color="var(--primary)" />
                      <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Click to upload cover image</span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>PNG, JPG up to 5MB</span>
                    </div>
                  )}
                  <input 
                    id="parlor-service-image-input"
                    type="file" 
                    accept="image/*" 
                    style={{ display: 'none' }} 
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setServiceImage(reader.result as string);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </div>
              </div>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? <Loader2 className="spin" size={18} /> : 'Save Service'}
              </button>
            </form>
          </div>
        </div>
      )}

      {reschedulingBookingId && (
        <div style={{
          position: 'fixed', inset: 0,
          background: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(8px)',
          zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '20px'
        }}>
          <div className="card glass" style={{ 
            width: '100%', maxWidth: '420px', padding: '24px', 
            border: '1px solid var(--border)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
            borderRadius: '12px'
          }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '12px', fontWeight: 800 }}>Reschedule Appointment</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '20px', lineHeight: '1.4' }}>
              Select a new date and time range for this appointment. This will update the booking state to rescheduled.
            </p>
            <div style={{ marginBottom: '24px' }}>
              <label className="form-label" style={{ fontSize: '0.75rem', marginBottom: '6px', display: 'block', fontWeight: 600 }}>
                New Appointment Date & Time
              </label>
              <input 
                type="datetime-local" 
                className="input" 
                value={selectedRescheduleDate}
                onChange={(e) => setSelectedRescheduleDate(e.target.value)}
                style={{ width: '100%', height: '40px', fontSize: '0.85rem', padding: '8px' }} 
              />
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button 
                onClick={() => setReschedulingBookingId(null)}
                className="btn" 
                style={{ background: 'var(--border)', color: 'var(--text-main)', border: 'none', padding: '8px 16px', fontSize: '0.85rem' }}
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  if (!selectedRescheduleDate) return;
                  handleUpdateBookingStatus(reschedulingBookingId, 'RESCHEDULED', undefined, selectedRescheduleDate);
                  setReschedulingBookingId(null);
                }}
                className="btn btn-primary"
                style={{ padding: '8px 16px', fontSize: '0.85rem' }}
              >
                Confirm Reschedule
              </button>
            </div>
          </div>
        </div>
      )}

      {showBookingModal && (
        <div style={{ 
          position: 'fixed', inset: 0, 
          background: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(8px)',
          zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '20px'
        }}>
          <div className="card glass" style={{ 
            width: '100%', maxWidth: '1200px', height: '85vh',
            padding: 0, position: 'relative', display: 'flex', flexDirection: 'column',
            overflow: 'hidden', border: '1px solid var(--border)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)'
          }}>
            {/* POS Header Bar */}
            <div style={{ 
              padding: '16px 24px', borderBottom: '1px solid var(--border)', 
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              background: 'var(--bg-main)'
            }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Scissors size={20} color="var(--primary)" />
                  Parlor Booking Terminal (POS)
                </h2>
                <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>Select treatments and fill client details to complete reservation.</p>
              </div>
              <button 
                onClick={() => { setShowBookingModal(false); setSelectedServices([]); }} 
                style={{ 
                  background: 'rgba(239, 68, 68, 0.1)', border: 'none', cursor: 'pointer',
                  padding: '8px', borderRadius: '50%', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', color: '#ef4444', transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
              >
                <X size={20} />
              </button>
            </div>

            {/* Split Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '7fr 5fr', flex: 1, minHeight: 0 }}>
              
              {/* Left Column: Visual Catalog */}
              <div style={{ 
                padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', 
                gap: '16px', borderRight: '1px solid var(--border)', background: '#f8fafc' 
              }}>
                {/* Search & Filter pills row */}
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <div style={{ position: 'relative', flex: 1 }}>
                    <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input 
                      type="text" 
                      className="input" 
                      placeholder="Search treatment..." 
                      style={{ paddingLeft: '36px', height: '40px', fontSize: '0.875rem' }}
                      value={posSearchQuery}
                      onChange={(e) => setPosSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                {/* Category Selector Pills */}
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <button 
                    onClick={() => setPosCategoryFilter('ALL')}
                    style={{
                      padding: '6px 14px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer',
                      background: posCategoryFilter === 'ALL' ? 'var(--primary)' : 'white',
                      color: posCategoryFilter === 'ALL' ? 'white' : 'var(--text-muted)',
                      border: posCategoryFilter === 'ALL' ? 'none' : '1px solid var(--border)',
                      boxShadow: posCategoryFilter === 'ALL' ? '0 4px 6px rgba(0,0,0,0.1)' : 'none'
                    }}
                  >
                    All Treatments
                  </button>
                  {categories.map(cat => (
                    <button 
                      key={cat.id}
                      onClick={() => setPosCategoryFilter(cat.name)}
                      style={{
                        padding: '6px 14px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer',
                        background: posCategoryFilter === cat.name ? 'var(--primary)' : 'white',
                        color: posCategoryFilter === cat.name ? 'white' : 'var(--text-muted)',
                        border: posCategoryFilter === cat.name ? 'none' : '1px solid var(--border)',
                        boxShadow: posCategoryFilter === cat.name ? '0 4px 6px rgba(0,0,0,0.1)' : 'none'
                      }}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>

                {/* Visual Grid */}
                <div style={{ 
                  display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', 
                  gap: '16px', marginTop: '8px' 
                }}>
                  {services
                    .filter(s => s.isActive !== false)
                    .filter(s => posCategoryFilter === 'ALL' || s.category?.name === posCategoryFilter)
                    .filter(s => s.name.toLowerCase().includes(posSearchQuery.toLowerCase()))
                    .map(s => {
                      const isSelected = selectedServices.includes(s.id);
                      return (
                        <div 
                          key={s.id}
                          onClick={() => toggleServiceSelection(s.id)}
                          style={{
                            background: 'white', borderRadius: '12px', overflow: 'hidden', cursor: 'pointer',
                            border: `2px solid ${isSelected ? 'var(--primary)' : 'var(--border)'}`,
                            boxShadow: isSelected ? '0 8px 20px rgba(139, 92, 246, 0.15)' : '0 2px 4px rgba(0,0,0,0.02)',
                            transition: 'all 0.2s ease', position: 'relative', display: 'flex', flexDirection: 'column', height: '180px'
                          }}
                        >
                          {/* Image cover / fallback */}
                          <div style={{ height: '80px', width: '100%', position: 'relative', background: '#f1f5f9' }}>
                            {s.image ? (
                              <img src={s.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={s.name} />
                            ) : (
                              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Scissors size={28} color="var(--primary)" style={{ opacity: 0.4 }} />
                              </div>
                            )}
                            <div style={{ 
                              position: 'absolute', top: '8px', right: '8px', background: 'rgba(255,255,255,0.95)',
                              padding: '2px 8px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary)'
                            }}>
                              ${s.price}
                            </div>
                          </div>

                          {/* Info */}
                          <div style={{ padding: '10px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                            <div>
                              <h4 style={{ margin: '0 0 4px 0', fontSize: '0.8125rem', fontWeight: 700, lineHeight: 1.2 }}>{s.name}</h4>
                              <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <Clock size={12} /> {s.duration} mins
                              </p>
                            </div>
                            
                            {/* Selection Check indicator */}
                            {isSelected && (
                              <div style={{ 
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px',
                                fontSize: '0.7rem', fontWeight: 800, color: 'var(--primary)', alignSelf: 'flex-end',
                                background: 'rgba(139, 92, 246, 0.1)', padding: '2px 8px', borderRadius: '20px'
                              }}>
                                <Check size={12} strokeWidth={3} /> Selected
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* Right Column: Checkout Cart */}
              <form onSubmit={handleNewBooking} style={{ 
                padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px',
                overflowY: 'auto', background: 'white' 
              }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: '0 0 4px 0', borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>
                  Reservation Overview
                </h3>

                {/* Selected services list */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minHeight: '120px', maxHeight: '180px', overflowY: 'auto' }}>
                  {selectedServices.length === 0 ? (
                    <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '24px 0', fontSize: '0.85rem' }}>
                      No treatments selected. Click cards on the left to add.
                    </div>
                  ) : (
                    services
                      .filter(s => selectedServices.includes(s.id))
                      .map(s => (
                        <div key={s.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: 'var(--bg-main)', borderRadius: '8px' }}>
                          <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>{s.name}</span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--primary)' }}>${s.price}</span>
                            <button 
                              type="button" 
                              onClick={() => toggleServiceSelection(s.id)}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', padding: 0 }}
                            >
                              <X size={14} />
                            </button>
                          </div>
                        </div>
                      ))
                  )}
                </div>

                {/* POS Discount Selector */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label className="form-label" style={{ fontSize: '0.75rem', fontWeight: 700, margin: 0 }}>POS Discount</label>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    {[0, 5, 10, 15, 20].map(pct => (
                      <button
                        key={pct}
                        type="button"
                        onClick={() => {
                          setPosDiscountType('PERCENT');
                          setPosDiscount(pct);
                        }}
                        style={{
                          flex: 1,
                          padding: '6px',
                          borderRadius: '8px',
                          border: `1px solid ${posDiscountType === 'PERCENT' && posDiscount === pct ? 'var(--primary)' : 'var(--border)'}`,
                          background: posDiscountType === 'PERCENT' && posDiscount === pct ? 'rgba(166, 118, 83, 0.1)' : 'white',
                          color: posDiscountType === 'PERCENT' && posDiscount === pct ? 'var(--primary)' : 'var(--text-main)',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        {pct}%
                      </button>
                    ))}
                    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border)', borderRadius: '8px', overflow: 'hidden', width: '90px', background: 'white' }}>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', paddingLeft: '8px', fontWeight: 700 }}>$</span>
                      <input
                        type="number"
                        min={0}
                        value={posDiscountType === 'AMOUNT' ? posDiscount : ''}
                        onChange={(e) => {
                          setPosDiscountType('AMOUNT');
                          setPosDiscount(Number(e.target.value) || 0);
                        }}
                        placeholder="Custom"
                        style={{
                          width: '100%',
                          height: '100%',
                          border: 'none',
                          outline: 'none',
                          padding: '4px 6px',
                          fontSize: '0.75rem',
                          fontWeight: 700
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* POS Payment Method Selector */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label className="form-label" style={{ fontSize: '0.75rem', fontWeight: 700, margin: 0 }}>POS Payment Method</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                    {[
                      { value: 'CASH', label: 'Cash', desc: 'Paid immediately' },
                      { value: 'CARD', label: 'Card / Online', desc: 'Paid immediately' },
                      { value: 'PAY_ON_VISIT', label: 'Pay on Visit', desc: 'Pay at counter' }
                    ].map(method => (
                      <div
                        key={method.value}
                        onClick={() => setPosPaymentMethod(method.value as any)}
                        style={{
                          padding: '10px 8px',
                          borderRadius: '10px',
                          border: `2px solid ${posPaymentMethod === method.value ? 'var(--primary)' : 'var(--border)'}`,
                          background: posPaymentMethod === method.value ? 'rgba(166, 118, 83, 0.05)' : 'white',
                          cursor: 'pointer',
                          textAlign: 'center',
                          transition: 'all 0.2s',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'center'
                        }}
                      >
                        <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-main)' }}>{method.label}</div>
                        <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', marginTop: '2px', lineHeight: 1.1 }}>{method.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Detailed Receipt Breakdown */}
                <div style={{ background: 'var(--bg-main)', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    <span>Subtotal</span>
                    <span style={{ fontWeight: 600 }}>${getBaseTotal()}</span>
                  </div>
                  {getDiscountAmount() > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#ef4444' }}>
                      <span>POS Discount</span>
                      <span style={{ fontWeight: 700 }}>-${getDiscountAmount().toFixed(2)}</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    <span>Payment Mode</span>
                    <span style={{ fontWeight: 700, color: 'var(--primary)' }}>
                      {posPaymentMethod === 'CASH' ? 'Cash (Paid)' : posPaymentMethod === 'CARD' ? 'Card (Paid)' : 'Pay on Visit (Unpaid)'}
                    </span>
                  </div>
                  <div style={{ borderTop: '1px dashed var(--border)', marginTop: '6px', paddingTop: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 800 }}>Total Due</span>
                    <span style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--primary)' }}>${calculateSelectedTotal().toFixed(2)}</span>
                  </div>
                </div>

                 {/* Guest Form details */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '4px' }}>
                  {/* Customer CRM Lookup (Enabled conditionally) */}
                  {user?.organization?.enabledModules?.includes('CRM') && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', position: 'relative', background: 'rgba(244, 63, 94, 0.03)', border: '1px dashed rgba(244, 63, 94, 0.25)', padding: '10px', borderRadius: '8px' }}>
                      <label className="form-label" style={{ fontSize: '0.75rem', fontWeight: 800, margin: 0, color: '#e11d48', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span>🔍 CRM Registered Customer Lookup</span>
                      </label>
                      <input 
                        type="text" 
                        placeholder="Type Customer Name, Phone, or Email..." 
                        className="input" 
                        value={crmSearchQuery}
                        onChange={(e) => setCrmSearchQuery(e.target.value)}
                        style={{ height: '34px', fontSize: '0.8rem', background: 'white' }}
                      />
                      
                      {/* CRM Search results dropdown */}
                      {showCrmDropdown && crmSearchResults.length > 0 && (
                        <div style={{
                          position: 'absolute', top: '60px', left: 0, right: 0,
                          background: 'white', border: '1px solid var(--border)',
                          borderRadius: '8px', zIndex: 100, boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                          maxHeight: '160px', overflowY: 'auto'
                        }}>
                          {crmSearchResults.map(g => (
                            <div 
                              key={g.id}
                              onClick={() => {
                                setPosGuestName(g.name);
                                setPosGuestPhone(g.phone || '');
                                setPosGuestEmail(g.email || '');
                                setShowCrmDropdown(false);
                                setCrmSearchQuery('');
                                showToast(`Linked Customer: ${g.name}`, 'success');
                              }}
                              style={{
                                padding: '8px 12px', cursor: 'pointer', borderBottom: '1px solid var(--border)',
                                fontSize: '0.8rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                              }}
                              className="crm-lookup-item"
                            >
                              <div>
                                <span style={{ fontWeight: 700, display: 'block' }}>{g.name}</span>
                                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                                  {g.phone && `📞 ${g.phone}`} {g.email && ` | ✉️ ${g.email}`}
                                </span>
                              </div>
                              <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#ec4899', background: 'rgba(236,72,153,0.1)', padding: '2px 6px', borderRadius: '4px' }}>
                                {g.loyaltyPoints} pts
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      {crmSearchQuery && crmSearchResults.length === 0 && !isCrmSearching && (
                        <div style={{
                          position: 'absolute', top: '60px', left: 0, right: 0,
                          background: 'white', border: '1px solid var(--border)',
                          borderRadius: '8px', zIndex: 100, padding: '10px',
                          fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center'
                        }}>
                          No registered customer found.
                        </div>
                      )}
                    </div>
                  )}

                  <div>
                    <label className="form-label" style={{ fontSize: '0.75rem', marginBottom: '4px', display: 'block' }}>Guest Name *</label>
                    <input name="guestName" value={posGuestName} onChange={(e) => setPosGuestName(e.target.value)} className="input" placeholder="Enter guest name" required style={{ height: '36px', fontSize: '0.85rem' }} />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div>
                      <label className="form-label" style={{ fontSize: '0.75rem', marginBottom: '4px', display: 'block' }}>Phone Number *</label>
                      <input name="guestPhone" value={posGuestPhone} onChange={(e) => setPosGuestPhone(e.target.value)} className="input" placeholder="Phone" required style={{ height: '36px', fontSize: '0.85rem' }} />
                    </div>
                    <div>
                      <label className="form-label" style={{ fontSize: '0.75rem', marginBottom: '4px', display: 'block' }}>Email Address *</label>
                      <input name="guestEmail" type="email" value={posGuestEmail} onChange={(e) => setPosGuestEmail(e.target.value)} className="input" placeholder="Email" required style={{ height: '36px', fontSize: '0.85rem' }} />
                    </div>
                  </div>

                  <div>
                    <label className="form-label" style={{ fontSize: '0.75rem', marginBottom: '4px', display: 'block' }}>Preferred Date & Time *</label>
                    <input name="bookingTime" type="datetime-local" className="input" required style={{ height: '36px', fontSize: '0.85rem' }} />
                  </div>

                  <div>
                    <label className="form-label" style={{ fontSize: '0.75rem', marginBottom: '4px', display: 'block' }}>Special Requests / Notes</label>
                    <textarea name="notes" className="input" placeholder="Additional treatment preferences..." rows={2} style={{ fontSize: '0.85rem' }}></textarea>
                  </div>

                  {/* Option to automatically create customer profile */}
                  {user?.organization?.enabledModules?.includes('CRM') && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px', borderRadius: '8px', background: 'rgba(244, 63, 94, 0.05)', border: '1px dashed rgba(244, 63, 94, 0.25)', marginTop: '4px' }}>
                      <input 
                        type="checkbox" 
                        id="registerCustomerProfile" 
                        name="registerCustomerProfile" 
                        defaultChecked={true} 
                        style={{ width: '16px', height: '16px', accentColor: '#e11d48', cursor: 'pointer' }}
                      />
                      <label htmlFor="registerCustomerProfile" style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-main)', cursor: 'pointer', margin: 0 }}>
                        ➕ Register as KSW Guest CRM Profile
                      </label>
                    </div>
                  )}
                </div>

                {/* Submit Checkout button */}
                <button 
                  type="submit" 
                  className="btn btn-primary" 
                  disabled={submitting || selectedServices.length === 0} 
                  style={{ width: '100%', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '0.9rem', fontWeight: 800, marginTop: 'auto' }}
                >
                  {submitting ? <Loader2 className="spin" size={18} /> : <CalendarCheck size={18} />}
                  Confirm Appointment Reservation
                </button>
              </form>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
