import Link from 'next/link';
import { Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-white/5 py-10 bg-slate-950 mt-auto">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">

        <div className="flex items-center gap-3">
          <div className="w-8.5 h-8.5 rounded-lg bg-gradient-to-tr from-[#6366F1] to-[#8B5CF6] flex items-center justify-center flex-shrink-0">
            <Sparkles size={16} className="text-white" />
          </div>
          <span className="text-md font-black text-white">
            KSW<span className="text-indigo-400">MS</span>
          </span>
        </div>

        <div className="text-[10px] sm:text-xs text-slate-500 font-medium max-w-md">
          &copy; {new Date().getFullYear()} KSW Management System. Engineered by **KSW Tech Zone**. All rights reserved.
        </div>

        <div className="flex items-center justify-center gap-5 text-xs font-semibold text-slate-500">
          <Link href="#features" className="hover:text-slate-350 transition-colors">Features</Link>
          <Link href="#playground" className="hover:text-slate-355 transition-colors">Playground</Link>
          <Link href="#engineering" className="hover:text-slate-355 transition-colors">Engineers</Link>
        </div>

      </div>
    </footer>
  );
}
