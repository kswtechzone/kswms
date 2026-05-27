import React from 'react';
import { Scissors } from 'lucide-react';
import Link from 'next/link';

export default function ParlorWidget() {
  return (
    <div className="card glass" style={{ borderTop: '4px solid #8b5cf6', transition: 'all 0.2s', padding: 'var(--space-6)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
        <Scissors size={24} color="#8b5cf6" />
        <h3 style={{ margin: 0, fontSize: '1rem' }}>Parlor Management</h3>
      </div>
      <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: 'var(--space-4)', minHeight: '40px' }}>
        Manage salon services, stylists, and multi-service appointments.
      </p>
      <Link href="/dashboard/parlor" className="btn" style={{ width: '100%', border: '1px solid var(--border)', textDecoration: 'none', textAlign: 'center' }}>
        Manage Parlor
      </Link>
    </div>
  );
}
