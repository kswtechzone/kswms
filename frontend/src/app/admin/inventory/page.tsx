'use client';

import React from 'react';
import { Package, Plus } from 'lucide-react';

export default function InventoryPage() {
  return (
    <div className="card glass" style={{ padding: 'var(--space-6)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 'var(--space-2)' }}>Inventory Management</h1>
          <p style={{ color: 'var(--text-muted)' }}>Track stock levels, transactions, and suppliers.</p>
        </div>
        <button className="btn btn-primary" style={{ gap: 'var(--space-2)' }}>
          <Plus size={18} />
          Add Item
        </button>
      </div>

      <div style={{ textAlign: 'center', padding: 'var(--space-10)', color: 'var(--text-muted)' }}>
        <Package size={48} style={{ margin: '0 auto var(--space-4)', opacity: 0.5 }} />
        <h2>Inventory Empty</h2>
        <p>Your warehouse currently has no items configured.</p>
      </div>
    </div>
  );
}
