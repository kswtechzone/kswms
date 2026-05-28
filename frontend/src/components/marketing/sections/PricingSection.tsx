'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X } from 'lucide-react';
import SectionHeading from '../ui/SectionHeading';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { PRICING_PLANS } from '@/lib/constants';

export default function PricingSection() {
  const [annual, setAnnual] = useState(false);

  return (
    <section className="relative py-20 sm:py-28 lg:py-32 overflow-hidden" id="pricing">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <SectionHeading
          title="Simple, Transparent Pricing"
          subtitle="Choose the plan that fits your business. No hidden fees. No surprises."
        />

        <div className="flex items-center justify-center gap-4 mb-12">
          <span className={`text-sm font-medium ${!annual ? 'text-[var(--text-main)]' : 'text-[var(--text-muted)]'}`}>
            Monthly
          </span>
          <button
            onClick={() => setAnnual(!annual)}
            className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${
              annual ? 'bg-primary' : 'bg-[var(--border)]'
            }`}
            aria-label="Toggle billing period"
          >
            <motion.div
              className="absolute top-1 left-1 w-5 h-5 rounded-full bg-white shadow-sm"
              animate={{ x: annual ? 28 : 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          </button>
          <span className={`text-sm font-medium ${annual ? 'text-[var(--text-main)]' : 'text-[var(--text-muted)]'}`}>
            Annual <span className="text-green-500 text-xs">Save 17%</span>
          </span>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {PRICING_PLANS.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`relative p-8 rounded-2xl border transition-all duration-300 ${
                plan.popular
                  ? 'border-primary bg-[var(--bg-card)] shadow-xl shadow-primary/10 scale-105 md:scale-110'
                  : 'border-[var(--border)] bg-[var(--bg-card)] hover:border-primary/30'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge variant="default">Most Popular</Badge>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-[var(--text-main)]">{plan.name}</h3>
                <p className="text-sm text-[var(--text-muted)] mt-1">{plan.description}</p>
              </div>

              <div className="mb-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={annual ? 'annual' : 'monthly'}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.15 }}
                  >
                    <span className="text-4xl font-bold text-[var(--text-main)]">
                      ${annual ? plan.yearlyPrice : plan.price}
                    </span>
                    <span className="text-sm text-[var(--text-muted)] ml-1">
                      /{annual ? 'year' : 'month'}
                    </span>
                  </motion.div>
                </AnimatePresence>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature.text} className="flex items-start gap-3 text-sm">
                    {feature.included ? (
                      <Check size={16} className="text-green-500 shrink-0 mt-0.5" />
                    ) : (
                      <X size={16} className="text-red-500 shrink-0 mt-0.5" />
                    )}
                    <span className={feature.included ? 'text-[var(--text-main)]' : 'text-[var(--text-muted)] line-through'}>
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>

              <Button
                href={plan.name === 'Enterprise' ? '/contact' : '/register'}
                variant={plan.popular ? 'primary' : 'outline'}
                className="w-full"
              >
                {plan.cta}
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
