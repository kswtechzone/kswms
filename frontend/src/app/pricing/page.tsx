'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/marketing/layout/Header';
import Footer from '@/components/marketing/layout/Footer';
import PricingSection from '@/components/marketing/sections/PricingSection';
import FAQSection from '@/components/marketing/sections/FAQSection';
import SectionHeading from '@/components/marketing/ui/SectionHeading';

const highlights = [
  'No long-term contracts',
  'Free 14-day trial on all plans',
  'Cancel anytime',
  'Enterprise-grade security on all plans',
  'Regular feature updates',
  'Community access',
];

export default function PricingPage() {
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
            title="Find the Perfect Plan"
            subtitle="Every plan includes our core platform. Upgrade as you grow."
          />
          <div className="flex flex-wrap justify-center gap-6 max-w-2xl mx-auto">
            {highlights.map((item) => (
              <div key={item} className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
                <CheckCircle2 size={16} className="text-green-500 shrink-0" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <PricingSection />
      <FAQSection />
      <Footer />
    </main>
  );
}
