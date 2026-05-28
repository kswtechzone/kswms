'use client';

import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
  onClick?: () => void;
}

export default function Card({
  children,
  className = '',
  hover = true,
  glow = false,
  onClick,
}: CardProps) {
  return (
    <motion.div
      onClick={onClick}
      className={`
        rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-6
        ${hover ? 'cursor-pointer' : ''}
        ${glow ? 'shadow-lg shadow-primary/5' : ''}
        ${className}
      `}
      whileHover={hover ? { y: -4, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' } : undefined}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  );
}
