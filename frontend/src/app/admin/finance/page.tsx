'use client';

import React from 'react';
import { Wallet, Plus } from 'lucide-react';

export default function FinancePage() {
  return (
    <div className="card glass" style={{ padding: 'var(--space-6)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 'var(--space-2)' }}>Finance</h1>
          <p style={{ color: 'var(--text-muted)' }}>Monitor invoices, expenses, and overall revenue.</p>
        </div>
        <button className="btn btn-primary" style={{ gap: 'var(--space-2)' }}>
          <Plus size={18} />
          Create Invoice
        </button>
      </div>

      <div style={{ textAlign: 'center', padding: 'var(--space-10)', color: 'var(--text-muted)' }}>
        <Wallet size={48} style={{ margin: '0 auto var(--space-4)', opacity: 0.5 }} />
        <h2>No Financial Data</h2>
        <p>Invoices and expenses will appear here once recorded.</p>
      </div>
    </div>
  );
}
