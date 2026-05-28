'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Send, ExternalLink, Heart } from 'lucide-react';
import Link from 'next/link';
import { SITE, FOOTER_LINKS, SOCIAL_LINKS } from '@/lib/constants';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer className="relative border-t border-[var(--border)] bg-[var(--bg-main)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 lg:gap-8">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 group mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Sparkles size={18} className="text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-[var(--text-main)]">
                KSW<span className="text-primary">MS</span>
              </span>
            </Link>
            <p className="text-sm text-[var(--text-muted)] leading-relaxed max-w-sm mb-6">
              {SITE.description}
            </p>

            <div className="flex items-center gap-3 mb-8">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] flex items-center justify-center text-[var(--text-muted)] hover:text-primary hover:border-primary/30 transition-all"
                  aria-label={social.label}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    {social.icon === 'Facebook' && <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />}
                    {social.icon === 'Twitter' && <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />}
                    {social.icon === 'Linkedin' && <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />}
                    {social.icon === 'Github' && <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />}
                  </svg>
                </a>
              ))}
            </div>

            <form onSubmit={handleSubscribe} className="max-w-sm">
              <label className="block text-sm font-medium text-[var(--text-main)] mb-2">
                Subscribe to our newsletter
              </label>
              <div className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="flex-1 px-4 py-2.5 text-sm rounded-xl border border-[var(--border)] bg-[var(--input-bg)] text-[var(--input-text)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-primary text-white hover:bg-primary-500 transition-all"
                  aria-label="Subscribe"
                >
                  <Send size={16} />
                </button>
              </div>
              {subscribed && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 text-xs text-green-500"
                >
                  Thanks for subscribing!
                </motion.p>
              )}
            </form>
          </div>

          {FOOTER_LINKS.map((column) => (
            <div key={column.title}>
              <h4 className="text-sm font-semibold text-[var(--text-main)] mb-4">
                {column.title}
              </h4>
              <ul className="space-y-3">
                {column.links.map((link) => {
                  const isExternal = link.href.startsWith('http');
                  const Comp = isExternal ? 'a' : Link;
                  const props = isExternal
                    ? { href: link.href, target: '_blank', rel: 'noopener noreferrer' }
                    : { href: link.href };
                  return (
                    <li key={link.label}>
                      <Comp
                        {...props}
                        className="flex items-center gap-1 text-sm text-[var(--text-muted)] hover:text-primary transition-colors"
                      >
                        {link.label}
                        {isExternal && <ExternalLink size={12} />}
                      </Comp>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[var(--text-muted)]">
            &copy; {new Date().getFullYear()} {SITE.fullName}. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
            <span>Powered by</span>
            <a
              href={SITE.parentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-primary hover:text-primary-500 transition-colors"
            >
              KSW TechZone
            </a>
            <span className="text-[var(--border)]">|</span>
            <a
              href={SITE.founderUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-primary transition-colors"
            >
              <Heart size={10} />
              Sanjay Kumar Singh
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
