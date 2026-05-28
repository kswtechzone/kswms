import Link from 'next/link';
import { ArrowRight, Hotel, UtensilsCrossed, Scissors, Globe, Package, Wallet } from 'lucide-react';

const features = [
  {
    icon: Hotel,
    color: 'blue',
    title: 'Flexible Stay PMS',
    description: 'Empower your hotels to sell standard rooms by day or hourly blocks. Seamless check-in calendar sheets, status logs, and dynamic price rates rules.',
    linkLabel: 'Explore PMS',
  },
  {
    icon: UtensilsCrossed,
    color: 'orange',
    title: 'Speed restaurant POS',
    description: 'Deploy lightning-fast cashiers billing registers. Dynamic dining tables maps, instantaneous KOT dispatch matrices, and guest folio charge syncs.',
    linkLabel: 'Explore POS',
  },
  {
    icon: Scissors,
    color: 'pink',
    title: 'Parlor SPA Scheduler',
    description: 'Manage appointment timetables, multiple technicians, beauty therapy rooms, and detailed guest preferences. Prevents scheduling collision.',
    linkLabel: 'Explore Parlor',
  },
  {
    icon: Globe,
    color: 'purple',
    title: 'No-Code Brand CMS',
    description: 'Configure your own website visual panels directly within your account. Connect custom host domains with automated SSL generation.',
    linkLabel: 'Explore CMS',
  },
  {
    icon: Package,
    color: 'emerald',
    title: 'Inventory Control',
    description: 'Track warehouse stock counts, transaction history logs (IN, OUT, WASTE), minimum reserve levels, and low item triggers.',
    linkLabel: 'Explore Inventory',
  },
  {
    icon: Wallet,
    color: 'yellow',
    title: 'Unified Invoicing',
    description: 'Instantly aggregate standard room rent rates, restaurant dinners, and beauty appointments to compile a unified guest folio invoice.',
    linkLabel: 'Explore Finance',
  },
];

const colorClasses: Record<string, { bg: string; border: string; text: string; dot: string; hoverBg: string }> = {
  blue: {
    bg: 'bg-blue-500/10', border: 'border-blue-500/20', text: 'text-blue-400', dot: 'bg-blue-500/3', hoverBg: 'group-hover:bg-blue-500/8'
  },
  orange: {
    bg: 'bg-orange-500/10', border: 'border-orange-500/20', text: 'text-orange-400', dot: 'bg-orange-500/3', hoverBg: 'group-hover:bg-orange-500/8'
  },
  pink: {
    bg: 'bg-pink-500/10', border: 'border-pink-500/20', text: 'text-pink-400', dot: 'bg-pink-500/3', hoverBg: 'group-hover:bg-pink-500/8'
  },
  purple: {
    bg: 'bg-purple-500/10', border: 'border-purple-500/20', text: 'text-purple-400', dot: 'bg-purple-500/3', hoverBg: 'group-hover:bg-purple-500/8'
  },
  emerald: {
    bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-400', dot: 'bg-emerald-500/3', hoverBg: 'group-hover:bg-emerald-500/8'
  },
  yellow: {
    bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', text: 'text-yellow-400', dot: 'bg-yellow-500/3', hoverBg: 'group-hover:bg-yellow-500/8'
  },
};

export default function FeatureGrid() {
  return (
    <section id="features" className="py-20 sm:py-28 border-t border-white/5 w-full">
      <div className="text-center mb-14 sm:mb-20">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mb-5">
          Unified Suite Features
        </h2>
        <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed px-1">
          Everything your business needs to perform, manage, and scale operations on a secure SaaS architecture.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature) => {
          const c = colorClasses[feature.color];
          const Icon = feature.icon;
          return (
            <div
              key={feature.title}
              className="p-8 sm:p-10 pb-10 rounded-3xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.02] hover:border-white/10 transition-all duration-300 group relative overflow-visible flex flex-col justify-between min-h-[260px]"
            >
              <div className={`absolute top-0 right-0 w-32 h-32 ${c.dot} rounded-full blur-3xl ${c.hoverBg} transition-all duration-500 pointer-events-none`} />
              <div className={`w-12 h-12 rounded-2xl ${c.bg} ${c.border} flex items-center justify-center ${c.text} mb-6 group-hover:scale-105 transition-transform flex-shrink-0`}>
                <Icon size={24} />
              </div>
              <div className="space-y-3">
                <h3 className="text-xl sm:text-2xl font-bold text-white">{feature.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{feature.description}</p>
              </div>
              <div className={`flex items-center gap-2 mt-6 text-xs sm:text-sm ${c.text} font-bold group-hover:translate-x-1.5 transition-transform duration-300`}>
                {feature.linkLabel} <ArrowRight size={14} />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
