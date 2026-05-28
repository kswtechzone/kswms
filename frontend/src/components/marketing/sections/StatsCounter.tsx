'use client';

import { useEffect, useState, useRef } from 'react';
import { animate, useInView } from 'framer-motion';

interface StatsCounterProps {
  end: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
}

export default function StatsCounter({ end, suffix = '', prefix = '', decimals = 0 }: StatsCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const controls = animate(0, end, {
      duration: 2,
      ease: 'easeOut',
      onUpdate: (val) => setCount(Number(val.toFixed(decimals))),
    });
    return () => controls.stop();
  }, [isInView, end, decimals]);

  return (
    <span ref={ref}>
      {prefix}{count}{suffix}
    </span>
  );
}
