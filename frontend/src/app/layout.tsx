'use client';

import './globals.css';
import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import { ToastProvider } from '../components/Toast';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return (
    <html lang="en" data-theme="dark">
      <body>
        <ToastProvider>
          {children}
          
          {/* Floating Theme Toggle */}
          <button 
            onClick={toggleTheme}
            style={{
              position: 'fixed',
              bottom: '2rem',
              right: '2rem',
              width: '3.5rem',
              height: '3.5rem',
              borderRadius: '50%',
              background: 'var(--primary)',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              zIndex: 1000,
              transition: 'transform 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            {theme === 'light' ? <Moon size={24} /> : <Sun size={24} />}
          </button>
        </ToastProvider>
      </body>
    </html>
  );
}
