import Link from 'next/link';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function NavHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#030712]/80 backdrop-blur-xl transition-all duration-300">
        <div className="flex items-center justify-between h-16 sm:h-20">
        <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group">
          <div className="w-8.5 h-8.5 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-[#6366F1] via-[#8B5CF6] to-[#06B6D4] flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-300 flex-shrink-0">
            <Sparkles size={16} className="text-white animate-pulse sm:hidden" />
            <Sparkles size={20} className="text-white animate-pulse hidden sm:block" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-lg sm:text-xl font-black tracking-tight text-white leading-none">
              KSW<span className="bg-gradient-to-r from-cyan-400 to-[#6366F1] bg-clip-text text-transparent">MS</span>
            </span>
            <span className="text-[8px] sm:text-[9px] tracking-widest uppercase text-slate-400 font-bold mt-0.5 sm:mt-1 truncate">SaaS Platform</span>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-8 text-sm font-semibold text-slate-350">
          <Link href="#features" className="hover:text-white transition-all">Modules</Link>
          <Link href="#playground" className="hover:text-white transition-all">Playground</Link>
          <Link href="#engineering" className="hover:text-white transition-all">Engineers</Link>
          <Link href="#metrics" className="hover:text-white transition-all">Metrics</Link>
          <Link href="#contact" className="hover:text-white transition-all">Integration</Link>
        </nav>

        <div className="flex items-center gap-3 sm:gap-4">
          <Link
            href="/login"
            className="text-xs sm:text-sm font-bold text-slate-300 hover:text-white transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="px-5 py-2.5 text-[10px] sm:text-xs font-bold rounded-xl bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white hover:shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-0.5 transition-all flex items-center gap-1.5 sm:gap-2 whitespace-nowrap"
          >
            <span>Get Started</span>
            <ArrowRight size={12} className="flex-shrink-0" />
          </Link>
        </div>
      </div>
    </header>
  );
}
