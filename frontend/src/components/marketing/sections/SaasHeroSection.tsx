'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Play, ExternalLink, Sparkles, BarChart3, Users, TrendingUp, Building2 } from 'lucide-react';
import Link from 'next/link';
import Button from '../ui/Button';
import StatsCounter from './StatsCounter';
import { SITE } from '@/lib/constants';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' as const } },
};

export default function SaasHeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-24 pb-16 sm:pt-32 sm:pb-20">
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--bg-main)] via-[var(--bg-main)] to-primary/5" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM5NDk0OTQiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center lg:text-left"
          >
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8">
              <Sparkles size={14} />
              <span>Enterprise-grade management platform</span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight text-[var(--text-main)] leading-[1.1]"
            >
              Manage Everything.{' '}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                One Platform.
              </span>
              {' '}Limitless Possibilities.
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="mt-6 text-lg sm:text-xl text-[var(--text-muted)] max-w-2xl lg:max-w-lg leading-relaxed"
            >
              {SITE.description}
            </motion.p>

            <motion.div variants={itemVariants} className="mt-8 flex flex-wrap gap-4 justify-center lg:justify-start">
              <Button href="/register" variant="primary" size="lg">
                Get Started <ArrowRight size={18} />
              </Button>
              <Button href="/contact" variant="secondary" size="lg">
                <Play size={18} />
                Book Demo
              </Button>
              <Link
                href={SITE.parentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border border-[var(--border)] text-[var(--text-muted)] hover:text-primary hover:border-primary/30 transition-all font-semibold text-sm"
              >
                <ExternalLink size={18} />
                Visit KSW TechZone
              </Link>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="mt-12 grid grid-cols-3 gap-8 max-w-md mx-auto lg:mx-0"
            >
              {[
                { value: 2500, suffix: '+', label: 'Organizations' },
                { value: 50, suffix: 'K+', label: 'Users Managed' },
                { value: 99.9, suffix: '%', label: 'Uptime' },
              ].map((stat) => (
                <div key={stat.label} className="text-center lg:text-left">
                  <div className="text-2xl sm:text-3xl font-bold text-[var(--text-main)]">
                    <StatsCounter end={stat.value} suffix={stat.suffix} decimals={stat.value % 1 ? 1 : 0} />
                  </div>
                  <div className="text-xs sm:text-sm text-[var(--text-muted)] mt-1">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative hidden lg:block"
          >
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-accent/20 rounded-3xl blur-2xl" />

              <div className="relative rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] shadow-2xl overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-3 border-b border-[var(--border)] bg-[var(--bg-main)]">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <div className="ml-4 px-3 py-1 rounded-md bg-[var(--bg-card)] border border-[var(--border)] text-xs text-[var(--text-muted)]">
                    kswms.kswtechzone.com
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-[var(--text-muted)]">Total Revenue</p>
                      <p className="text-2xl font-bold text-[var(--text-main)]">
                        <span className="text-xs text-green-500 mr-1">+12.5%</span>
                        $<StatsCounter end={28450} />
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <BarChart3 size={16} className="text-primary" />
                      </div>
                      <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                        <Users size={16} className="text-accent" />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/10">
                      <Building2 size={16} className="text-primary mb-1" />
                      <p className="text-lg font-bold text-[var(--text-main)]">
                        <StatsCounter end={156} />+
                      </p>
                      <p className="text-xs text-[var(--text-muted)]">Active Tenants</p>
                    </div>
                    <div className="p-3 rounded-xl bg-gradient-to-br from-accent/5 to-accent/10 border border-accent/10">
                      <TrendingUp size={16} className="text-accent mb-1" />
                      <p className="text-lg font-bold text-[var(--text-main)]">
                        <StatsCounter end={94} />%
                      </p>
                      <p className="text-xs text-[var(--text-muted)]">Satisfaction</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {[
                      { label: 'Monthly Growth', value: 24, color: 'bg-primary' },
                      { label: 'User Adoption', value: 87, color: 'bg-accent' },
                      { label: 'System Performance', value: 99, color: 'bg-green-500' },
                    ].map((bar) => (
                      <div key={bar.label}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-[var(--text-muted)]">{bar.label}</span>
                          <span className="text-[var(--text-main)] font-medium">{bar.value}%</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-[var(--border)] overflow-hidden">
                          <motion.div
                            className={`h-full rounded-full ${bar.color}`}
                            initial={{ width: 0 }}
                            whileInView={{ width: `${bar.value}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.2, delay: 0.8 }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
