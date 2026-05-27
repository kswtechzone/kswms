'use client';

import React, { useEffect, useState } from 'react';
import { Globe, ExternalLink, Edit, Sparkles, Monitor, ArrowRight } from 'lucide-react';
import Link from 'next/link';

import { API_BASE_URL } from '@/lib/api';

export default function LiveWebsitePreviewShowcase() {
  const [website, setWebsite] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWebsite = async () => {
      const token = localStorage.getItem('access_token') || '';
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const orgId = user.organization?.id || '';

      if (!orgId || !token) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${API_BASE_URL}/api/v1/websites`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'x-tenant-id': orgId
          }
        });

        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) {
            setWebsite(data[0]);
          }
        }
      } catch (err) {
        // Silently fail if offline or unavailable
      } finally {
        setLoading(false);
      }
    };

    fetchWebsite();
  }, []);

  if (loading) return null;

  return (
    <div className="card glass" style={{ marginTop: 'var(--space-8)', overflow: 'hidden' }}>
      <div style={{ padding: 'var(--space-6)', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ background: 'rgba(166, 118, 83, 0.15)', color: 'var(--primary)', padding: '12px', borderRadius: '12px' }}>
            <Monitor size={28} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              Brand Web Engine Showcase
              {website && (
                <span style={{ 
                  fontSize: '0.75rem', padding: '2px 8px', borderRadius: '12px', 
                  background: website.status === 'PUBLISHED' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(234, 179, 8, 0.15)',
                  color: website.status === 'PUBLISHED' ? '#22c55e' : '#eab308' 
                }}>
                  ● {website.status}
                </span>
              )}
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
              {website ? `Live subdomain preview: https://${website.subdomain}.kswtechzone.com.np` : 'No website deployed for this organization yet.'}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          {website ? (
            <>
              <Link href="/dashboard/website" className="btn" style={{ background: 'transparent', border: '1px solid var(--border)', gap: '8px', textDecoration: 'none' }}>
                <Edit size={16} /> Open CMS Studio
              </Link>
              <a 
                href={`https://${website.subdomain}.kswtechzone.com.np`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn btn-primary"
                style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <ExternalLink size={16} /> Open Live Site
              </a>
            </>
          ) : (
            <Link href="/dashboard/website" className="btn btn-primary" style={{ gap: '8px', textDecoration: 'none' }}>
              <Sparkles size={18} /> Launch Brand Website
              <ArrowRight size={18} />
            </Link>
          )}
        </div>
      </div>

      {website ? (
        /* Browser Chrome Simulation */
        <div style={{ background: '#0f172a', padding: '32px 24px', display: 'flex', justifyContent: 'center' }}>
          <div style={{ 
            width: '100%', maxWidth: '960px', background: 'white', borderRadius: '16px', overflow: 'hidden',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', border: '1px solid #334155'
          }}>
            {/* Browser Navigation Bar */}
            <div style={{ background: '#1e293b', padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid #334155' }}>
              <span style={{ display: 'inline-block', width: '12px', height: '12px', borderRadius: '50%', background: '#ef4444' }}></span>
              <span style={{ display: 'inline-block', width: '12px', height: '12px', borderRadius: '50%', background: '#eab308' }}></span>
              <span style={{ display: 'inline-block', width: '12px', height: '12px', borderRadius: '50%', background: '#22c55e' }}></span>
              <div style={{ background: '#0f172a', padding: '6px 16px', borderRadius: '8px', color: '#94a3b8', fontSize: '0.85rem', flex: 1, fontFamily: 'monospace', marginLeft: '12px' }}>
                https://{website.subdomain}.kswtechzone.com.np
              </div>
            </div>

            {/* Simulated Hero Section */}
            <div style={{ 
              position: 'relative', padding: '100px 32px', textAlign: 'center', 
              background: `linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.7)), url(${website.pages?.[0]?.sections?.[0]?.content?.bgImage || 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb'}) center/cover`, 
              color: 'white' 
            }}>
              <span style={{ textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.85rem', fontWeight: 700, color: website.config?.primaryColor || '#A67653' }}>
                Official Booking Portal
              </span>
              <h3 style={{ fontSize: '3rem', fontWeight: 800, margin: '12px 0 20px', color: 'white' }}>
                {website.title}
              </h3>
              <p style={{ fontSize: '1.2rem', maxWidth: '650px', margin: '0 auto 32px', opacity: 0.9 }}>
                {website.description || 'Experience world-class luxury and exquisite accommodations.'}
              </p>
              <span style={{ display: 'inline-block', background: website.config?.primaryColor || '#A67653', color: 'white', padding: '14px 36px', borderRadius: '50px', fontWeight: 700, letterSpacing: '1px' }}>
                Explore & Book Stay
              </span>
            </div>
          </div>
        </div>
      ) : (
        /* Empty Promotional Showcase */
        <div style={{ padding: '48px 32px', textAlign: 'center', background: 'var(--bg-main)' }}>
          <Globe size={48} style={{ margin: '0 auto 16px', color: 'var(--primary)', opacity: 0.8 }} />
          <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '8px' }}>Launch Your Direct Booking Channel</h3>
          <p style={{ color: 'var(--text-muted)', maxWidth: '500px', margin: '0 auto 24px' }}>
            Build your high-converting hospitality website with zero code. Integrated directly with your hotel inventory and PMS.
          </p>
          <Link href="/dashboard/website" className="btn btn-primary" style={{ padding: '12px 28px', textDecoration: 'none' }}>
            Create Website Now
          </Link>
        </div>
      )}
    </div>
  );
}
