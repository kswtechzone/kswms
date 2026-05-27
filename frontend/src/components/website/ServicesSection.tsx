import React, { useState } from 'react';
import { Scissors, Clock, Sparkles, Calendar, User, Mail, Phone, MessageSquare, CheckCircle, X } from 'lucide-react';
import { API_BASE_URL } from '@/lib/api';

interface ServicesSectionProps {
  content: any;
  config: any;
  previewMode: 'desktop' | 'tablet' | 'mobile';
  parlorServicesData: any[];
  tenantSlug?: string;
}

export default function ServicesSection({ content, config, previewMode, parlorServicesData, tenantSlug }: ServicesSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([]);
  
  // Appointment Booking States
  const [activeBookingService, setActiveBookingService] = useState<any | null>(null);
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'PAY_ON_VISIT' | 'PAY_NOW'>('PAY_ON_VISIT');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const align = content?.textAlign || 'center';
  const pad = content?.padding === 'small' ? '40px 32px' : content?.padding === 'large' ? '120px 32px' : '80px 32px';
  const cols = content?.columns ? Number(content.columns) : 3;

  // Extract unique categories from parlor services dynamically
  const categories = ['All', ...Array.from(new Set(parlorServicesData.map(s => s.category?.name).filter(Boolean)))];

  // Filter services based on active pill
  const filteredServices = selectedCategory === 'All' 
    ? parlorServicesData 
    : parlorServicesData.filter(s => s.category?.name === selectedCategory);

  const getFallbackImage = (categoryName: string = '') => {
    const cat = categoryName.toLowerCase();
    if (cat.includes('nail')) {
      return 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=600&q=80';
    }
    if (cat.includes('massage') || cat.includes('spa') || cat.includes('body')) {
      return 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=600&q=80';
    }
    if (cat.includes('hair') || cat.includes('cut') || cat.includes('barber') || cat.includes('styling')) {
      return 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=600&q=80';
    }
    if (cat.includes('facial') || cat.includes('skincare') || cat.includes('skin') || cat.includes('makeup')) {
      return 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=600&q=80';
    }
    return 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?auto=format&fit=crop&w=600&q=80';
  };

  const toggleServiceSelection = (id: string) => {
    setSelectedServiceIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const openBookingModal = () => {
    setActiveBookingService(true);
    setGuestName('');
    setGuestEmail('');
    setGuestPhone('');
    setBookingTime('');
    setNotes('');
    setPaymentMethod('PAY_ON_VISIT');
    setIsSubmitting(false);
    setBookingSuccess(false);
    setErrorMsg('');
  };

  const handleCloseSuccessWindow = () => {
    setActiveBookingService(null);
    setSelectedServiceIds([]);
  };

  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName || !guestEmail || !guestPhone || !bookingTime) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }
    setIsSubmitting(true);
    setErrorMsg('');
    
    const slug = tenantSlug || 'kswms'; // Fallback slug
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/public/${slug}/parlor/book`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          guestName,
          guestPhone,
          guestEmail,
          bookingTime: new Date(bookingTime).toISOString(),
          notes,
          serviceIds: selectedServiceIds,
          paymentMethod
        })
      });
      
      if (res.ok) {
        setBookingSuccess(true);
      } else {
        const err = await res.json();
        throw new Error(err.message || 'Failed to submit appointment reservation.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Connection issue. Please verify and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ padding: pad, background: '#f8fafc', textAlign: align as any }}>
      <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '12px' }}>
        {content?.title || 'Our Services'}
      </h2>
      <p style={{ color: '#64748b', fontSize: '1.1rem', marginBottom: '32px', maxWidth: '800px', margin: align === 'center' ? '0 auto 32px' : '0 0 32px 0' }}>
        {content?.subtitle || 'Explore our professionally curated wellness and beauty treatments.'}
      </p>
      
      {parlorServicesData.length === 0 ? (
        <div style={{ padding: '40px', border: '2px dashed #cbd5e1', borderRadius: '16px', color: '#64748b' }}>
          <Scissors size={32} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
          <p>No services configured yet. Add treatments inside the Parlor dashboard module.</p>
        </div>
      ) : (
        <>
          {/* Unified Filters & Booking Corner Bar */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '40px',
            flexWrap: 'wrap',
            gap: '20px',
            maxWidth: '1200px',
            margin: '0 auto 40px'
          }}>
            {/* Category Filter Pills */}
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {categories.map((cat: any) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    padding: '10px 22px',
                    borderRadius: '50px',
                    border: 'none',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    background: selectedCategory === cat ? (config?.primaryColor || '#A67653') : '#e2e8f0',
                    color: selectedCategory === cat ? 'white' : '#475569',
                    boxShadow: selectedCategory === cat ? '0 4px 10px rgba(0,0,0,0.15)' : 'none',
                    transition: 'all 0.2s'
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Corner Sticky Booking Button */}
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {selectedServiceIds.length > 0 ? (
                <button
                  onClick={() => openBookingModal()}
                  style={{
                    padding: '12px 28px',
                    borderRadius: '50px',
                    border: 'none',
                    background: config?.primaryColor || '#A67653',
                    color: 'white',
                    fontWeight: 800,
                    fontSize: '0.95rem',
                    cursor: 'pointer',
                    boxShadow: `0 10px 20px ${config?.primaryColor ? `${config.primaryColor}30` : 'rgba(166, 118, 83, 0.3)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.filter = 'brightness(1.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'none';
                    e.currentTarget.style.filter = 'none';
                  }}
                >
                  <Calendar size={18} /> Book Selected ({selectedServiceIds.length} Treatments)
                </button>
              ) : (
                <div style={{ 
                  fontSize: '0.85rem', color: '#64748b', fontWeight: 700, 
                  padding: '10px 20px', background: '#f1f5f9', borderRadius: '30px',
                  border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '6px'
                }}>
                  <Sparkles size={14} color={config?.primaryColor || '#A67653'} />
                  Select treatments below to book
                </div>
              )}
            </div>
          </div>

          {/* Filtered Services Grid */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: previewMode === 'mobile' 
              ? '1fr' 
              : previewMode === 'tablet'
                ? '1fr 1fr'
                : `repeat(${cols}, 1fr)`, 
            gap: '32px', 
            maxWidth: '1200px', 
            margin: '0 auto', 
            textAlign: 'left' 
          }}>
            {filteredServices.map((service: any) => {
              const coverImg = service.image || getFallbackImage(service.category?.name);
              const isSelected = selectedServiceIds.includes(service.id);
              return (
                <div 
                  key={service.id} 
                  onClick={() => toggleServiceSelection(service.id)}
                  style={{ 
                    background: 'white', 
                    borderRadius: '16px', 
                    cursor: 'pointer',
                    display: 'flex', 
                    flexDirection: 'column',
                    overflow: 'hidden',
                    border: `2px solid ${isSelected ? (config?.primaryColor || '#A67653') : '#f1f5f9'}`,
                    boxShadow: isSelected 
                      ? `0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 0 0 1px ${config?.primaryColor || '#A67653'}` 
                      : '0 10px 15px -3px rgba(0,0,0,0.05), 0 4px 6px -2px rgba(0,0,0,0.05)',
                    transform: isSelected ? 'scale(1.02)' : 'none',
                    transition: 'all 0.2s ease-in-out',
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0,0,0,0.08)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.transform = 'none';
                      e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0,0,0,0.05)';
                    }
                  }}
                >
                  {/* Card Cover Image */}
                  <div style={{ position: 'relative', height: '180px', width: '100%', overflow: 'hidden' }}>
                    <img 
                      src={coverImg} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                      alt={service.name}
                    />
                    {/* Selected Overlay Indicator */}
                    {isSelected && (
                      <div style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'rgba(15, 23, 42, 0.35)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 10
                      }}>
                        <div style={{
                          width: '44px',
                          height: '44px',
                          borderRadius: '50%',
                          background: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: config?.primaryColor || '#A67653',
                          boxShadow: '0 8px 16px rgba(0,0,0,0.2)'
                        }}>
                          <CheckCircle size={28} />
                        </div>
                      </div>
                    )}
                    {/* Category Overlay Pill */}
                    <div style={{ 
                      position: 'absolute', 
                      top: '12px', 
                      left: '12px', 
                      background: 'rgba(255, 255, 255, 0.95)', 
                      backdropFilter: 'blur(4px)',
                      padding: '4px 12px', 
                      borderRadius: '50px',
                      fontSize: '0.75rem', 
                      fontWeight: 800, 
                      color: config?.primaryColor || '#A67653',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <Sparkles size={12} />
                      {service.category?.name || 'Treatment'}
                    </div>
                  </div>

                  {/* Card Body */}
                  <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px', lineHeight: 1.3 }}>
                      {service.name}
                    </h3>
                    <p style={{ color: '#64748b', fontSize: '0.85rem', lineHeight: 1.5, margin: '0 0 20px 0', flex: 1 }}>
                      {service.description || 'Indulge in a premium session tailored exclusively to revitalize your well-being.'}
                    </p>

                    {/* Price & Duration Row */}
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      borderTop: '1px solid #f1f5f9',
                      paddingTop: '16px',
                      marginTop: 'auto'
                    }}>
                      <div style={{ fontSize: '1.4rem', fontWeight: 800, color: config?.primaryColor || '#A67653' }}>
                        ${service.price}
                      </div>
                      <div style={{ 
                        fontSize: '0.8rem', 
                        fontWeight: 700, 
                        color: '#64748b',
                        background: '#f8fafc',
                        padding: '6px 12px',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        border: '1px solid #e2e8f0'
                      }}>
                        <Clock size={14} color={config?.primaryColor || '#A67653'} />
                        {service.duration} mins
                      </div>
                    </div>

                    {/* Selection State CTA Label */}
                    <div style={{
                      marginTop: '16px',
                      textAlign: 'center',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: isSelected ? (config?.primaryColor || '#A67653') : '#94a3b8',
                      transition: 'all 0.2s'
                    }}>
                      {isSelected ? '✓ Added to selection' : 'Click card to select'}
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Gorgeous Interactive Appointment Booking Modal */}
      {activeBookingService && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(8px)',
          zIndex: 99999,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '24px'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '24px',
            width: '100%',
            maxWidth: '500px',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
            border: '1px solid #e2e8f0',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            textAlign: 'left'
          }}>
            {/* Modal Header */}
            <div style={{
              padding: '20px 24px',
              borderBottom: '1px solid #f1f5f9',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: '#f8fafc'
            }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                {bookingSuccess ? 'Booking Confirmed!' : 'Book Appointment'}
              </h3>
              <button 
                onClick={handleCloseSuccessWindow}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px', borderRadius: '50%', color: '#64748b' }}
              >
                <X size={20} />
              </button>
            </div>

            {bookingSuccess ? (
              /* Success State screen */
              <div style={{ padding: '32px 24px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#16a34a' }}>
                  <CheckCircle size={36} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1e293b', marginBottom: '8px' }}>Thank You, {guestName}!</h4>
                  <p style={{ color: '#64748b', fontSize: '0.9rem', margin: '0 0 16px 0', lineHeight: 1.5 }}>
                    Your reservation has been successfully received and is pending review! We will contact you at <strong>{guestEmail}</strong> or <strong>{guestPhone}</strong> shortly.
                  </p>
                </div>
                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '16px', borderRadius: '12px', width: '100%', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b', fontWeight: 600 }}>Treatments:</span>
                    <span style={{ color: '#0f172a', fontWeight: 700, textAlign: 'right' }}>
                      {parlorServicesData.filter(s => selectedServiceIds.includes(s.id)).map(s => s.name).join(', ')}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b', fontWeight: 600 }}>Scheduled Time:</span>
                    <span style={{ color: '#0f172a', fontWeight: 700 }}>{new Date(bookingTime).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b', fontWeight: 600 }}>Payment Method:</span>
                    <span style={{ color: '#0f172a', fontWeight: 700 }}>{paymentMethod === 'PAY_NOW' ? 'Prepaid (Paid Now)' : 'Pay on Visit'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b', fontWeight: 600 }}>Amount Due:</span>
                    <span style={{ color: config?.primaryColor || '#A67653', fontWeight: 800 }}>
                      ${parlorServicesData.filter(s => selectedServiceIds.includes(s.id)).reduce((s, x) => s + x.price, 0)}
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleCloseSuccessWindow}
                  style={{
                    marginTop: '8px',
                    width: '100%',
                    padding: '12px',
                    borderRadius: '10px',
                    border: 'none',
                    background: config?.primaryColor || '#A67653',
                    color: 'white',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Close Window
                </button>
              </div>
            ) : (
              /* Booking Form screen */
              <form onSubmit={handleConfirmBooking} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Multi Service Summary */}
                <div style={{ 
                  background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', 
                  padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px', 
                  maxHeight: '130px', overflowY: 'auto' 
                }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', borderBottom: '1px solid #e2e8f0', paddingBottom: '6px' }}>
                    Selected Treatments ({parlorServicesData.filter(s => selectedServiceIds.includes(s.id)).length})
                  </div>
                  {parlorServicesData.filter(s => selectedServiceIds.includes(s.id)).map(s => (
                    <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>{s.name}</span>
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: config?.primaryColor || '#A67653' }}>${s.price}</span>
                    </div>
                  ))}
                </div>

                {errorMsg && (
                  <div style={{ background: '#fef2f2', border: '1px solid #fecaca', padding: '12px', borderRadius: '8px', color: '#ef4444', fontSize: '0.85rem', fontWeight: 600 }}>
                    {errorMsg}
                  </div>
                )}

                {/* Form Fields */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>Full Name *</label>
                  <div style={{ position: 'relative' }}>
                    <User size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: '#94a3b8' }} />
                    <input 
                      type="text" 
                      required 
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      placeholder="Your full name"
                      style={{ width: '100%', padding: '10px 12px 10px 38px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', outline: 'none' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>Email Address *</label>
                    <div style={{ position: 'relative' }}>
                      <Mail size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: '#94a3b8' }} />
                      <input 
                        type="email" 
                        required 
                        value={guestEmail}
                        onChange={(e) => setGuestEmail(e.target.value)}
                        placeholder="name@example.com"
                        style={{ width: '100%', padding: '10px 12px 10px 38px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', outline: 'none' }}
                      />
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>Phone Number *</label>
                    <div style={{ position: 'relative' }}>
                      <Phone size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: '#94a3b8' }} />
                      <input 
                        type="tel" 
                        required 
                        value={guestPhone}
                        onChange={(e) => setGuestPhone(e.target.value)}
                        placeholder="(123) 456-7890"
                        style={{ width: '100%', padding: '10px 12px 10px 38px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', outline: 'none' }}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>Appointment Date & Time *</label>
                  <div style={{ position: 'relative' }}>
                    <input 
                      type="datetime-local" 
                      required 
                      value={bookingTime}
                      onChange={(e) => setBookingTime(e.target.value)}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', outline: 'none', color: '#0f172a' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>Special Requests (Optional)</label>
                  <div style={{ position: 'relative' }}>
                    <MessageSquare size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: '#94a3b8' }} />
                    <textarea 
                      rows={2} 
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Any requests or information..."
                      style={{ width: '100%', padding: '10px 12px 10px 38px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', outline: 'none', resize: 'vertical' }}
                    />
                  </div>
                </div>

                {/* Payment Option Selector */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '8px' }}>Payment Method *</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div 
                      onClick={() => setPaymentMethod('PAY_ON_VISIT')}
                      style={{
                        padding: '12px',
                        borderRadius: '12px',
                        border: `2px solid ${paymentMethod === 'PAY_ON_VISIT' ? (config?.primaryColor || '#A67653') : '#e2e8f0'}`,
                        background: paymentMethod === 'PAY_ON_VISIT' ? 'rgba(166, 118, 83, 0.05)' : 'white',
                        cursor: 'pointer',
                        textAlign: 'center',
                        transition: 'all 0.2s'
                      }}
                    >
                      <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', marginBottom: '2px' }}>Pay on Visit</div>
                      <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Pay at counter</div>
                    </div>

                    <div 
                      onClick={() => setPaymentMethod('PAY_NOW')}
                      style={{
                        padding: '12px',
                        borderRadius: '12px',
                        border: `2px solid ${paymentMethod === 'PAY_NOW' ? (config?.primaryColor || '#A67653') : '#e2e8f0'}`,
                        background: paymentMethod === 'PAY_NOW' ? 'rgba(166, 118, 83, 0.05)' : 'white',
                        cursor: 'pointer',
                        textAlign: 'center',
                        transition: 'all 0.2s'
                      }}
                    >
                      <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', marginBottom: '2px' }}>Pay Now</div>
                      <div style={{ fontSize: '0.7rem', color: '#64748b' }}>Prepay securely now</div>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    marginTop: '8px',
                    width: '100%',
                    padding: '12px',
                    borderRadius: '10px',
                    border: 'none',
                    background: config?.primaryColor || '#A67653',
                    color: 'white',
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    transition: 'all 0.2s',
                    opacity: isSubmitting ? 0.7 : 1
                  }}
                >
                  {isSubmitting ? 'Confirming Appointment...' : 'Confirm Appointment'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
