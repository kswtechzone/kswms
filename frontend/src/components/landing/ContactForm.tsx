'use client';

import { useState } from 'react';
import { CheckCircle2, MessageSquare, Mail, Phone, MapPin } from 'lucide-react';

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 1500);
  };

  return (
    <section id="contact" className="py-16 sm:py-24 border-t border-white/5 w-full relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-cyan-500/3 blur-[100px] rounded-full pointer-events-none -z-10" />

      <div className="text-center mb-10">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mb-4">
          Custom Enterprise Deployments
        </h2>
        <p className="text-slate-400 text-xs sm:text-sm max-w-xl mx-auto px-1">
          Need advanced feature integration or custom setups built by KSW Tech Zone? Submit an inquiry, and our engineering team will respond within 24 hours.
        </p>
      </div>

      <div className="p-5 sm:p-10 rounded-3xl border border-white/10 bg-slate-950/40 backdrop-blur-md shadow-2xl w-full">
        {submitted ? (
          <div className="text-center py-8 sm:py-10 space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mx-auto mb-3 flex-shrink-0">
              <CheckCircle2 size={28} />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white">Inquiry Dispatched</h3>
            <p className="text-slate-450 text-xs max-w-md mx-auto leading-relaxed">
              Thank you. KSW Tech Zone&apos;s senior software engineering consultant has been notified and will reach out to schedule your integration briefing.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 w-full">

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-355 uppercase tracking-wider block">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="Er. Sanjay K. Singh"
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors h-11"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-355 uppercase tracking-wider block">Business Email</label>
                <input
                  type="email"
                  required
                  placeholder="sanjay@kswtechzone.com.np"
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors h-11"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-355 uppercase tracking-wider block">Phone / Mobile</label>
                <input
                  type="tel"
                  required
                  placeholder="+977-9800000000"
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors h-11"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-355 uppercase tracking-wider block">Target Subdomain</label>
                <input
                  type="text"
                  placeholder="regency.kswtechzone.com.np"
                  className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors h-11"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-355 uppercase tracking-wider block">Modules Requested</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
                {['Hotel PMS', 'Restaurant POS', 'Spa Parlor', 'Website CMS'].map((mod) => (
                  <label key={mod} className="flex items-center gap-2 p-3.5 rounded-xl border border-white/5 bg-slate-900/50 cursor-pointer hover:border-white/10 select-none">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="rounded border-slate-700 text-[#6366F1] focus:ring-0 focus:ring-offset-0 bg-slate-800 w-3.5 h-3.5 flex-shrink-0"
                    />
                    <span className="text-[10px] font-bold text-slate-300 truncate">{mod}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-355 uppercase tracking-wider block">Requirement details</label>
              <textarea
                rows={4}
                required
                placeholder="Describe your multi-property scale, custom POS printer maps, or unique branding needs..."
                className="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 text-xs font-bold uppercase tracking-wider rounded-xl bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white hover:shadow-xl hover:shadow-indigo-500/20 transition-all flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending Payload...
                </>
              ) : (
                <>
                  <MessageSquare size={14} className="flex-shrink-0" />
                  Dispatch Inquiry to KSW Tech Zone
                </>
              )}
            </button>

          </form>
        )}
      </div>

      <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4.5 sm:gap-6 text-center text-xs text-slate-400">
        <div className="flex flex-col items-center gap-2 p-4 rounded-2xl border border-white/5 bg-slate-950/20 min-h-[100px] justify-center">
          <Mail size={16} className="text-cyan-400 flex-shrink-0" />
          <div>
            <p className="font-bold text-slate-300">Email Inquiries</p>
            <p className="text-[10px] text-slate-500 mt-0.5">info@kswtechzone.com.np</p>
          </div>
        </div>
        <div className="flex flex-col items-center gap-2 p-4 rounded-2xl border border-white/5 bg-slate-950/20 min-h-[100px] justify-center">
          <Phone size={16} className="text-[#8B5CF6] flex-shrink-0" />
          <div>
            <p className="font-bold text-slate-300">Hotline Support</p>
            <p className="text-[10px] text-slate-500 mt-0.5">+977-1-4XXXXXX</p>
          </div>
        </div>
        <div className="flex flex-col items-center gap-2 p-4 rounded-2xl border border-white/5 bg-slate-950/20 min-h-[100px] justify-center">
          <MapPin size={16} className="text-pink-400 flex-shrink-0" />
          <div>
            <p className="font-bold text-slate-300">Kathmandu HQ</p>
            <p className="text-[10px] text-slate-500 mt-0.5">Kathmandu, Nepal</p>
          </div>
        </div>
      </div>
    </section>
  );
}
