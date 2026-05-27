import React from 'react';
import { UtensilsCrossed } from 'lucide-react';
import Link from 'next/link';

export default function PosWidget() {
  return (
    <div className="card glass" style={{ borderTop: '4px solid #ef4444', transition: 'all 0.2s', padding: 'var(--space-6)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
        <UtensilsCrossed size={24} color="#ef4444" />
        <h3 style={{ margin: 0, fontSize: '1rem' }}>Restaurant POS</h3>
      </div>
      <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: 'var(--space-4)', minHeight: '40px' }}>
        Handle table orders, menus, and real-time kitchen ticketing.
      </p>
      <Link href="/dashboard/pos" className="btn" style={{ width: '100%', border: '1px solid var(--border)', textDecoration: 'none', textAlign: 'center' }}>
        Open POS
      </Link>
    </div>
  );
}
