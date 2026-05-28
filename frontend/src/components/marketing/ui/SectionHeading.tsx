'use client';

import { motion } from 'framer-motion';

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  align?: 'center' | 'left';
  light?: boolean;
}

export default function SectionHeading({ title, subtitle, align = 'center', light = false }: SectionHeadingProps) {
  return (
    <motion.div
      className={`mb-16 ${align === 'center' ? 'text-center' : 'text-left'}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5 }}
    >
      <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight ${light ? 'text-white' : 'text-[var(--text-main)]'}`}>
        {title}
      </h2>
      {subtitle && (
        <p className={`mt-4 text-lg sm:text-xl max-w-3xl ${align === 'center' ? 'mx-auto' : ''} ${light ? 'text-white/70' : 'text-[var(--text-muted)]'}`}>
          {subtitle}
        </p>
      )}
      <div className={`mt-6 h-1 w-20 rounded-full bg-gradient-to-r from-primary to-accent ${align === 'center' ? 'mx-auto' : ''}`} />
    </motion.div>
  );
}
