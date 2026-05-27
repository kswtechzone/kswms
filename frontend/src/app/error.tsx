'use client';
import React, { useEffect } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application Error:', error);
  }, [error]);

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      background: '#fff',
      padding: 'var(--space-6)',
      textAlign: 'center'
    }}>
      <div style={{ 
        background: '#fee2e2', 
        padding: '2rem', 
        borderRadius: '50%', 
        marginBottom: 'var(--space-6)' 
      }}>
        <AlertTriangle size={64} color="#ef4444" />
      </div>
      
      <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: 'var(--space-2)' }}>
        Something went wrong
      </h1>
      
      <p style={{ 
        fontSize: '1.125rem', 
        color: 'var(--text-muted)', 
        maxWidth: '500px', 
        marginBottom: 'var(--space-8)',
        lineHeight: 1.6
      }}>
        We encountered an unexpected error while processing your request. Our team has been notified.
      </p>

      {process.env.NODE_ENV === 'development' && (
        <pre style={{ 
          background: '#f1f5f9', 
          padding: 'var(--space-4)', 
          borderRadius: '8px', 
          fontSize: '0.875rem', 
          color: '#ef4444',
          maxWidth: '80vw',
          overflowX: 'auto',
          textAlign: 'left',
          marginBottom: 'var(--space-8)'
        }}>
          {error.message}
        </pre>
      )}

      <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
        <button 
          onClick={() => reset()}
          className="btn btn-primary" 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            padding: '12px 24px'
          }}
        >
          <RefreshCw size={18} /> Try Again
        </button>
        <button 
          onClick={() => window.location.href = '/dashboard'}
          className="btn" 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            padding: '12px 24px',
            border: '1px solid var(--border)'
          }}
        >
          <Home size={18} /> Back to Home
        </button>
      </div>
    </div>
  );
}
