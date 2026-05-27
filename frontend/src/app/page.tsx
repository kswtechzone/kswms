'use client';

import { API_BASE_URL } from '@/lib/api';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Hotel, UserPlus, LogIn, Loader2, Sparkles, AlertCircle } from 'lucide-react';

// Dynamic CMS Sections
import HeroSection from '@/components/website/HeroSection';
import FeaturesSection from '@/components/website/FeaturesSection';
import TestimonialsSection from '@/components/website/TestimonialsSection';
import RoomsSection from '@/components/website/RoomsSection';
import ServicesSection from '@/components/website/ServicesSection';

export default function Home() {
  const [subdomain, setSubdomain] = useState<string | null>(null);
  const [website, setWebsite] = useState<any>(null);
  const [parlorServicesData, setParlorServicesData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      const isLocalhost = hostname.includes('localhost') || hostname.includes('127.0.0.1');

      // Resolve subdomain
      if (!isLocalhost && hostname.endsWith('.kswtechzone.com.np')) {
        const sub = hostname.replace('.kswtechzone.com.np', '');
        if (sub && !['kswms', 'ms', 'api', 'www', 'admin'].includes(sub)) {
          setSubdomain(sub);
          fetchTenantWebsite(sub);
          return;
        }
      } else if (isLocalhost) {
        const parts = hostname.split('.');
        if (parts.length > 1 && parts[0] !== 'localhost' && parts[0] !== 'www') {
          // Dev local subdomain testing (e.g. glam.localhost:3000)
          setSubdomain(parts[0]);
          fetchTenantWebsite(parts[0]);
          return;
        }
      }
      setLoading(false);
    }
  }, []);

  const fetchTenantWebsite = async (sub: string) => {
    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || `${API_BASE_URL}/api/v1`;
      
      // 1. Fetch Dynamic Website layout and configurations
      const res = await fetch(`${apiBase}/public/${sub}/website`);
      if (!res.ok) {
        if (res.status === 404) {
          throw new Error('This booking page or website has not been published yet.');
        }
        throw new Error('Could not load website layout.');
      }
      const data = await res.json();
      setWebsite(data);

      // 2. Fetch Parlor Services for Booking engines if enabled
      try {
        const resServices = await fetch(`${apiBase}/public/${sub}/parlor/services`);
        if (resServices.ok) {
          const services = await resServices.json();
          setParlorServicesData(services);
        }
      } catch (err) {
        console.log('Services module disabled or failed to fetch services.');
      }
    } catch (err: any) {
      setError(err.message || 'Error fetching website.');
    } finally {
      setLoading(false);
    }
  };

  // --- RENDER DYNAMIC TENANT WEBSITE ---
  if (subdomain) {
    if (loading) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#0b0f19', color: '#ffffff' }}>
          <Loader2 className="spinner" size={48} color="var(--primary)" />
          <p style={{ marginTop: 'var(--space-4)', color: 'var(--text-muted)', fontSize: '0.9rem', letterSpacing: '0.05em' }}>LOADING PRESENCE...</p>
        </div>
      );
    }

    if (error || !website) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#0b0f19', color: '#ffffff', padding: 'var(--space-6)', textAlign: 'center' }}>
          <AlertCircle size={48} color="#ef4444" style={{ marginBottom: 'var(--space-4)' }} />
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 'var(--space-2)' }}>Website Under Construction</h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: '500px', marginBottom: 'var(--space-6)' }}>
            {error || 'This organization website does not exist or has not been configured.'}
          </p>
          <a href="https://kswtechzone.com.np" className="btn btn-primary">
            Visit KSWMS Portal
          </a>
        </div>
      );
    }

    // Get dynamic active page (Home Page default)
    const activePage = website.pages?.find((p: any) => p.isHome) || website.pages?.[0];
    const sections = activePage?.sections || [];

    return (
      <main style={{ minHeight: '100vh', background: website.config?.themeColors?.background || '#0b0f19', color: website.config?.themeColors?.text || '#ffffff' }}>
        
        {/* Dynamic Nav Header */}
        <header style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(11, 15, 25, 0.8)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', padding: 'var(--space-4) var(--space-8)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '1.25rem', color: website.config?.primaryColor || 'var(--primary)' }}>
              <Sparkles size={20} />
              {website.title}
            </div>
            <nav style={{ display: 'flex', gap: 'var(--space-6)' }}>
              {website.pages?.map((p: any) => (
                <span key={p.id} style={{ cursor: 'pointer', fontSize: '0.9rem', fontWeight: 500, color: p.isHome ? (website.config?.primaryColor || 'var(--primary)') : 'var(--text-muted)' }}>
                  {p.title}
                </span>
              ))}
            </nav>
          </div>
        </header>

        {/* Dynamic Section Layout Builder */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {sections.map((sec: any) => {
            switch (sec.type) {
              case 'HERO':
                return <HeroSection key={sec.id} content={sec.content} config={website.config} previewMode="desktop" />;
              case 'FEATURES':
                return <FeaturesSection key={sec.id} content={sec.content} config={website.config} previewMode="desktop" />;
              case 'ROOMS':
                return <RoomsSection key={sec.id} content={sec.content} config={website.config} previewMode="desktop" />;
              case 'TESTIMONIALS':
                return <TestimonialsSection key={sec.id} content={sec.content} config={website.config} previewMode="desktop" />;
              case 'PARLOR_SERVICES':
                return (
                  <ServicesSection
                    key={sec.id}
                    content={sec.content}
                    config={website.config}
                    previewMode="desktop"
                    parlorServicesData={parlorServicesData}
                    tenantSlug={website.subdomain}
                  />
                );
              default:
                return null;
            }
          })}
        </div>

        {/* Footer */}
        <footer style={{ background: '#070a13', borderTop: '1px solid rgba(255, 255, 255, 0.05)', padding: 'var(--space-12) var(--space-8)', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>© {new Date().getFullYear()} {website.title}. All rights reserved.</div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', alignItems: 'center', opacity: 0.6 }}>
              <span>Powered by</span>
              <span style={{ color: 'white', fontWeight: 700 }}>KSW<span style={{ color: 'var(--primary)' }}>MS</span></span>
            </div>
          </div>
        </footer>
      </main>
    );
  }

  // --- RENDER MAIN MANAGEMENT PORTAL LANDING PAGE ---
  return (
    <main style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'var(--bg-main)',
      color: 'var(--text-main)',
      textAlign: 'center',
      padding: 'var(--space-10)'
    }}>
      <div style={{ 
        display: 'inline-flex', 
        padding: 'var(--space-4)', 
        borderRadius: '50%', 
        background: 'rgba(166, 118, 83, 0.1)', 
        color: 'var(--primary)',
        marginBottom: 'var(--space-6)'
      }}>
        <Hotel size={48} />
      </div>
      
      <h1 style={{ fontSize: '3.5rem', fontWeight: 800, marginBottom: 'var(--space-2)', letterSpacing: '-0.025em' }}>
        KSW<span style={{ color: 'var(--primary)' }}>MS</span>
      </h1>
      <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', maxWidth: '600px', marginBottom: 'var(--space-10)' }}>
        The world's most advanced modular corporate and operational management system. 
        Designed for scale, built for excellence.
      </p>

      <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link href="/login" className="btn btn-primary" style={{ display: 'flex', gap: 'var(--space-2)', height: '56px', padding: '0 var(--space-8)' }}>
          <LogIn size={20} />
          Sign In to Portal
        </Link>
        <Link href="/register" className="btn" style={{ 
          display: 'flex', 
          gap: 'var(--space-2)', 
          height: '56px', 
          padding: '0 var(--space-8)',
          background: 'var(--bg-card)',
          color: 'var(--text-main)',
          border: '1px solid var(--border)'
        }}>
          <UserPlus size={20} />
          Register Business
        </Link>
      </div>

      <div style={{ marginTop: 'var(--space-10)', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
        Join 2,500+ premium organizations worldwide.
      </div>
    </main>
  );
}
