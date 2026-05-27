import React from 'react';

interface RoomsSectionProps {
  content: any;
  config: any;
  previewMode: 'desktop' | 'tablet' | 'mobile';
}

export default function RoomsSection({ content, config, previewMode }: RoomsSectionProps) {
  const align = content?.textAlign || 'center';
  const pad = content?.padding === 'small' ? '40px 32px' : content?.padding === 'large' ? '120px 32px' : '80px 32px';
  const cols = content?.columns ? Number(content.columns) : 3;

  return (
    <div style={{ padding: pad, background: '#0f172a', color: 'white', textAlign: align as any }}>
      <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '12px' }}>
        {content?.title || 'Accommodations'}
      </h2>
      <p style={{ color: '#94a3b8', fontSize: '1.1rem', marginBottom: '48px', maxWidth: '800px', margin: align === 'center' ? '0 auto 48px' : '0 0 48px 0' }}>
        {content?.subtitle}
      </p>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: previewMode === 'mobile' ? '1fr' : `repeat(auto-fit, minmax(${100/cols - 5}%, 1fr))`, 
        gap: '24px', 
        maxWidth: '1200px', 
        margin: '0 auto',
        textAlign: 'left'
      }}>
        <div style={{ background: '#1e293b', borderRadius: '16px', overflow: 'hidden' }}>
          <img src="https://images.unsplash.com/photo-1578683010236-d716f9a3f461" style={{ width: '100%', height: '220px', objectFit: 'cover' }} />
          <div style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px' }}>Presidential Penthouse</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '20px' }}>Panoramic ocean view with private plunge pool.</p>
            <button style={{ width: '100%', padding: '12px', background: config?.primaryColor || '#A67653', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 700 }}>Book Now</button>
          </div>
        </div>
        <div style={{ background: '#1e293b', borderRadius: '16px', overflow: 'hidden' }}>
          <img src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b" style={{ width: '100%', height: '220px', objectFit: 'cover' }} />
          <div style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px' }}>Grand Deluxe Suite</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '20px' }}>Spacious lounge area and premium marble bathroom.</p>
            <button style={{ width: '100%', padding: '12px', background: config?.primaryColor || '#A67653', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 700 }}>Book Now</button>
          </div>
        </div>
        <div style={{ background: '#1e293b', borderRadius: '16px', overflow: 'hidden' }}>
          <img src="https://images.unsplash.com/photo-1566665797739-1674de7a421a" style={{ width: '100%', height: '220px', objectFit: 'cover' }} />
          <div style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '8px' }}>Oceanfront Villa</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '20px' }}>Direct beach access and private garden terrace.</p>
            <button style={{ width: '100%', padding: '12px', background: config?.primaryColor || '#A67653', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 700 }}>Book Now</button>
          </div>
        </div>
      </div>
    </div>
  );
}
