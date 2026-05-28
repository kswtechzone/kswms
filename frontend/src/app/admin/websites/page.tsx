'use client';

import React, { useState } from 'react';
import { Globe, Plus, Edit, Trash2, ExternalLink } from 'lucide-react';

export default function WebsitesPage() {
  const [websites, setWebsites] = useState([
    { id: '1', title: 'KSW Platinum Resort | Official Site', subdomain: 'platinum-resort', status: 'PUBLISHED' },
    { id: '2', title: 'Downtown Boutique | City Center', subdomain: 'downtown', status: 'DRAFT' },
  ]);

  return (
    <div className="card glass" style={{ padding: 'var(--space-6)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 'var(--space-2)' }}>Website Builder</h1>
          <p style={{ color: 'var(--text-muted)' }}>Manage and edit your public-facing booking websites.</p>
        </div>
        <button className="btn btn-primary" style={{ gap: 'var(--space-2)' }}>
          <Plus size={18} />
          Create Website
        </button>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)', textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              <th style={{ padding: 'var(--space-3)' }}>Site Name</th>
              <th style={{ padding: 'var(--space-3)' }}>Domain / Subdomain</th>
              <th style={{ padding: 'var(--space-3)' }}>Status</th>
              <th style={{ padding: 'var(--space-3)', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {websites.map((site) => (
              <tr key={site.id} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.2s' }}>
                <td style={{ padding: 'var(--space-4) var(--space-3)', fontWeight: 500 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                    <Globe size={18} style={{ color: 'var(--primary)' }} />
                    {site.title}
                  </div>
                </td>
                <td style={{ padding: 'var(--space-4) var(--space-3)', color: 'var(--text-muted)' }}>
                  {site.subdomain}.kswms.cloud
                </td>
                <td style={{ padding: 'var(--space-4) var(--space-3)' }}>
                  <span style={{ 
                    padding: '2px 8px', 
                    borderRadius: '12px', 
                    fontSize: '0.75rem', 
                    fontWeight: 600,
                    background: site.status === 'PUBLISHED' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(234, 179, 8, 0.1)',
                    color: site.status === 'PUBLISHED' ? '#22c55e' : '#eab308'
                  }}>
                    {site.status}
                  </span>
                </td>
                <td style={{ padding: 'var(--space-4) var(--space-3)', textAlign: 'right' }}>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-2)' }}>
                    <button className="btn" style={{ padding: 'var(--space-2)', background: 'transparent', color: 'var(--text-muted)' }}>
                      <ExternalLink size={16} />
                    </button>
                    <button className="btn" style={{ padding: 'var(--space-2)', background: 'transparent', color: 'var(--text-muted)' }}>
                      <Edit size={16} />
                    </button>
                    <button className="btn" style={{ padding: 'var(--space-2)', background: 'transparent', color: '#ef4444' }}>
                      <Trash2 size={16} />
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
