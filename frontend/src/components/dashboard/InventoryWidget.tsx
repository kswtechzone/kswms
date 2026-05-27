import React from 'react';
import { Package } from 'lucide-react';
import Link from 'next/link';

export default function InventoryWidget() {
  return (
    <div className="card glass" style={{ borderTop: '4px solid #10b981', transition: 'all 0.2s', padding: 'var(--space-5)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
        <Package size={24} color="#10b981" />
        <h3 style={{ margin: 0, fontSize: '1rem' }}>Inventory</h3>
      </div>
      <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: 'var(--space-4)', minHeight: '40px' }}>
        Track stock levels and purchase orders across your properties.
      </p>
      <Link href="/dashboard/inventory" className="btn" style={{ width: '100%', border: '1px solid var(--border)', textDecoration: 'none', textAlign: 'center' }}>
        Manage Stock
      </Link>
    </div>
  );
}
