import React from 'react';
import { Globe } from 'lucide-react';
import Link from 'next/link';

export default function WebsiteWidget() {
  return (
    <div className="card glass" style={{ borderTop: '4px solid #3b82f6', transition: 'all 0.2s', padding: 'var(--space-6)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
        <Globe size={24} color="#3b82f6" />
        <h3 style={{ margin: 0, fontSize: '1rem' }}>Website Builder</h3>
      </div>
      <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: 'var(--space-4)', minHeight: '40px' }}>
        Edit your public brand presence and booking engine frontend.
      </p>
      <Link href="/dashboard/website" className="btn" style={{ width: '100%', border: '1px solid var(--border)', textDecoration: 'none', textAlign: 'center' }}>
        Edit Website
      </Link>
    </div>
  );
}
