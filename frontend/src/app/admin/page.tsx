'use client';

import { API_BASE_URL } from '@/lib/api';

import React, { useEffect, useState } from 'react';
import { 
  Users, 
  Hotel, 
  Building2, 
  ArrowUpRight, 
  Clock, 
  CheckCircle2,
  Activity
} from 'lucide-react';

export default function AdminOverview() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/organizations/stats`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` }
        });
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (err) {
        console.error('Failed to fetch stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    { label: 'Total Organizations', value: stats?.orgCount || 0, icon: Building2, color: '#3b82f6' },
    { label: 'Total Users', value: stats?.userCount || 0, icon: Users, color: '#10b981' },
    { label: 'Active Hotels', value: stats?.hotelCount || 0, icon: Hotel, color: '#f59e0b' },
  ];

  return (
    <div>
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 700, color: 'var(--secondary)' }}>Dashboard Overview</h1>
        <p style={{ color: 'var(--text-muted)' }}>Welcome to the KSWMS administrative control center.</p>
      </div>

      <div className="stats-grid">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="card stat-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ padding: 'var(--space-2)', borderRadius: 'var(--radius-md)', background: `${stat.color}15`, color: stat.color }}>
                   <Icon size={24} />
                </div>
                {loading && <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Loading...</span>}
              </div>
              <div style={{ marginTop: 'var(--space-3)' }}>
                <span className="stat-label">{stat.label}</span>
                <div className="stat-value">{loading ? '...' : stat.value}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--space-6)', marginTop: 'var(--space-8)' }}>
        {/* Recent Activity */}
        <div className="card" style={{ padding: 'var(--space-6)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-5)' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600 }}>System Audit Logs</h3>
            <Activity size={18} style={{ color: 'var(--primary)' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {stats?.recentLogs?.length > 0 ? (
              stats.recentLogs.map((log: any) => (
                <div key={log.id} style={{ display: 'flex', gap: 'var(--space-4)', paddingBottom: 'var(--space-4)', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ color: 'var(--primary)' }}>
                    <Clock size={20} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '0.9375rem', fontWeight: 500 }}>{log.details}</span>
                    <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                      {log.adminName} • {new Date(log.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: 'var(--space-10)' }}>
                No recent activity recorded.
              </p>
            )}
          </div>
          <a href="/admin/logs" className="btn" style={{ 
            marginTop: 'var(--space-5)', 
            width: '100%', 
            background: 'var(--bg-main)', 
            color: 'var(--text-main)', 
            border: '1px solid var(--border)',
            textDecoration: 'none'
          }}>
            View All Audit Logs
          </a>
        </div>

        {/* Quick Actions */}
        <div className="card" style={{ padding: 'var(--space-6)' }}>
          <h3 style={{ marginBottom: 'var(--space-5)', fontSize: '1.125rem', fontWeight: 600 }}>Quick Actions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            <a href="/admin/users" className="btn btn-primary" style={{ width: '100%', textDecoration: 'none', textAlign: 'center', display: 'block' }}>Add New User</a>
            <a href="/admin/brands" className="btn" style={{ width: '100%', background: 'var(--secondary)', color: 'white', textDecoration: 'none', textAlign: 'center', display: 'block' }}>Create New Brand</a>
            <button className="btn" style={{ width: '100%', background: 'transparent', border: '1px solid var(--border)' }}>Download Reports</button>
          </div>
        </div>
      </div>
    </div>
  );
}
