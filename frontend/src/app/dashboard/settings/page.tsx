'use client';

import { API_BASE_URL } from '@/lib/api';

import React, { useEffect, useState } from 'react';
import { Settings, Globe, CircleDollarSign, Building2, Save, Loader2 } from 'lucide-react';
import { useToast } from '@/components/Toast';

const COUNTRIES = [
  { code: 'Nepal', name: 'Nepal 🇳🇵' },
  { code: 'India', name: 'India 🇮🇳' },
  { code: 'United States', name: 'United States 🇺🇸' },
  { code: 'United Kingdom', name: 'United Kingdom 🇬🇧' },
  { code: 'Germany', name: 'Germany 🇩🇪' },
];

const CURRENCIES = [
  { code: 'NPR', name: 'Nepalese Rupee (NPR - ₨)' },
  { code: 'INR', name: 'Indian Rupee (INR - ₹)' },
  { code: 'USD', name: 'US Dollar (USD - $)' },
  { code: 'GBP', name: 'British Pound (GBP - £)' },
  { code: 'EUR', name: 'Euro (EUR - €)' },
];

export default function OrgSettingsPage() {
  const { showToast } = useToast();
  const [orgId, setOrgId] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [country, setCountry] = useState<string>('Nepal');
  const [currency, setCurrency] = useState<string>('NPR');
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      const targetOrgId = parsed.organization?.id;
      if (targetOrgId) {
        setOrgId(targetOrgId);
        fetchOrgDetails(targetOrgId);
      } else {
        setLoading(false);
        showToast('No active organization detected for this user session.', 'error');
      }
    } else {
      setLoading(false);
      showToast('User session not found.', 'error');
    }
  }, []);

  const fetchOrgDetails = async (id: string) => {
    try {
      const token = localStorage.getItem('access_token');
      const res = await fetch(`${API_BASE_URL}/organizations/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error('Failed to retrieve organization settings.');
      const data = await res.json();
      
      setName(data.name || '');
      setCountry(data.country || 'Nepal');
      setCurrency(data.currency || 'NPR');
    } catch (err: any) {
      showToast(err.message || 'Error fetching organization info.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Organization name cannot be empty.', 'error');
      return;
    }

    setSaving(true);
    try {
      const token = localStorage.getItem('access_token');
      const res = await fetch(`${API_BASE_URL}/organizations/${orgId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, country, currency }),
      });

      if (!res.ok) throw new Error('Failed to update organization profile.');
      const updatedOrg = await res.json();

      // Sync updated org parameters back to active localStorage session
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        parsed.organization = {
          ...parsed.organization,
          name: updatedOrg.name,
          country: updatedOrg.country,
          currency: updatedOrg.currency,
        };
        localStorage.setItem('user', JSON.stringify(parsed));
      }

      showToast('Settings saved successfully! Refreshing details...', 'success');
      
      // Dispatch custom profile sync event
      window.dispatchEvent(new Event('storage'));
    } catch (err: any) {
      showToast(err.message || 'Error saving settings.', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <Loader2 className="spinner" size={40} color="var(--primary)" />
      </div>
    );
  }

  return (
    <div className="card glass animate-fade-in" style={{ padding: 'var(--space-8)', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-8)' }}>
        <Settings size={32} color="var(--primary)" />
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, margin: 0, letterSpacing: '-0.025em' }}>Organization Settings</h1>
          <p style={{ color: 'var(--text-muted)', margin: 0 }}>Configure operating country, currency formats, and global parameters.</p>
        </div>
      </div>

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
        
        {/* Org Name */}
        <div className="form-group">
          <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontWeight: 600, marginBottom: 'var(--space-2)' }}>
            <Building2 size={18} color="var(--text-muted)" />
            Organization Name
          </label>
          <input
            type="text"
            className="input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., KSW Salons"
            style={{ width: '100%', background: 'white' }}
            required
          />
        </div>

        {/* Operating Country & Base Currency */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6)' }}>
          
          {/* Country */}
          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontWeight: 600, marginBottom: 'var(--space-2)' }}>
              <Globe size={18} color="var(--text-muted)" />
              Country
            </label>
            <select
              className="input select"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              style={{ width: '100%', background: 'white', paddingRight: 'var(--space-8)' }}
            >
              {COUNTRIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Currency */}
          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontWeight: 600, marginBottom: 'var(--space-2)' }}>
              <CircleDollarSign size={18} color="var(--text-muted)" />
              Base Currency
            </label>
            <select
              className="input select"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              style={{ width: '100%', background: 'white', paddingRight: 'var(--space-8)' }}
            >
              {CURRENCIES.map((cur) => (
                <option key={cur.code} value={cur.code}>
                  {cur.name}
                </option>
              ))}
            </select>
          </div>

        </div>

        {/* Save CTA */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--space-4)' }}>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={saving}
            style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', minWidth: '140px', justifyContent: 'center' }}
          >
            {saving ? (
              <>
                <Loader2 className="spinner" size={18} />
                Saving...
              </>
            ) : (
              <>
                <Save size={18} />
                Save Changes
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}
