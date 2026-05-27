'use client';

import React from 'react';
import { 
  Hotel, 
  Plus, 
  ExternalLink, 
  Settings,
  MapPin,
  Globe
} from 'lucide-react';

export default function BrandManagement() {
  const brands = [
    { id: 1, name: 'Grand Vista Resort', location: 'Aspen, CO', domain: 'grandvista.com', units: 120, status: 'Active' },
    { id: 2, name: 'Royal Inn Suites', location: 'London, UK', domain: 'royalinn.co.uk', units: 85, status: 'Maintenance' },
    { id: 3, name: 'Oceania Boutique', location: 'Santorini, Greece', domain: 'oceania-santorini.com', units: 45, status: 'Active' },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-8)' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 700, color: 'var(--secondary)' }}>Corporate Brands</h1>
          <p style={{ color: 'var(--text-muted)' }}>Manage properties and digital assets.</p>
        </div>
        <button className="btn btn-primary" style={{ gap: 'var(--space-2)' }}>
          <Plus size={18} /> New Brand
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: 'var(--space-6)' }}>
        {brands.map((brand) => (
          <div key={brand.id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ height: '140px', background: 'var(--bg-admin)', position: 'relative' }}>
              <div style={{ position: 'absolute', bottom: '-20px', left: '24px', width: '60px', height: '60px', background: 'white', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-md)' }}>
                <Hotel size={30} color="var(--primary)" />
              </div>
              <div style={{ position: 'absolute', top: '16px', right: '16px' }}>
                <span style={{ 
                  padding: '4px 12px', 
                  borderRadius: '20px', 
                  fontSize: '0.75rem', 
                  fontWeight: 700,
                  background: brand.status === 'Active' ? '#dcfce7' : '#fee2e2',
                  color: brand.status === 'Active' ? '#166534' : '#991b1b'
                }}>
                  {brand.status}
                </span>
              </div>
            </div>
            
            <div style={{ padding: 'var(--space-8) var(--space-6) var(--space-6)' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 'var(--space-1)' }}>{brand.name}</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginTop: 'var(--space-4)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                  <MapPin size={16} /> {brand.location}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', color: 'var(--primary)', fontSize: '0.875rem', fontWeight: 500 }}>
                  <Globe size={16} /> {brand.domain}
                </div>
              </div>

              <div style={{ marginTop: 'var(--space-6)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)', paddingTop: 'var(--space-5)', borderTop: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Units</span>
                  <span style={{ fontSize: '1.125rem', fontWeight: 700 }}>{brand.units}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-2)', alignItems: 'center' }}>
                  <button className="btn" style={{ padding: 'var(--space-2)', background: 'var(--bg-main)', border: '1px solid var(--border)' }}>
                    <Settings size={18} />
                  </button>
                  <button className="btn" style={{ padding: 'var(--space-2)', background: 'var(--bg-main)', border: '1px solid var(--border)' }}>
                    <ExternalLink size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
