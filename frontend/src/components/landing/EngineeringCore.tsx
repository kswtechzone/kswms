'use client';

import { Layers, Globe, Database, ShieldCheck, Award, Terminal, Check } from 'lucide-react';

export default function EngineeringCore() {
  return (
    <section id="engineering" className="py-16 sm:py-24 border-t border-white/5 w-full relative">
      <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#8B5CF6]/3 blur-[120px] rounded-full pointer-events-none" />

      <div className="grid lg:grid-cols-2 gap-10 md:gap-16 items-center">

        <div className="space-y-6">
          <div className="w-11 h-11 rounded-2xl bg-[#6366F1]/10 border border-[#6366F1]/20 flex items-center justify-center text-[#6366F1] flex-shrink-0">
            <Layers size={22} />
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Engineered by <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-cyan-400 to-[#8B5CF6] bg-clip-text text-transparent">
              KSW Tech Zone
            </span>
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
            KSWMS is built on the robust IT engineering foundation of **KSW Tech Zone**, a premier IT services, software development, and business analytics company based in Kathmandu, Nepal. Our team provides bespoke enterprise customizations, software integrations, and scaling guarantees.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-2xl border border-white/5 bg-white/[0.01] space-y-1.5">
              <div className="flex items-center gap-2 text-cyan-400">
                <Globe size={14} className="flex-shrink-0" />
                <span className="font-bold text-xs">Web & Software Dev</span>
              </div>
              <p className="text-[10px] text-slate-500 leading-relaxed">High-performance React/Next.js frontends and robust, scalable NestJS micro-modules.</p>
            </div>

            <div className="p-4 rounded-2xl border border-white/5 bg-white/[0.01] space-y-1.5">
              <div className="flex items-center gap-2 text-purple-400">
                <Database size={14} className="flex-shrink-0" />
                <span className="font-bold text-xs">Business Analytics</span>
              </div>
              <p className="text-[10px] text-slate-500 leading-relaxed">Comprehensive data reporting models to unlock hidden growth insights for your organization.</p>
            </div>

            <div className="p-4 rounded-2xl border border-white/5 bg-white/[0.01] space-y-1.5">
              <div className="flex items-center gap-2 text-emerald-400">
                <ShieldCheck size={14} className="flex-shrink-0" />
                <span className="font-bold text-xs">Multi-Tenant Isolation</span>
              </div>
              <p className="text-[10px] text-slate-500 leading-relaxed">Host-header resolves tenant contexts securely at DB queries layer. Bulletproof privacy.</p>
            </div>

            <div className="p-4 rounded-2xl border border-white/5 bg-white/[0.01] space-y-1.5">
              <div className="flex items-center gap-2 text-pink-400">
                <Award size={14} className="flex-shrink-0" />
                <span className="font-bold text-xs">Expert IT Consulting</span>
              </div>
              <p className="text-[10px] text-slate-500 leading-relaxed">Custom feature rollouts, legacy database migrations, and 24/7 engineering priority support.</p>
            </div>
          </div>
        </div>

        <div className="relative w-full">
          <div className="absolute inset-0 bg-gradient-to-r from-[#6366F1]/5 to-cyan-500/5 rounded-3xl blur-3xl pointer-events-none" />

          <div className="relative rounded-3xl border border-white/10 bg-[#090D1A] shadow-2xl overflow-hidden flex flex-col font-mono text-xs w-full">

            <div className="flex items-center justify-between px-4 py-3 sm:px-5 sm:py-4 border-b border-white/5 bg-slate-950/60">
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
              </div>
              <span className="text-[9px] sm:text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5 truncate max-w-[180px] sm:max-w-none">
                <Terminal size={10} className="text-[#6366F1] flex-shrink-0" />
                tenant-resolver.middleware.ts
              </span>
              <span className="text-[9px] text-slate-550 hidden xs:inline">Node v20</span>
            </div>

            <div className="p-4 sm:p-6 space-y-3.5 text-slate-350 leading-relaxed overflow-x-auto min-h-[260px] sm:min-h-[300px]">
              <div className="text-[10px] sm:text-xs">
                <span className="text-slate-500">[{new Date().toLocaleTimeString()}]</span> <span className="text-emerald-400 font-bold">INFO:</span> Booting host-header resolution gateway...
              </div>

              <div className="space-y-1 pl-3 border-l-2 border-slate-800 text-[10px] sm:text-xs">
                <p className="text-slate-450">Incoming Handshake payload:</p>
                <p className="text-yellow-400 font-bold break-all">GET https://regency.kswtechzone.com.np/api/v1/hotel</p>
                <p className="text-[9px] sm:text-[10px] text-slate-500 break-all">Headers: {'{'} "x-tenant-id": "org_regency_01", "host": "regency.kswtechzone.com.np" {'}'}</p>
              </div>

              <div className="text-slate-400 text-[10px] sm:text-xs">
                <span className="text-purple-400 font-bold">&gt;&gt;</span> Scanning organization scopes matching slug: <span className="text-white font-bold">&quot;regency&quot;</span>
              </div>

              <div className="text-slate-400 text-[10px] sm:text-xs leading-relaxed">
                <span className="text-cyan-400 font-bold">&gt;&gt;</span> Database tenant context resolved. Modules verified: <br />
                <span className="text-emerald-400 break-words font-semibold text-[9px] sm:text-xs">[&quot;HOTEL_PMS&quot;, &quot;RESTAURANT_POS&quot;, &quot;SPA_PARLOR&quot;, &quot;BRAND_CMS&quot;]</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-white/5 text-[9px] sm:text-[10px] text-slate-450 flex flex-col xs:flex-row gap-2 xs:items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Check className="text-emerald-400 flex-shrink-0" size={12} />
                  <span className="truncate">Authentication: jwt_payload.verified</span>
                </div>
                <span className="text-emerald-400 font-bold whitespace-nowrap self-end xs:self-auto">200 OK — 42ms</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
