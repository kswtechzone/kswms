'use client';

import { motion } from 'framer-motion';
import SectionHeading from '../ui/SectionHeading';
import { WHY_CHOOSE_US } from '@/lib/constants';

export default function WhyChooseUsSection() {
  return (
    <section className="relative py-20 sm:py-28 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-gradient-to-t from-primary/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <SectionHeading
          title="Why Businesses Choose KSWMS"
          subtitle="We combine cutting-edge technology with deep industry expertise to deliver a platform you can rely on."
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {WHY_CHOOSE_US.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex gap-4 p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] hover:border-primary/20 transition-all"
              >
                <div className="shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                  <Icon size={24} className="text-primary" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-[var(--text-main)] mb-1.5">
                    {item.title}
                  </h3>
                  <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
