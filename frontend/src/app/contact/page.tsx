'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Mail, MapPin, Phone, Send, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/marketing/layout/Header';
import Footer from '@/components/marketing/layout/Footer';
import { SITE } from '@/lib/constants';

const contactInfo = [
  { icon: Mail, label: 'Email', value: SITE.email, href: `mailto:${SITE.email}` },
  { icon: Phone, label: 'Phone', value: SITE.phone, href: `tel:${SITE.phone}` },
  { icon: MapPin, label: 'Location', value: SITE.address, href: '#' },
];

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <main className="min-h-screen bg-[var(--bg-main)]">
      <Header />

      <section className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <Link href="/" className="inline-flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-primary transition-colors">
              <ArrowLeft size={14} />
              Back to Home
            </Link>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-16">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
              <h1 className="text-3xl sm:text-4xl font-bold text-[var(--text-main)] mb-4">Get in Touch</h1>
              <p className="text-lg text-[var(--text-muted)] mb-10 max-w-md">
                Ready to transform your business? We&apos;d love to hear from you. Reach out and our team will get back to you within 24 hours.
              </p>

              <div className="space-y-6">
                {contactInfo.map((info) => {
                  const Icon = info.icon;
                  return (
                    <a
                      key={info.label}
                      href={info.href}
                      className="flex items-center gap-4 group"
                    >
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Icon size={20} className="text-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-[var(--text-muted)]">{info.label}</p>
                        <p className="text-sm font-medium text-[var(--text-main)] group-hover:text-primary transition-colors">{info.value}</p>
                      </div>
                    </a>
                  );
                })}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-8">
                {submitted ? (
                  <div className="text-center py-12">
                    <CheckCircle2 size={48} className="mx-auto text-green-500 mb-4" />
                    <h3 className="text-xl font-semibold text-[var(--text-main)] mb-2">Message Sent!</h3>
                    <p className="text-[var(--text-muted)] text-sm">We&apos;ll get back to you within 24 hours.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-5">
                      <input name="firstName" placeholder="First Name" required className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--input-bg)] text-[var(--input-text)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm" />
                      <input name="lastName" placeholder="Last Name" required className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--input-bg)] text-[var(--input-text)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm" />
                    </div>
                    <input name="email" type="email" placeholder="Email Address" required className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--input-bg)] text-[var(--input-text)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm" />
                    <input name="phone" type="tel" placeholder="Phone Number" className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--input-bg)] text-[var(--input-text)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm" />
                    <select className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--input-bg)] text-[var(--input-text)] focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm">
                      <option value="">Select your industry</option>
                      <option value="hospitality">Hospitality</option>
                      <option value="hotel">Hotel</option>
                      <option value="restaurant">Restaurant</option>
                      <option value="retail">Retail / Business</option>
                      <option value="enterprise">Enterprise</option>
                      <option value="school">School / Education</option>
                      <option value="clinic">Clinic / Healthcare</option>
                      <option value="other">Other</option>
                    </select>
                    <textarea name="message" placeholder="Tell us about your needs..." rows={4} className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--input-bg)] text-[var(--input-text)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm resize-none" />
                    <button type="submit" className="w-full px-6 py-3.5 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary-500 transition-all flex items-center justify-center gap-2">
                      <Send size={16} />
                      Send Message
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
