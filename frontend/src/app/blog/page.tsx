'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, User, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/marketing/layout/Header';
import Footer from '@/components/marketing/layout/Footer';
import SectionHeading from '@/components/marketing/ui/SectionHeading';
import Badge from '@/components/marketing/ui/Badge';

const posts = [
  {
    title: 'How Multi-Tenant Architecture Transforms Business Management',
    excerpt: 'Discover how multi-tenant SaaS architecture enables businesses to manage multiple branches, properties, or units from a single, unified platform.',
    date: 'May 15, 2026',
    author: 'KSW TechZone Team',
    category: 'Technology',
    readTime: '5 min read',
  },
  {
    title: 'The Future of Hotel Management in Nepal: Digital Transformation',
    excerpt: 'Explore how Nepali hotels are embracing digital management systems to enhance guest experiences, streamline operations, and boost revenue.',
    date: 'May 10, 2026',
    author: 'KSW TechZone Team',
    category: 'Hospitality',
    readTime: '7 min read',
  },
  {
    title: 'Top 10 Features to Look for in a Restaurant Management System',
    excerpt: 'From POS integration to inventory tracking, learn the essential features that make a restaurant management system truly effective.',
    date: 'May 5, 2026',
    author: 'KSW TechZone Team',
    category: 'Restaurant',
    readTime: '6 min read',
  },
  {
    title: 'Cloud Security Best Practices for SaaS Platforms',
    excerpt: 'Learn about the security measures and best practices that protect your business data in the cloud, from encryption to access control.',
    date: 'April 28, 2026',
    author: 'KSW TechZone Team',
    category: 'Security',
    readTime: '8 min read',
  },
  {
    title: 'Why Your Business Needs an ERP System in 2026',
    excerpt: 'In an increasingly competitive landscape, an integrated ERP system is no longer a luxury — it&apos;s a necessity for growth.',
    date: 'April 20, 2026',
    author: 'KSW TechZone Team',
    category: 'Business',
    readTime: '4 min read',
  },
  {
    title: 'From Paper to Digital: Modernizing School Administration',
    excerpt: 'See how educational institutions are transitioning from traditional paper-based systems to comprehensive digital management platforms.',
    date: 'April 15, 2026',
    author: 'KSW TechZone Team',
    category: 'Education',
    readTime: '5 min read',
  },
];

export default function BlogPage() {
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

          <SectionHeading
            title="Blog & Insights"
            subtitle="Thoughts on management, technology, and business transformation from the KSW TechZone team."
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, i) => (
              <motion.article
                key={post.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="group rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] overflow-hidden hover:border-primary/30 transition-all"
              >
                <div className="h-48 bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                  <div className="text-4xl opacity-20 group-hover:scale-110 transition-transform duration-300">📄</div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Badge>{post.category}</Badge>
                    <span className="text-xs text-[var(--text-muted)]">{post.readTime}</span>
                  </div>
                  <h3 className="text-base font-semibold text-[var(--text-main)] mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-sm text-[var(--text-muted)] line-clamp-2 mb-4">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
                    <div className="flex items-center gap-2">
                      <User size={12} />
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={12} />
                      <span>{post.date}</span>
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="mt-12 text-center"
          >
            <p className="text-sm text-[var(--text-muted)]">
              More articles coming soon. Subscribe to our newsletter for updates.
            </p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
