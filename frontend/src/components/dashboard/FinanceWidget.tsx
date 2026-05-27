import React from 'react';
import { Wallet } from 'lucide-react';
import Link from 'next/link';

export default function FinanceWidget() {
  return (
    <div className="card glass" style={{ borderTop: '4px solid #ec4899', transition: 'all 0.2s', padding: 'var(--space-5)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
        <Wallet size={24} color="#ec4899" />
        <h3 style={{ margin: 0, fontSize: '1rem' }}>Finance</h3>
      </div>
      <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: 'var(--space-4)', minHeight: '40px' }}>
        Invoicing, expense tracking, and revenue reports.
      </p>
      <Link href="/dashboard/finance" className="btn" style={{ width: '100%', border: '1px solid var(--border)', textDecoration: 'none', textAlign: 'center' }}>
        Open Finance
      </Link>
    </div>
  );
}
