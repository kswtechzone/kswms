'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Book, Terminal, Users, Shield, Zap, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/marketing/layout/Header';
import Footer from '@/components/marketing/layout/Footer';
import SectionHeading from '@/components/marketing/ui/SectionHeading';

const docSections = [
  { icon: Book, title: 'Getting Started', description: 'Learn the basics of setting up your KSWMS account and configuring your first organization.', links: ['Quick Start Guide', 'Account Setup', 'Organization Configuration', 'User Roles & Permissions'] },
  { icon: Users, title: 'User Management', description: 'Manage staff accounts, roles, permissions, and team collaboration settings.', links: ['Adding Users', 'Role-Based Access', 'Team Management', 'Authentication'] },
  { icon: Terminal, title: 'API Reference', description: 'Comprehensive API documentation for integrating KSWMS with your existing tools.', links: ['Authentication', 'Endpoints', 'Webhooks', 'Rate Limits'] },
  { icon: Shield, title: 'Security & Compliance', description: 'Understand our security practices, data protection measures, and compliance certifications.', links: ['Data Encryption', 'Backup Policy', 'Compliance', 'Security Best Practices'] },
  { icon: Zap, title: 'Modules Guide', description: 'Detailed guides for each module: Hotel, Restaurant, HR, Inventory, Finance, and more.', links: ['Hotel Management', 'Restaurant POS', 'HR & Attendance', 'Inventory', 'Finance & Billing'] },
  { icon: Book, title: 'Tutorials & FAQs', description: 'Step-by-step tutorials and answers to common questions about using KSWMS.', links: ['Video Tutorials', 'Common Workflows', 'Troubleshooting', 'FAQ'] },
];

export default function DocsPage() {
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
            title="Documentation"
            subtitle="Everything you need to get started with KSWMS. Comprehensive guides, API references, and best practices."
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {docSections.map((section, i) => {
              const Icon = section.icon;
              return (
                <motion.div
                  key={section.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] hover:border-primary/30 transition-all"
                >
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center mb-4">
                    <Icon size={22} className="text-primary" />
                  </div>
                  <h3 className="text-base font-semibold text-[var(--text-main)] mb-2">{section.title}</h3>
                  <p className="text-sm text-[var(--text-muted)] mb-4">{section.description}</p>
                  <ul className="space-y-2">
                    {section.links.map((link) => (
                      <li key={link}>
                        <a href="#" className="flex items-center gap-1.5 text-sm text-primary hover:text-primary-500 transition-colors">
                          {link}
                          <ExternalLink size={12} />
                        </a>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="mt-16 text-center p-12 rounded-2xl border border-[var(--border)] bg-[var(--bg-card)]"
          >
            <h3 className="text-xl font-semibold text-[var(--text-main)] mb-2">Need Help?</h3>
            <p className="text-[var(--text-muted)] mb-6 max-w-md mx-auto">
              Our support team is available 24/7 to help you with any questions.
            </p>
            <a
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary-500 transition-all"
            >
              Contact Support
            </a>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
