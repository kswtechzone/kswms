'use client';

import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import { ToastProvider } from './Toast';

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
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
    <ToastProvider>
      {children}
      <button
        onClick={toggleTheme}
        className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-primary text-white border-none cursor-pointer flex items-center justify-center shadow-lg z-50 transition-transform hover:scale-110"
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      >
        {theme === 'light' ? <Moon size={24} /> : <Sun size={24} />}
      </button>
    </ToastProvider>
  );
}
