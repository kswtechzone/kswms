'use client';

import { API_BASE_URL } from '@/lib/api';

import React, { useState } from 'react';
import { UserPlus, Building2, Mail, Lock, User, Eye, EyeOff, ShieldAlert, BadgeCheck } from 'lucide-react';

export default function RegisterPage() {
  const [profileType, setProfileType] = useState<'ORGANIZATION' | 'USER'>('ORGANIZATION');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    orgName: '',
    orgSlug: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Construct body depending on profile type
    const uniqueSuffix = Date.now().toString().slice(-6);
    const requestBody = {
      profileType,
      name: formData.name,
      email: formData.email,
      password: formData.password,
      orgName: profileType === 'ORGANIZATION' ? formData.orgName : `KSWUSER Organization ${uniqueSuffix}`,
      orgSlug: profileType === 'ORGANIZATION' ? formData.orgSlug : `kswuser-${uniqueSuffix}`
    };

    try {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed');
      
      // Success - redirect to login
      window.location.href = '/login?registered=true';
    } catch (err: any) {
      if (err.message === 'Failed to fetch') {
        setError(`Connection Failed: Ensure the backend API is active and reachable at ${API_BASE_URL}`);
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      background: 'var(--bg-admin)',
      padding: 'var(--space-10)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Decor */}
      <div style={{ 
        position: 'absolute', 
        bottom: '-10%', 
        left: '-10%', 
        width: '500px', 
        height: '500px', 
        background: 'var(--primary)', 
        filter: 'blur(100px)', 
        opacity: 0.1,
        borderRadius: '50%'
      }}></div>

      <div className="card glass" style={{ width: '100%', maxWidth: '540px', padding: 'var(--space-10)', border: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
          <div style={{ 
            display: 'inline-flex', 
            padding: 'var(--space-4)', 
            borderRadius: '50%', 
            background: 'rgba(166, 118, 83, 0.1)', 
            color: 'var(--primary)',
            marginBottom: 'var(--space-4)'
          }}>
            <UserPlus size={32} />
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'white', letterSpacing: '-0.025em' }}>
            Get <span style={{ color: 'var(--primary)' }}>Started</span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem', marginTop: 'var(--space-2)' }}>
            Initialize your profile on KSWMS Management Suite
          </p>
        </div>

        {/* Profile Type Selector Option Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: 'var(--space-8)' }}>
          <div 
            onClick={() => setProfileType('ORGANIZATION')}
            style={{
              padding: '16px',
              borderRadius: 'var(--radius-md)',
              background: profileType === 'ORGANIZATION' ? 'rgba(166, 118, 83, 0.15)' : 'rgba(255,255,255,0.03)',
              border: profileType === 'ORGANIZATION' ? '2px solid var(--primary)' : '2px solid rgba(255,255,255,0.05)',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              gap: '8px',
              transition: 'all 0.2s ease-in-out'
            }}
          >
            <Building2 size={24} color={profileType === 'ORGANIZATION' ? 'var(--primary)' : 'rgba(255,255,255,0.4)'} />
            <div style={{ fontWeight: 700, fontSize: '0.9rem', color: profileType === 'ORGANIZATION' ? 'white' : 'rgba(255,255,255,0.6)' }}>
              Business Profile
            </div>
            <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)' }}>
              Manage hotels, POS, staff, salon, or reservations.
            </div>
          </div>

          <div 
            onClick={() => setProfileType('USER')}
            style={{
              padding: '16px',
              borderRadius: 'var(--radius-md)',
              background: profileType === 'USER' ? 'rgba(166, 118, 83, 0.15)' : 'rgba(255,255,255,0.03)',
              border: profileType === 'USER' ? '2px solid var(--primary)' : '2px solid rgba(255,255,255,0.05)',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              gap: '8px',
              transition: 'all 0.2s ease-in-out'
            }}
          >
            <User size={24} color={profileType === 'USER' ? 'var(--primary)' : 'rgba(255,255,255,0.4)'} />
            <div style={{ fontWeight: 700, fontSize: '0.9rem', color: profileType === 'USER' ? 'white' : 'rgba(255,255,255,0.6)' }}>
              Individual Profile
            </div>
            <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)' }}>
              Personal client profile under default KSWUSER.
            </div>
          </div>
        </div>

        {error && (
          <div style={{ 
            background: 'rgba(239, 68, 68, 0.1)', 
            border: '1px solid rgba(239, 68, 68, 0.2)', 
            color: '#f87171', 
            padding: 'var(--space-3)', 
            borderRadius: 'var(--radius-md)', 
            fontSize: '0.875rem',
            marginBottom: 'var(--space-6)',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
          
          {/* Base User Details */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              <label style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>Your Name</label>
              <input name="name" className="input" placeholder="John Doe" onChange={handleChange} required />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              <label style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>Email</label>
              <input name="email" type="email" className="input" placeholder="john@company.com" onChange={handleChange} required />
            </div>
          </div>

          {/* Render Organization Profile Fields Only for Business registration */}
          {profileType === 'ORGANIZATION' && (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                <label style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>Organization Name</label>
                <input name="orgName" className="input" placeholder="Grand Vista Resorts" onChange={handleChange} required />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                <label style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>Organization Slug (URL)</label>
                <input name="orgSlug" className="input" placeholder="grand-vista" onChange={handleChange} required />
              </div>
            </>
          )}

          {/* Render Hint for Individual Profiles */}
          {profileType === 'USER' && (
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px',
              padding: '16px',
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              borderRadius: 'var(--radius-md)'
            }}>
              <BadgeCheck size={20} color="var(--primary)" style={{ flexShrink: 0 }} />
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Your account will be created under the shared <strong style={{ color: 'white' }}>KSWUSER Organization</strong>. You can sign in and manage your personal preferences right away.
              </div>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            <label style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}>Create Password</label>
            <div style={{ position: 'relative' }}>
              <input 
                name="password" 
                type={showPassword ? 'text' : 'password'} 
                className="input" 
                placeholder="••••••••" 
                onChange={handleChange} 
                required 
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

          <button 
            className="btn btn-primary" 
            type="submit" 
            disabled={loading}
            style={{ width: '100%', height: '48px', marginTop: 'var(--space-2)' }}
          >
            {loading ? 'Creating Account...' : (profileType === 'ORGANIZATION' ? 'Initialize Organization' : 'Create User Profile')}
          </button>
        </form>

        <div style={{ marginTop: 'var(--space-8)', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Already have an account? <a href="/login" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>Sign In</a>
          </p>
        </div>
      </div>
    </div>
  );
}
