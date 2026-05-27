'use client';
import React from 'react';
import Link from 'next/link';
import { Home, ArrowLeft, Ghost } from 'lucide-react';

export default function NotFound() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
      padding: 'var(--space-6)',
      textAlign: 'center'
    }}>
      <div style={{ 
        position: 'relative',
        marginBottom: 'var(--space-8)'
      }}>
        <h1 style={{ 
          fontSize: '12rem', 
          fontWeight: 900, 
          margin: 0, 
          color: 'var(--primary)',
          opacity: 0.1,
          lineHeight: 1
        }}>404</h1>
        <div style={{ 
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          <Ghost size={80} color="var(--primary)" style={{ marginBottom: 'var(--space-4)' }} />
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>Lost in the Clouds?</h2>
        </div>
      </div>
      
      <p style={{ 
        fontSize: '1.25rem', 
        color: 'var(--text-muted)', 
        maxWidth: '500px', 
        marginBottom: 'var(--space-10)',
        lineHeight: 1.6
      }}>
        The page you are looking for doesn't exist or has been moved to a new destination.
      </p>

      <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
        <button 
          onClick={() => window.history.back()}
          className="btn" 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            padding: '12px 24px',
            border: '1px solid var(--border)',
            background: 'white'
          }}
        >
          <ArrowLeft size={18} /> Go Back
        </button>
        <Link 
          href="/dashboard" 
          className="btn btn-primary" 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px',
            padding: '12px 24px'
          }}
        >
          <Home size={18} /> Back to Dashboard
        </Link>
      </div>

      <div style={{ 
        marginTop: 'var(--space-20)',
        fontSize: '0.875rem',
        color: 'var(--text-muted)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <span>© 2026 KSWMS</span>
        <span style={{ opacity: 0.3 }}>|</span>
        <Link href="/support" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Contact Support</Link>
      </div>
    </div>
  );
}
