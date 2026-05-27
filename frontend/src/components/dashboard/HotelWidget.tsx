import React from 'react';
import { Hotel } from 'lucide-react';
import Link from 'next/link';

export default function HotelWidget() {
  return (
    <div className="card glass" style={{ borderTop: '4px solid #f59e0b', transition: 'all 0.2s', padding: 'var(--space-6)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
        <Hotel size={24} color="#f59e0b" />
        <h3 style={{ margin: 0, fontSize: '1rem' }}>Hotel Operations</h3>
      </div>
      <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: 'var(--space-4)', minHeight: '40px' }}>
        Manage room inventory, guests, and hourly booking calendars.
      </p>
      <Link href="/dashboard/hotel-management" className="btn" style={{ width: '100%', border: '1px solid var(--border)', textDecoration: 'none', textAlign: 'center' }}>
        Manage Hotel
      </Link>
    </div>
  );
}
