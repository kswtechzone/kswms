'use client';
import React from 'react';
import { Settings } from 'lucide-react';

export default function AdminSettingsPage() {
  return (
    <div className="card glass" style={{ padding: 'var(--space-6)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
        <Settings size={28} color="var(--primary)" />
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>Platform Settings</h1>
          <p style={{ color: 'var(--text-muted)', margin: 0 }}>System-wide configurations and preferences.</p>
        </div>
      </div>
      <div style={{ textAlign: 'center', padding: 'var(--space-10)', color: 'var(--text-muted)' }}>
        <Settings size={48} style={{ margin: '0 auto var(--space-4)', opacity: 0.3 }} />
        <h2>Settings Coming Soon</h2>
        <p>Global platform settings, API keys, email templates, and system preferences will be managed here.</p>
      </div>
    </div>
  );
}
