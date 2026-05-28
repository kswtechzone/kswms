'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Hotel, UtensilsCrossed, Scissors, Globe, CheckCircle2, LayoutDashboard } from 'lucide-react';
import { tabs } from '@/data/moduleTabs';

const iconMap: Record<string, React.ElementType> = { Hotel, UtensilsCrossed: UtensilsCrossed, Scissors, Globe };

const tabIcons: Record<string, string> = {
  hotel: 'Hotel',
  pos: 'UtensilsCrossed',
  parlor: 'Scissors',
  cms: 'Globe'
};

export default function DashboardPlayground() {
  const [activeTab, setActiveTab] = useState('hotel');

  return (
    <section id="playground" className="py-20 sm:py-28 w-full relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] sm:w-[70%] h-[70%] bg-indigo-500/3 blur-[120px] rounded-full -z-10 pointer-events-none" />

      <div className="text-center mb-12 sm:mb-16">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mb-5">
          Interactive Dashboard Simulator
        </h2>
        <p className="text-slate-400 max-w-2xl mx-auto text-xs sm:text-sm px-1 leading-relaxed">
          Experience the responsive modular interfaces engineered specifically for each industry vertical.
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 md:gap-10 items-stretch">

        {/* Left Selection Tabs */}
        <div className="lg:col-span-4 flex lg:flex-col gap-4 sm:gap-5 overflow-x-auto lg:overflow-x-visible pb-4 lg:pb-0 scrollbar-none justify-start lg:justify-center -mx-4 px-4 lg:mx-0 lg:px-0">
          {tabs.map((tab) => {
            const Icon = iconMap[tabIcons[tab.id]] || Hotel;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-shrink-0 lg:flex-shrink w-[160px] sm:w-[200px] lg:w-full text-left p-5 sm:p-6 rounded-2xl border transition-all duration-300 relative overflow-hidden flex items-center gap-4 sm:gap-5 ${
                  activeTab === tab.id
                    ? 'border-indigo-500/30 bg-indigo-500/10 text-white shadow-lg'
                    : 'border-white/5 bg-white/[0.02] hover:bg-white/[0.05] text-slate-450 hover:text-slate-200'
                }`}
              >
                {activeTab === tab.id && (
                  <div className="absolute left-0 top-0 w-1 lg:w-1.5 h-full bg-[#6366F1]" />
                )}
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  activeTab === tab.id
                    ? 'bg-[#6366F1] text-white'
                    : 'bg-white/5 text-slate-400'
                }`}>
                  <Icon size={18} className="sm:hidden" />
                  <Icon size={22} className="hidden sm:block" />
                </div>
                <div className="min-w-0 flex flex-col justify-center py-4">
                  <p className="font-bold text-sm sm:text-base leading-none truncate">{tab.label}</p>
                  <p className="text-[9px] sm:text-[10px] text-slate-550 font-bold mt-1.5 truncate">{tab.badge}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Simulated Interactive Panel */}
        <div className="lg:col-span-8 flex flex-col w-full">
          <div className="relative rounded-3xl border border-white/10 bg-slate-950/80 backdrop-blur-md p-8 sm:p-12 shadow-2xl flex-1 flex flex-col justify-between overflow-visible">
            <div className="absolute top-[-50px] right-[-50px] w-48 h-48 rounded-full bg-[#6366F1]/5 blur-3xl pointer-events-none" />

            <AnimatePresence mode="wait">
              {tabs.map((tab) => tab.id === activeTab && (
                <motion.div
                  key={tab.id}
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-8 flex-1 flex flex-col justify-between"
                >
                  <div className="space-y-6">
                    <div className="flex items-center">
                      <span className="text-[9px] sm:text-[10px] uppercase font-black tracking-widest text-[#06B6D4] bg-cyan-500/10 px-3 py-1.5 rounded-full border border-cyan-500/20">
                        {tab.badge}
                      </span>
                    </div>
                    <h3 className="text-xl sm:text-3xl font-bold text-white leading-tight">
                      {tab.title}
                    </h3>
                    <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                      {tab.description}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">

                      <div className="space-y-5">
                        <p className="text-sm font-bold text-slate-200 uppercase tracking-wider">Key Capabilities</p>
                        <ul className="space-y-3">
                          {tab.features.map((feature, i) => (
                            <li key={i} className="flex items-start gap-3 text-sm text-slate-400">
                              <CheckCircle2 size={16} className="text-cyan-400 flex-shrink-0 mt-0.5" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="space-y-4 border-t md:border-t-0 md:border-l border-white/5 pt-6 md:pt-0 md:pl-8 flex flex-col justify-center">
                        <p className="text-sm font-bold text-slate-200 uppercase tracking-wider">Live Mockup Preview</p>
                        <div className="bg-slate-900/50 p-6 rounded-2xl border border-white/5">
                          {tab.preview}
                        </div>
                      </div>

                    </div>
                  </div>

                  <div className="border-t border-white/5 pt-8 pb-10 mt-8 grid grid-cols-3 gap-4">
                    {tab.stats.map((stat, i) => (
                      <div key={i} className="text-center">
                        <p className="text-xl sm:text-2xl font-black text-white truncate">{stat.value}</p>
                        <p className="text-[9px] sm:text-[10px] text-slate-500 font-black tracking-wider mt-2 uppercase truncate">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

      </div>
    </section>
  );
}
