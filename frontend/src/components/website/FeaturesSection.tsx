import React from 'react';
import { Sparkles } from 'lucide-react';

interface FeaturesSectionProps {
  content: any;
  config: any;
  previewMode: 'desktop' | 'tablet' | 'mobile';
}

export default function FeaturesSection({ content, config, previewMode }: FeaturesSectionProps) {
  const align = content?.textAlign || 'center';
  const pad = content?.padding === 'small' ? '40px 32px' : content?.padding === 'large' ? '120px 32px' : '80px 32px';
  const cols = content?.columns ? Number(content.columns) : 3;

  return (
    <div style={{ padding: pad, background: '#f8fafc', textAlign: align as any }}>
      <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '12px' }}>
        {content?.title || 'Amenities'}
      </h2>
      <p style={{ color: '#64748b', fontSize: '1.1rem', marginBottom: '48px', maxWidth: '800px', margin: align === 'center' ? '0 auto 48px' : '0 0 48px 0' }}>
        {content?.subtitle}
      </p>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: previewMode === 'mobile' ? '1fr' : `repeat(auto-fit, minmax(${100/cols - 5}%, 1fr))`, 
        gap: '32px', 
        maxWidth: '1200px', 
        margin: '0 auto',
        textAlign: 'left'
      }}>
        {(content?.items || []).map((item: any, i: number) => (
          <div key={i} style={{ 
            background: 'white', 
            padding: '36px 24px', 
            borderRadius: '16px', 
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', 
            transition: 'transform 0.2s',
            textAlign: align === 'center' ? 'center' : 'left'
          }}>
            <div style={{ 
              display: 'inline-block', 
              padding: '16px', 
              background: 'rgba(166, 118, 83, 0.1)', 
              color: config?.primaryColor || '#A67653', 
              borderRadius: '50%', 
              marginBottom: '20px' 
            }}>
              <Sparkles size={28} />
            </div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#0f172a', marginBottom: '12px' }}>{item.title}</h3>
            <p style={{ color: '#64748b', fontSize: '0.95rem' }}>{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
