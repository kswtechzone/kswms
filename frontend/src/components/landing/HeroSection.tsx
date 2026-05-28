'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Zap, ArrowRight, LayoutDashboard } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 25 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } }
};

export default function HeroSection() {
  return (
    <section className="relative min-h-[calc(100vh-5rem)] pt-16 sm:pt-24 md:pt-32 pb-16 sm:pb-20 flex flex-col items-center justify-center text-center">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        className="max-w-4xl space-y-8 sm:space-y-10"
      >
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 sm:px-4.5 sm:py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[#8B5CF6] text-[10px] sm:text-xs font-bold uppercase tracking-widest shadow-inner shadow-indigo-500/5 max-w-full text-center">
          <Zap size={10} className="text-cyan-400 flex-shrink-0 sm:w-3 sm:h-3" />
          <span className="truncate">Designed & Engineered by KSW Tech Zone</span>
        </div>

        <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1] sm:leading-[1.08] text-white max-w-full">
          Transform isolated workflows into a{' '}
          <span className="bg-gradient-to-r from-cyan-400 via-[#6366F1] to-[#8B5CF6] bg-clip-text text-transparent">
            Unified SaaS Ecosystem
          </span>
        </h1>

        <p className="text-sm sm:text-base md:text-lg text-slate-400 leading-relaxed max-w-3xl mx-auto px-1">
          KSWMS is an enterprise-grade multi-tenant SaaS application designed to manage luxury hotels, room stay calendars, fast fine-dining restaurant POS orders, spa/salon services, real-time stock levels, employee salary payroll, and no-code brand websites in one lightning-fast platform.
        </p>

        <div className="flex flex-row items-center justify-center gap-5 sm:gap-6 flex-wrap">
          <Link
            href="/register"
            className="px-10 py-5 text-sm sm:text-base font-bold rounded-xl bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white hover:shadow-2xl hover:shadow-indigo-500/40 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
          >
            Get Started Instantly <ArrowRight size={14} className="sm:w-4 sm:h-4" />
          </Link>
          <Link
            href="/login"
            className="px-10 py-5 text-sm sm:text-base font-bold rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all flex items-center justify-center gap-1.5"
          >
            <LayoutDashboard size={14} className="text-cyan-400 sm:w-4 sm:h-4" />
            Login
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
