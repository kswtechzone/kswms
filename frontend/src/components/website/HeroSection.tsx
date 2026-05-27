import React from 'react';

interface HeroSectionProps {
  content: any;
  config: any;
  previewMode: 'desktop' | 'tablet' | 'mobile';
}

export default function HeroSection({ content, config, previewMode }: HeroSectionProps) {
  const align = content?.textAlign || 'center';
  const pad = content?.padding === 'small' ? '60px 32px' : content?.padding === 'large' ? '180px 32px' : '120px 32px';

  return (
    <div style={{ 
      position: 'relative', 
      padding: pad, 
      textAlign: align as any, 
      background: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.7)), url(${content?.bgImage || 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb'}) center/cover`, 
      color: 'white' 
    }}>
      <h1 style={{ 
        fontSize: previewMode === 'mobile' ? '2.5rem' : '4rem', 
        fontWeight: 800, 
        marginBottom: '24px', 
        lineHeight: 1.1 
      }}>
        {content?.headline || 'Hero Headline'}
      </h1>
      <p style={{ 
        fontSize: '1.25rem', 
        maxWidth: '700px', 
        margin: align === 'center' ? '0 auto 36px' : '0 0 36px 0', 
        opacity: 0.9 
      }}>
        {content?.subtitle || 'Subtitle text'}
      </p>
      <a href={content?.ctaLink || '#'} style={{ 
        display: 'inline-block', 
        background: config?.primaryColor || '#A67653', 
        color: 'white', 
        padding: '16px 36px', 
        borderRadius: '50px', 
        fontWeight: 700, 
        textDecoration: 'none', 
        textTransform: 'uppercase', 
        letterSpacing: '1px', 
        boxShadow: '0 10px 20px rgba(0,0,0,0.2)' 
      }}>
        {content?.ctaText || 'Explore Now'}
      </a>
    </div>
  );
}
