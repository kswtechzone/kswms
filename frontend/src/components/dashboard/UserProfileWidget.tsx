'use client';

import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '@/lib/api';
import { User, Award, Loader2 } from 'lucide-react';

interface LoyaltyItem {
  organizationName: string;
  organizationSlug: string;
  loyaltyPoints: number;
  tags?: string[];
}

interface UserProfileWidgetProps {
  user: {
    name: string;
    email: string;
    createdAt: string;
    organization?: {
      slug: string;
    };
  };
}

export default function UserProfileWidget({ user }: UserProfileWidgetProps) {
  const [loyaltyData, setLoyaltyData] = useState<LoyaltyItem[]>([]);
  const [loadingLoyalty, setLoadingLoyalty] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'loyalty'>('profile');
  const [isMobile, setIsMobile] = useState(false);

  // Responsive Breakpoint Handler
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (user?.email) {
      fetchLoyaltyPoints(user.email);
    }
  }, [user]);

  const fetchLoyaltyPoints = async (email: string) => {
    setLoadingLoyalty(true);
    try {
      const res = await fetch(`${API_BASE_URL}/auth/loyalty?email=${encodeURIComponent(email)}`);
      if (res.ok) {
        const data = await res.json();
        setLoyaltyData(data);
      }
    } catch (e) {
      console.error('Failed to load loyalty points:', e);
    } finally {
      setLoadingLoyalty(false);
    }
  };

  const totalPoints = loyaltyData.reduce((sum, item) => sum + item.loyaltyPoints, 0);

  const getTierBadge = (pts: number) => {
    if (pts >= 1000) return { label: 'Platinum Member', color: '#c084fc', bg: 'rgba(192, 132, 252, 0.1)' };
    if (pts >= 500) return { label: 'Gold Member', color: '#fbbf24', bg: 'rgba(251, 191, 36, 0.1)' };
    if (pts >= 200) return { label: 'Silver Member', color: '#94a3b8', bg: 'rgba(148, 163, 184, 0.1)' };
    return { label: 'Bronze Member', color: '#b45309', bg: 'rgba(180, 83, 9, 0.1)' };
  };

  const currentTier = getTierBadge(totalPoints);

  return (
    <div style={{ padding: isMobile ? 'var(--space-2)' : 'var(--space-6)', maxWidth: '1100px', margin: '0 auto' }}>
      
      {/* Page Title Header */}
      <div style={{ marginBottom: 'var(--space-8)' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'white', marginBottom: '4px' }}>My Account Profile</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>View your personal credentials, subscription status, and loyalty reward benefits.</p>
      </div>

      {/* Side-by-Side Hourly-Place layout */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: isMobile ? '1fr' : '300px 1fr', 
        gap: '32px', 
        alignItems: 'flex-start' 
      }}>
        
        {/* Left Panel: Profile Quick Card */}
        <div className="card glass" style={{ 
          padding: '32px 24px', 
          borderRadius: 'var(--radius-lg)', 
          border: '1px solid rgba(255,255,255,0.06)',
          background: 'rgba(255, 255, 255, 0.01)',
          textAlign: 'center'
        }}>
          {/* Avatar container */}
          <div style={{ position: 'relative', display: 'inline-block', marginBottom: '16px' }}>
            <div style={{
              width: '88px',
              height: '88px',
              borderRadius: '50%',
              background: 'var(--primary)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2.25rem',
              fontWeight: 800,
              border: '4px solid rgba(255, 255, 255, 0.05)',
              boxShadow: '0 10px 20px rgba(0,0,0,0.3)'
            }}>
              {user.name.charAt(0).toUpperCase()}
            </div>
          </div>

          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'white', margin: '0 0 6px 0' }}>{user.name}</h3>
          <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)', margin: '0 0 20px 0' }}>{user.email}</p>

          <span style={{ 
            background: currentTier.bg, 
            color: currentTier.color, 
            padding: '6px 14px', 
            borderRadius: '20px', 
            fontSize: '0.75rem', 
            fontWeight: 700,
            display: 'inline-block',
            border: `1px solid rgba(255,255,255,0.05)`
          }}>
            {currentTier.label}
          </span>

          <hr style={{ border: '0', borderTop: '1px solid rgba(255,255,255,0.05)', margin: '24px 0' }} />

          {/* Loyalty points quick look */}
          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Reward Balance
            </span>
            <div style={{ fontSize: '2rem', fontWeight: 900, color: 'white', marginTop: '4px' }}>
              {totalPoints} <span style={{ fontSize: '0.9rem', color: 'var(--primary)', fontWeight: 700 }}>pts</span>
            </div>
          </div>
        </div>

        {/* Right Panel: Tabbing Workspace */}
        <div className="card glass" style={{ 
          borderRadius: 'var(--radius-lg)', 
          border: '1px solid rgba(255,255,255,0.06)',
          background: 'rgba(255, 255, 255, 0.01)',
          overflow: 'hidden'
        }}>
          {/* Navigation Tabs Header */}
          <div style={{ 
            display: 'flex', 
            background: 'rgba(255,255,255,0.02)', 
            borderBottom: '1px solid rgba(255,255,255,0.05)'
          }}>
            <button 
              onClick={() => setActiveTab('profile')}
              style={{
                flex: 1,
                padding: '16px 24px',
                background: activeTab === 'profile' ? 'rgba(255, 255, 255, 0.03)' : 'transparent',
                color: activeTab === 'profile' ? 'var(--primary)' : 'rgba(255,255,255,0.6)',
                border: '0',
                borderBottom: activeTab === 'profile' ? '2px solid var(--primary)' : '2px solid transparent',
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: '0.875rem',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <User size={16} /> Profile Details
            </button>
            <button 
              onClick={() => setActiveTab('loyalty')}
              style={{
                flex: 1,
                padding: '16px 24px',
                background: activeTab === 'loyalty' ? 'rgba(255, 255, 255, 0.03)' : 'transparent',
                color: activeTab === 'loyalty' ? 'var(--primary)' : 'rgba(255,255,255,0.6)',
                border: '0',
                borderBottom: activeTab === 'loyalty' ? '2px solid var(--primary)' : '2px solid transparent',
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: '0.875rem',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <Award size={16} /> Loyalty Portfolio
            </button>
          </div>

          {/* Tab Workspaces */}
          <div style={{ padding: isMobile ? '16px' : '32px' }}>
            
            {/* Tab 1: Profile Details */}
            {activeTab === 'profile' && (
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'white', marginBottom: '24px' }}>
                  Personal Account Overview
                </h3>
                
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', 
                  gap: '24px' 
                }}>
                  <div>
                    <label style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                      Full Name
                    </label>
                    <input 
                      type="text" 
                      readOnly 
                      value={user.name} 
                      style={{ width: '100%', padding: '12px 16px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 'var(--radius-md)', color: 'white', fontSize: '0.9rem', cursor: 'not-allowed' }} 
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                      Email Address
                    </label>
                    <input 
                      type="text" 
                      readOnly 
                      value={user.email} 
                      style={{ width: '100%', padding: '12px 16px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 'var(--radius-md)', color: 'white', fontSize: '0.9rem', cursor: 'not-allowed' }} 
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                      Account Status
                    </label>
                    <input 
                      type="text" 
                      readOnly 
                      value="Active / Verified" 
                      style={{ width: '100%', padding: '12px 16px', background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.15)', borderRadius: 'var(--radius-md)', color: '#10b981', fontSize: '0.9rem', fontWeight: 600, cursor: 'not-allowed' }} 
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                      Profile Workspace Link
                    </label>
                    <input 
                      type="text" 
                      readOnly 
                      value={user.organization?.slug || 'kswuser'} 
                      style={{ width: '100%', padding: '12px 16px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 'var(--radius-md)', color: 'white', fontSize: '0.9rem', cursor: 'not-allowed' }} 
                    />
                  </div>
                </div>
                
                <div style={{ marginTop: '32px', display: 'flex', gap: '16px' }}>
                  <button 
                    onClick={() => {
                      localStorage.clear();
                      window.location.href = '/login';
                    }}
                    className="btn" 
                    style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#ef4444', padding: '10px 20px', fontSize: '0.85rem' }}
                  >
                    Sign Out Profile
                  </button>
                </div>
              </div>
            )}

            {/* Tab 2: Loyalty Portfolio */}
            {activeTab === 'loyalty' && (
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'white', marginBottom: '24px' }}>
                  Hospitality & Parlor Rewards
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {loadingLoyalty ? (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px 0', gap: '8px', color: 'var(--text-muted)' }}>
                      <Loader2 size={16} className="animate-spin" />
                      <span style={{ fontSize: '0.85rem' }}>Syncing balances...</span>
                    </div>
                  ) : loyaltyData.length > 0 ? (
                    loyaltyData.map((item, index) => (
                      <div 
                        key={index}
                        style={{
                          padding: '16px 20px',
                          borderRadius: 'var(--radius-md)',
                          background: 'rgba(255,255,255,0.01)',
                          border: '1px solid rgba(255,255,255,0.04)',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          flexDirection: isMobile ? 'column' : 'row',
                          gap: isMobile ? '12px' : '0',
                          textAlign: isMobile ? 'center' : 'left'
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: 700, color: 'white', fontSize: '0.95rem' }}>
                            {item.organizationName}
                          </div>
                          <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)' }}>
                            Workspace URL Slug: {item.organizationSlug}
                          </span>
                        </div>

                        <div style={{ fontSize: '1.15rem', fontWeight: 900, color: 'white' }}>
                          {item.loyaltyPoints} <span style={{ fontSize: '0.8rem', color: 'var(--primary)' }}>pts</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={{
                      textAlign: 'center',
                      padding: '40px 16px',
                      border: '1px dashed rgba(255,255,255,0.06)',
                      borderRadius: 'var(--radius-md)',
                      color: 'var(--text-muted)',
                      fontSize: '0.85rem'
                    }}>
                      No active loyalty records found. Use email <strong style={{ color: 'white' }}>{user.email}</strong> when booking at partner hotels or parlors to earn points!
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}
