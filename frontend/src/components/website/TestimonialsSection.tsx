import React from 'react';

interface TestimonialsSectionProps {
  content: any;
  config: any;
  previewMode: 'desktop' | 'tablet' | 'mobile';
}

export default function TestimonialsSection({ content, config, previewMode }: TestimonialsSectionProps) {
  const align = content?.textAlign || 'center';
  const pad = content?.padding === 'small' ? '40px 32px' : content?.padding === 'large' ? '120px 32px' : '80px 32px';
  const cols = content?.columns ? Number(content.columns) : 2;

  return (
    <div style={{ padding: pad, background: 'white', textAlign: align as any }}>
      <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '12px' }}>
        {content?.title || 'Testimonials'}
      </h2>
      <p style={{ color: '#64748b', fontSize: '1.1rem', marginBottom: '48px', maxWidth: '800px', margin: align === 'center' ? '0 auto 48px' : '0 0 48px 0' }}>
        {content?.subtitle}
      </p>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: previewMode === 'mobile' ? '1fr' : `repeat(auto-fit, minmax(${100/cols - 5}%, 1fr))`, 
        gap: '32px', 
        maxWidth: '1000px', 
        margin: '0 auto' 
      }}>
        {(content?.items || []).map((item: any, i: number) => (
          <div key={i} style={{ padding: '32px', border: '1px solid #e2e8f0', borderRadius: '16px', background: '#f8fafc', fontStyle: 'italic', textAlign: 'left' }}>
            <p style={{ fontSize: '1.1rem', color: '#334155', marginBottom: '24px' }}>"{item.quote}"</p>
            <h4 style={{ fontWeight: 700, color: '#0f172a', margin: 0 }}>{item.author}</h4>
            <span style={{ fontSize: '0.85rem', color: config?.primaryColor || '#A67653' }}>{item.role}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
