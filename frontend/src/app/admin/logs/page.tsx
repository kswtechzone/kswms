'use client';

import { API_BASE_URL } from '@/lib/api';

import React, { useEffect, useState } from 'react';
import { 
  ShieldCheck, 
  History, 
  User, 
  Box, 
  CheckCircle2, 
  AlertCircle,
  ArrowRight
} from 'lucide-react';

export default function AuditLogs() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ALL');

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/organizations/logs`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` }
        });
        if (res.ok) {
          setLogs(await res.json());
        }
      } catch (err) {
        console.error('Failed to fetch logs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter(log => {
    if (activeTab === 'ALL') return true;
    if (activeTab === 'MODULES') return log.action.includes('MODULE');
    if (activeTab === 'ORGANIZATIONS') return log.action.includes('ORG');
    return true;
  });

  return (
    <div>
      <div style={{ marginBottom: 'var(--space-8)' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 700, color: 'var(--secondary)' }}>Super Control: Audit Logs</h1>
        <p style={{ color: 'var(--text-muted)' }}>Monitor administrative actions and system modifications.</p>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: 'var(--space-5)', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <History size={20} color="var(--primary)" />
            <span style={{ fontWeight: 600 }}>Administrative Activity</span>
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
            <button className="btn" style={{ background: 'white', border: '1px solid var(--border)', padding: 'var(--space-2) var(--space-4)', fontSize: '0.875rem' }}>
              Export CSV
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', padding: '0 var(--space-5)', background: '#f8fafc' }}>
          {['ALL', 'MODULES', 'ORGANIZATIONS'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                background: 'transparent',
                border: 'none',
                borderBottom: activeTab === tab ? '2px solid var(--primary)' : '2px solid transparent',
                padding: 'var(--space-3) var(--space-4)',
                fontWeight: activeTab === tab ? 700 : 500,
                color: activeTab === tab ? 'var(--primary)' : 'var(--text-muted)',
                cursor: 'pointer',
                fontSize: '0.875rem',
                transition: 'all 0.2s'
              }}
            >
              {tab.charAt(0) + tab.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {loading ? (
            <div style={{ padding: 'var(--space-10)', textAlign: 'center', color: 'var(--text-muted)' }}>Loading activity logs...</div>
          ) : filteredLogs.length === 0 ? (
            <div style={{ padding: 'var(--space-10)', textAlign: 'center', color: 'var(--text-muted)' }}>No logs found for this filter.</div>
          ) : filteredLogs.map((log) => (
            <div key={log.id} style={{ 
              padding: 'var(--space-5)', 
              borderBottom: '1px solid var(--border)', 
              display: 'grid', 
              gridTemplateColumns: '1fr 2fr 1fr', 
              gap: 'var(--space-4)',
              transition: 'background 0.2s'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--bg-main)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <User size={18} color="var(--text-muted)" />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{log.adminName || log.adminId}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Admin ID: {log.adminId}</span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <span style={{ 
                    padding: '2px 8px', 
                    borderRadius: '4px', 
                    fontSize: '0.625rem', 
                    fontWeight: 800,
                    background: log.action.includes('ASSIGN') || log.action.includes('CREATE') ? '#dcfce7' : '#fee2e2',
                    color: log.action.includes('ASSIGN') || log.action.includes('CREATE') ? '#166534' : '#991b1b',
                    textTransform: 'uppercase'
                  }}>
                    {log.action}
                  </span>
                  <ArrowRight size={12} color="var(--text-muted)" />
                  <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{log.targetType}</span>
                </div>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>{log.details}</p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', color: '#10b981', fontWeight: 600, fontSize: '0.8125rem' }}>
                  <CheckCircle2 size={16} /> Completed
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>{new Date(log.createdAt).toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>

        <div style={{ padding: 'var(--space-4)', background: '#f8fafc', textAlign: 'center' }}>
          <button className="btn" style={{ background: 'transparent', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.875rem' }}>
            View Older Activity
          </button>
        </div>
      </div>

      {/* Security Summary Section */}
      <div style={{ marginTop: 'var(--space-8)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6)' }}>
        <div className="card glass" style={{ borderLeft: '4px solid #10b981' }}>
          <h4 style={{ fontWeight: 700, marginBottom: 'var(--space-2)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={18} color="#10b981" /> System Integrity
          </h4>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>All administrative actions are cryptographically signed and stored in the secure audit vault.</p>
        </div>
        <div className="card glass" style={{ borderLeft: '4px solid #3b82f6' }}>
          <h4 style={{ fontWeight: 700, marginBottom: 'var(--space-2)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Box size={18} color="#3b82f6" /> Modular Tracking
          </h4>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>HMS and Inventory module assignments are tracked with precise temporal accuracy for billing purposes.</p>
        </div>
      </div>
    </div>
  );
}
