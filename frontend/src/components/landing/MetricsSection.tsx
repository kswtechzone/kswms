import { Zap, Lock, Database, Activity } from 'lucide-react';

const metrics = [
  {
    icon: Zap,
    color: 'text-[#6366F1]',
    bg: 'bg-[#6366F1]/10',
    value: '<45ms',
    label: 'API Response Time',
  },
  {
    icon: Lock,
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
    value: '100%',
    label: 'Tenant Isolation',
  },
  {
    icon: Database,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    value: '99.99%',
    label: 'Database Uptime',
  },
  {
    icon: Activity,
    color: 'text-pink-400',
    bg: 'bg-pink-500/10',
    value: 'Zero',
    label: 'Booking Overlaps',
  },
];

export default function MetricsSection() {
  return (
    <section id="metrics" className="py-20 sm:py-28 border-t border-white/5 text-center w-full">
      <div className="text-center mb-14">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-5">
          Robust Enterprise Metrics
        </h2>
        <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed px-1">
          Engaged directly for real-time computing and low latency processing under heavy concurrency loads.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-10">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <div key={metric.label} className="p-6 sm:p-8 rounded-2xl border border-white/5 bg-white/[0.01] flex flex-col justify-center min-h-[160px]">
              <div className={`w-10 h-10 rounded-xl ${metric.bg} flex items-center justify-center ${metric.color} mx-auto mb-4 flex-shrink-0`}>
                <Icon size={20} />
              </div>
              <p className="text-2xl sm:text-4xl font-black text-white truncate">{metric.value}</p>
              <p className="text-[9px] sm:text-[10px] text-slate-500 font-black tracking-wider mt-2 uppercase truncate">{metric.label}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
