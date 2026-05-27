'use client';
import React from 'react';
import { Wallet, Search, CreditCard, Receipt, FileText } from 'lucide-react';

export default function GeneralPOSPage() {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-8)' }}>
        <div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Wallet size={32} color="var(--primary)" />
            Billing & POS
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>Centralized point of sale for hotel checkouts, room charges, and general transactions.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--space-6)', marginBottom: 'var(--space-8)' }}>
        <div className="card stat-card">
          <div style={{ padding: 'var(--space-2)', borderRadius: 'var(--radius-md)', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', width: 'fit-content', marginBottom: 'var(--space-4)' }}>
            <Receipt size={24} />
          </div>
          <span className="stat-label">Pending Invoices</span>
          <div className="stat-value">12</div>
        </div>

        <div className="card stat-card">
          <div style={{ padding: 'var(--space-2)', borderRadius: 'var(--radius-md)', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', width: 'fit-content', marginBottom: 'var(--space-4)' }}>
            <CreditCard size={24} />
          </div>
          <span className="stat-label">Today's Revenue</span>
          <div className="stat-value">$1,450.00</div>
        </div>
      </div>

      <div className="card glass" style={{ padding: 'var(--space-8)', textAlign: 'center', color: 'var(--text-muted)' }}>
        <FileText size={48} style={{ margin: '0 auto var(--space-4)', opacity: 0.3 }} />
        <h2>Billing System</h2>
        <p>Guest folios and checkout management will appear here. F&B orders can be billed to rooms from the Restaurant module.</p>
        <button className="btn btn-primary" style={{ marginTop: 'var(--space-6)' }}>
          Create Manual Invoice
        </button>
      </div>
    </div>
  );
}
