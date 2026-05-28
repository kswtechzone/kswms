'use client';

import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import SectionHeading from '../ui/SectionHeading';
import { TESTIMONIALS } from '@/lib/constants';

const companyLogos = ['Hotel Grand', 'Mountain View', 'Nepal Biz', 'Sunrise Edu', 'City Clinic', 'TechHubs'];

export default function TestimonialsSection() {
  return (
    <section className="relative py-20 sm:py-28 lg:py-32 bg-[var(--bg-main)] overflow-hidden">
      <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-gradient-to-l from-primary/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Trusted by Industry Leaders"
          subtitle="Hear from the businesses that rely on KSWMS to power their operations every day."
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {TESTIMONIALS.map((testimonial, i) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative p-6 sm:p-8 rounded-2xl border border-[var(--border)] bg-[var(--bg-card)]"
            >
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, j) => (
                  <Star key={j} size={16} className="fill-accent text-accent" />
                ))}
              </div>
              <blockquote className="text-sm text-[var(--text-muted)] leading-relaxed mb-6">
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-sm font-semibold">
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold text-[var(--text-main)]">{testimonial.name}</p>
                  <p className="text-xs text-[var(--text-muted)]">
                    {testimonial.title}, {testimonial.company}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="text-sm text-[var(--text-muted)] mb-6">Trusted by businesses across Nepal and beyond</p>
          <div className="flex flex-wrap justify-center gap-8 sm:gap-12 opacity-50">
            {companyLogos.map((name) => (
              <div
                key={name}
                className="h-8 flex items-center text-sm font-bold tracking-wider text-[var(--text-muted)] uppercase"
              >
                {name}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
