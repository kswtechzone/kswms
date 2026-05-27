'use client';
import React from 'react';
import { Wallet, CreditCard, Receipt, FileText } from 'lucide-react';

export default function AdminPOSPage() {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-8)' }}>
        <div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Wallet size={32} color="var(--primary)" />
            Global Billing & POS
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>Super Admin view of global transactions and aggregated hotel billings.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--space-6)', marginBottom: 'var(--space-8)' }}>
        <div className="card stat-card">
          <div style={{ padding: 'var(--space-2)', borderRadius: 'var(--radius-md)', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', width: 'fit-content', marginBottom: 'var(--space-4)' }}>
            <Receipt size={24} />
          </div>
          <span className="stat-label">Global Pending Invoices</span>
          <div className="stat-value">1,240</div>
        </div>

        <div className="card stat-card">
          <div style={{ padding: 'var(--space-2)', borderRadius: 'var(--radius-md)', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', width: 'fit-content', marginBottom: 'var(--space-4)' }}>
            <CreditCard size={24} />
          </div>
          <span className="stat-label">Global Daily Revenue</span>
          <div className="stat-value">$145,200.00</div>
        </div>
      </div>

      <div className="card glass" style={{ padding: 'var(--space-8)', textAlign: 'center', color: 'var(--text-muted)' }}>
        <FileText size={48} style={{ margin: '0 auto var(--space-4)', opacity: 0.3 }} />
        <h2>Global Billing System</h2>
        <p>Monitor transactions across all registered organizations.</p>
      </div>
    </div>
  );
}
