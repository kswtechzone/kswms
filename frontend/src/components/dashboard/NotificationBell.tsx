'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Bell, Check, Loader2, Sparkles } from 'lucide-react';
import { API_BASE_URL } from '@/lib/api';

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState<string>('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      setEmail(parsed.email || '');
      fetchNotifications(parsed.email);
    }

    // Close dropdown on outside click
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Establish Server-Sent Events (SSE) Real-Time Stream
  useEffect(() => {
    if (!email) return;

    const sseUrl = `${API_BASE_URL}/notifications/stream?userId=${encodeURIComponent(email)}`;
    const eventSource = new EventSource(sseUrl);

    eventSource.onmessage = (event) => {
      try {
        const newNotification = JSON.parse(event.data);
        
        // Append to state and trigger audio chime/visual pulse
        setNotifications((prev) => {
          // Avoid duplicate triggers
          if (prev.some((n) => n.id === newNotification.id)) return prev;
          return [newNotification, ...prev];
        });

        // Flash micro toast notification
        showNotificationToast(newNotification);
      } catch (e) {
        console.error('Failed to parse SSE notification payload:', e);
      }
    };

    eventSource.onerror = (err) => {
      console.warn('SSE connection lost, waiting to reconnect...', err);
    };

    return () => {
      eventSource.close();
    };
  }, [email]);

  const fetchNotifications = async (userEmail: string) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/notifications?userId=${encodeURIComponent(userEmail)}`);
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      }
    } catch (e) {
      console.error('Failed to load notifications:', e);
    } finally {
      setLoading(false);
    }
  };

  const markAllAsRead = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/notifications/read-all`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: email }),
      });
      if (res.ok) {
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      }
    } catch (e) {
      console.error('Failed to mark all as read:', e);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/notifications/${id}/read`, {
        method: 'PATCH',
      });
      if (res.ok) {
        setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
      }
    } catch (e) {
      console.error('Failed to mark notification as read:', e);
    }
  };

  const showNotificationToast = (n: NotificationItem) => {
    const toast = document.createElement('div');
    toast.style.position = 'fixed';
    toast.style.bottom = '24px';
    toast.style.right = '24px';
    toast.style.padding = '16px 20px';
    toast.style.background = 'rgba(15, 23, 42, 0.95)';
    toast.style.border = '1px solid rgba(245, 158, 11, 0.4)';
    toast.style.borderRadius = 'var(--radius-lg)';
    toast.style.color = 'white';
    toast.style.boxShadow = '0 10px 25px -5px rgba(0,0,0,0.5), 0 0 15px rgba(245,158,11,0.2)';
    toast.style.zIndex = '99999';
    toast.style.backdropFilter = 'blur(12px)';
    toast.style.transition = 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)';
    toast.style.transform = 'translateY(100px)';
    toast.style.opacity = '0';
    toast.style.maxWidth = '320px';

    toast.innerHTML = `
      <div style="display: flex; gap: 12px; align-items: flex-start;">
        <div style="background: rgba(245,158,11,0.15); padding: 8px; borderRadius: 50%; color: var(--primary); display: flex; align-items: center; justify-content: center;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
        </div>
        <div>
          <div style="font-weight: 700; font-size: 0.9rem; margin-bottom: 2px;">${n.title}</div>
          <div style="font-size: 0.75rem; color: rgba(255,255,255,0.7); line-height: 1.3;">${n.message}</div>
        </div>
      </div>
    `;

    document.body.appendChild(toast);
    
    // Trigger slide up
    setTimeout(() => {
      toast.style.transform = 'translateY(0)';
      toast.style.opacity = '1';
    }, 100);

    // Audio beep/chime
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.1); // A5
      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.3);
    } catch {}

    // Auto dismiss
    setTimeout(() => {
      toast.style.transform = 'translateY(100px)';
      toast.style.opacity = '0';
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 4500);
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div style={{ position: 'relative' }} ref={dropdownRef}>
      
      {/* Bell Button trigger */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{ 
          background: 'none', 
          border: 'none', 
          color: isOpen ? 'var(--primary)' : 'var(--text-muted)', 
          cursor: 'pointer',
          position: 'relative',
          padding: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'color 0.2s'
        }}
      >
        <Bell size={20} />
        
        {unreadCount > 0 && (
          <span style={{
            position: 'absolute',
            top: '-2px',
            right: '-2px',
            background: 'var(--primary)',
            color: 'white',
            borderRadius: '50%',
            width: '15px',
            height: '15px',
            fontSize: '9px',
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 10px var(--primary)',
            animation: 'pulse 1.5s infinite alternate'
          }}>
            {unreadCount}
          </span>
        )}
      </button>

      {/* Styled pulsing animation injected directly */}
      <style jsx global>{`
        @keyframes pulse {
          0% { transform: scale(1); box-shadow: 0 0 6px var(--primary); }
          100% { transform: scale(1.25); box-shadow: 0 0 12px var(--primary); }
        }
      `}</style>

      {/* Dropdown Panel */}
      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '36px',
          right: 0,
          width: '350px',
          background: 'rgba(15, 23, 42, 0.98)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.4)',
          zIndex: 1000,
          overflow: 'hidden',
          backdropFilter: 'blur(16px)'
        }}>
          
          {/* Header */}
          <div style={{ 
            padding: '16px 20px', 
            borderBottom: '1px solid rgba(255,255,255,0.05)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'rgba(255,255,255,0.01)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={14} style={{ color: 'var(--primary)' }} />
              <span style={{ fontWeight: 800, fontSize: '0.875rem', color: 'white' }}>Inbox Notifications</span>
            </div>
            
            {unreadCount > 0 && (
              <button 
                onClick={markAllAsRead}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--primary)',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <Check size={12} /> Mark all read
              </button>
            )}
          </div>

          {/* List Workspace */}
          <div style={{ maxHeight: '320px', overflowY: 'auto', padding: '8px 0' }}>
            {loading ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 0', gap: '8px', color: 'var(--text-muted)' }}>
                <Loader2 size={16} className="animate-spin" />
                <span style={{ fontSize: '0.8rem' }}>Loading notifications...</span>
              </div>
            ) : notifications.length > 0 ? (
              notifications.map((item) => (
                <div 
                  key={item.id}
                  onClick={() => !item.isRead && markAsRead(item.id)}
                  style={{
                    padding: '14px 20px',
                    borderBottom: '1px solid rgba(255,255,255,0.03)',
                    cursor: item.isRead ? 'default' : 'pointer',
                    background: item.isRead ? 'transparent' : 'rgba(245, 158, 11, 0.03)',
                    transition: 'background 0.2s',
                    position: 'relative'
                  }}
                >
                  {/* Unread Indicator Bar */}
                  {!item.isRead && (
                    <div style={{
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      bottom: 0,
                      width: '3px',
                      background: 'var(--primary)'
                    }} />
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                    <div style={{ 
                      fontWeight: item.isRead ? 600 : 800, 
                      fontSize: '0.825rem', 
                      color: item.isRead ? 'rgba(255,255,255,0.8)' : 'white' 
                    }}>
                      {item.title}
                    </div>
                    <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.25)', whiteSpace: 'nowrap' }}>
                      {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <p style={{ 
                    fontSize: '0.75rem', 
                    color: 'var(--text-muted)', 
                    margin: '4px 0 0 0',
                    lineHeight: 1.45
                  }}>
                    {item.message}
                  </p>
                </div>
              ))
            ) : (
              <div style={{
                textAlign: 'center',
                padding: '40px 16px',
                color: 'var(--text-muted)',
                fontSize: '0.8rem'
              }}>
                No messages or system events found. Enjoy your clean inbox!
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
