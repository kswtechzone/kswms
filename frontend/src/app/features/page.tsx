'use client';

import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/marketing/layout/Header';
import Footer from '@/components/marketing/layout/Footer';
import SaasFeaturesSection from '@/components/marketing/sections/SaasFeaturesSection';
import SectionHeading from '@/components/marketing/ui/SectionHeading';
import { WHY_CHOOSE_US } from '@/lib/constants';

export default function FeaturesPage() {
  return (
    <main className="min-h-screen bg-[var(--bg-main)]">
      <Header />

      <section className="pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Link href="/" className="inline-flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-primary transition-colors">
              <ArrowLeft size={14} />
              Back to Home
            </Link>
          </motion.div>
          <SectionHeading
            title="All Features"
            subtitle="Discover the full power of KSWMS — a complete management ecosystem for modern businesses."
          />
        </div>
      </section>

      <SaasFeaturesSection />

      <section className="py-20 sm:py-28 bg-[var(--bg-main)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="The KSWMS Advantage"
            subtitle="What makes our platform different from the rest."
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {WHY_CHOOSE_US.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--bg-card)]"
                >
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center mb-4">
                    <Icon size={22} className="text-primary" />
                  </div>
                  <h3 className="text-base font-semibold text-[var(--text-main)] mb-2">{item.title}</h3>
                  <p className="text-sm text-[var(--text-muted)]">{item.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
