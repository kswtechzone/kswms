'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import SectionHeading from '../ui/SectionHeading';
import { INDUSTRIES } from '@/lib/constants';
import Link from 'next/link';

export default function IndustriesSection() {
  return (
    <section className="relative py-20 sm:py-28 lg:py-32 bg-[var(--bg-main)] overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-b from-primary/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <SectionHeading
          title="Built for Every Industry"
          subtitle="From hospitality to healthcare, our platform adapts to your unique business requirements."
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {INDUSTRIES.map((industry, i) => {
            const Icon = industry.icon;
            return (
              <motion.div
                key={industry.name}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="group relative p-6 rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] hover:border-accent/30 transition-all duration-300 cursor-pointer"
              >
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-accent/10 to-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Icon size={22} className="text-accent" />
                </div>
                <h3 className="text-base font-semibold text-[var(--text-main)] mb-1.5">
                  {industry.name}
                </h3>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                  {industry.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <Link
            href="/features"
            className="inline-flex items-center gap-2 text-[var(--text-muted)] hover:text-primary font-medium text-sm transition-colors group"
          >
            Explore all features
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
