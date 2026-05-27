'use client';

import { API_BASE_URL } from '@/lib/api';
import React, { useEffect, useState } from 'react';
import { Wallet, Plus, X, Loader2, TrendingUp, TrendingDown, Receipt, DollarSign, Calendar } from 'lucide-react';

export default function OrgFinancePage() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'income' | 'expenses'>('income');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState<any>(null);

  const fetchFinanceData = async (orgId: string) => {
    try {
      const [invRes, expRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/v1/finance/invoices`, {
          headers: { 
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
            'x-tenant-id': orgId
          }
        }),
        fetch(`${API_BASE_URL}/api/v1/finance/expenses`, {
          headers: { 
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
            'x-tenant-id': orgId
          }
        })
      ]);

      if (invRes.ok) setInvoices(await invRes.json());
      if (expRes.ok) setExpenses(await expRes.json());
    } catch (err) {
      console.error('Finance Fetch Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const parsedUser = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(parsedUser);
    if (parsedUser.organization?.id) {
      fetchFinanceData(parsedUser.organization.id);
    }
  }, []);

  const handleAddTransaction = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    
    const formData = new FormData(e.currentTarget);
    const endpoint = activeTab === 'income' ? '/api/v1/finance/invoices' : '/api/v1/finance/expenses';
    const payload = activeTab === 'income' ? {
      amount: Number(formData.get('amount')),
      tax: Number(formData.get('tax')) || 0,
      status: 'PAID',
    } : {
      category: formData.get('category'),
      amount: Number(formData.get('amount')),
      description: formData.get('description'),
      date: formData.get('date'),
    };

    try {
      const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'x-tenant-id': user.organization.id
        },
        body: JSON.stringify(payload)
      });
      
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to record transaction');
      }

      setShowModal(false);
      fetchFinanceData(user.organization.id);
      alert('Transaction recorded successfully!');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const totalIncome = invoices.reduce((sum, inv) => sum + inv.amount, 0);
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const netBalance = totalIncome - totalExpenses;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-8)' }}>
        <div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Wallet size={32} color="#ec4899" />
            Financial Ledger
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>Track revenue, invoicing, and business expenses.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn btn-primary" style={{ gap: 'var(--space-2)' }}>
          <Plus size={18} /> Record {activeTab === 'income' ? 'Income' : 'Expense'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-6)', marginBottom: 'var(--space-8)' }}>
        <div className="card stat-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981', marginBottom: 'var(--space-2)' }}>
            <TrendingUp size={20} />
            <span className="stat-label">Total Revenue</span>
          </div>
          <div className="stat-value">${totalIncome.toLocaleString()}</div>
        </div>
        <div className="card stat-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ef4444', marginBottom: 'var(--space-2)' }}>
            <TrendingDown size={20} />
            <span className="stat-label">Total Expenses</span>
          </div>
          <div className="stat-value">${totalExpenses.toLocaleString()}</div>
        </div>
        <div className="card stat-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', marginBottom: 'var(--space-2)' }}>
            <DollarSign size={20} />
            <span className="stat-label">Net Balance</span>
          </div>
          <div className="stat-value" style={{ color: netBalance >= 0 ? '#10b981' : '#ef4444' }}>
            ${netBalance.toLocaleString()}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 'var(--space-4)', marginBottom: 'var(--space-6)', borderBottom: '1px solid var(--border)', paddingBottom: 'var(--space-2)' }}>
        <button onClick={() => setActiveTab('income')} style={{ 
          background: 'none', border: 'none', padding: '8px 16px', cursor: 'pointer', fontWeight: 700,
          color: activeTab === 'income' ? 'var(--primary)' : 'var(--text-muted)',
          borderBottom: activeTab === 'income' ? '2px solid var(--primary)' : 'none'
        }}>Revenue & Invoices</button>
        <button onClick={() => setActiveTab('expenses')} style={{ 
          background: 'none', border: 'none', padding: '8px 16px', cursor: 'pointer', fontWeight: 700,
          color: activeTab === 'expenses' ? 'var(--primary)' : 'var(--text-muted)',
          borderBottom: activeTab === 'expenses' ? '2px solid var(--primary)' : 'none'
        }}>Expense Logs</button>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--space-10)' }}>
          <Loader2 className="spin" size={32} color="var(--text-muted)" />
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-main)' }}>
                <th style={{ padding: 'var(--space-4)', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Description / Category</th>
                <th style={{ padding: 'var(--space-4)', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Date</th>
                <th style={{ padding: 'var(--space-4)', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Amount</th>
                <th style={{ padding: 'var(--space-4)', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {activeTab === 'income' ? (
                invoices.length === 0 ? (
                  <tr><td colSpan={4} style={{ textAlign: 'center', padding: 'var(--space-10)', color: 'var(--text-muted)' }}>No revenue records found.</td></tr>
                ) : invoices.map((inv: any) => (
                  <tr key={inv.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: 'var(--space-4)' }}>
                      <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Receipt size={14} color="#10b981" /> Invoice #{inv.id.slice(0,8)}
                      </div>
                    </td>
                    <td style={{ padding: 'var(--space-4)', color: 'var(--text-muted)' }}>
                      {new Date(inv.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{ padding: 'var(--space-4)', fontWeight: 700, color: '#10b981' }}>
                      +${inv.amount.toLocaleString()}
                    </td>
                    <td style={{ padding: 'var(--space-4)' }}>
                      <span style={{ padding: '2px 8px', borderRadius: '12px', background: '#dcfce7', color: '#10b981', fontSize: '0.75rem', fontWeight: 700 }}>
                        {inv.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                expenses.length === 0 ? (
                  <tr><td colSpan={4} style={{ textAlign: 'center', padding: 'var(--space-10)', color: 'var(--text-muted)' }}>No expense records found.</td></tr>
                ) : expenses.map((exp: any) => (
                  <tr key={exp.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: 'var(--space-4)' }}>
                      <div style={{ fontWeight: 600 }}>{exp.category}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{exp.description}</div>
                    </td>
                    <td style={{ padding: 'var(--space-4)', color: 'var(--text-muted)' }}>
                      {new Date(exp.date).toLocaleDateString()}
                    </td>
                    <td style={{ padding: 'var(--space-4)', fontWeight: 700, color: '#ef4444' }}>
                      -${exp.amount.toLocaleString()}
                    </td>
                    <td style={{ padding: 'var(--space-4)' }}>
                      <span style={{ padding: '2px 8px', borderRadius: '12px', background: '#f1f5f9', color: '#64748b', fontSize: '0.75rem', fontWeight: 700 }}>
                        LOGGED
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* --- ADD TRANSACTION MODAL --- */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="card" style={{ width: '100%', maxWidth: '400px', padding: 'var(--space-6)', position: 'relative' }}>
            <button onClick={() => setShowModal(false)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', cursor: 'pointer' }}>
              <X size={20} color="var(--text-muted)" />
            </button>
            <h2 style={{ fontSize: '1.25rem', marginBottom: 'var(--space-4)' }}>Record {activeTab === 'income' ? 'Revenue' : 'Expense'}</h2>
            {error && <div style={{ padding: '10px', background: '#fee2e2', color: '#ef4444', borderRadius: '4px', marginBottom: '16px', fontSize: '14px' }}>{error}</div>}
            
            <form onSubmit={handleAddTransaction} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {activeTab === 'income' ? (
                <>
                  <div>
                    <label className="form-label">Amount ($)</label>
                    <input name="amount" type="number" step="0.01" className="input" placeholder="0.00" required />
                  </div>
                  <div>
                    <label className="form-label">Tax / VAT ($)</label>
                    <input name="tax" type="number" step="0.01" className="input" placeholder="0.00" defaultValue={0} />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="form-label">Category</label>
                    <select name="category" className="input" required>
                      <option value="Supplies">Supplies</option>
                      <option value="Maintenance">Maintenance</option>
                      <option value="Utility">Utility Bills</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Amount ($)</label>
                    <input name="amount" type="number" step="0.01" className="input" placeholder="0.00" required />
                  </div>
                  <div>
                    <label className="form-label">Description</label>
                    <input name="description" type="text" className="input" placeholder="e.g. Electricity bill for May" />
                  </div>
                  <div>
                    <label className="form-label">Date</label>
                    <input name="date" type="date" className="input" required defaultValue={new Date().toISOString().split('T')[0]} />
                  </div>
                </>
              )}
              <button type="submit" className="btn btn-primary" disabled={submitting} style={{ marginTop: 'var(--space-4)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                {submitting ? <Loader2 size={18} className="spin" /> : null}
                {submitting ? 'Processing...' : `Save ${activeTab === 'income' ? 'Revenue' : 'Expense'}`}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
