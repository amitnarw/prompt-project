'use client';

import React, { useEffect, useRef } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useRouter } from 'next/navigation';
import { motion, useScroll, useTransform } from 'motion/react';

export default function AboutPage() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);

  return (
    <div ref={containerRef} className="min-h-screen flex flex-col bg-background overflow-hidden relative">
      <Navbar activeTab="about" onTabChange={(tab) => router.push(tab === 'home' ? '/' : `/${tab}`)} />

      <div className="flex-grow relative">
        {/* Hero Section with parallax */}
        <motion.section className="h-screen flex items-center justify-center relative overflow-hidden" style={{ y: y1 }}>
          <div className="absolute inset-0">
            <motion.div
              animate={{
                scale: [1, 1.2, 1.2, 1],
                opacity: [0.3, 0.5, 0.5, 0.3],
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 bg-gradient-radial from-accent-orange/20 via-transparent to-transparent"
            />
          </div>

          <div className="text-center z-10 px-4">
            <motion.h1
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="font-headline text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tighter text-on-surface mb-6"
            >
              PROMPT HUB
            </motion.h1>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="h-px bg-gradient-to-r from-transparent via-tertiary to-transparent mb-8 mx-auto w-full max-w-md"
            />
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="font-label text-sm md:text-base uppercase tracking-[0.3em] text-on-surface-variant"
            >
              Engineered for Precision
            </motion.p>
          </div>

          {/* Floating decorative elements */}
          <motion.div
            animate={{ y: [-10, 10, -10], rotate: [0, 5, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/4 left-1/4 w-2 h-2 bg-tertiary rounded-full opacity-60"
          />
          <motion.div
            animate={{ y: [10, -10, 10], rotate: [0, -5, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/3 right-1/4 w-3 h-3 border border-tertiary/40 rounded-full"
          />
          <motion.div
            animate={{ y: [-8, 8, -8], x: [5, -5, 5] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-1/3 left-1/3 w-1.5 h-1.5 bg-accent-orange rounded-full opacity-50"
          />
        </motion.section>

        {/* Stats Section with staggered reveal */}
        <motion.section
          style={{ opacity }}
          className="py-32 px-8 relative"
        >
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12"
            >
              {[
                { number: '500+', label: 'Curated Prompts' },
                { number: '4', label: 'AI Models' },
                { number: '50K+', label: 'Active Users' },
                { number: '99.9%', label: 'Uptime' },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <p className="font-headline text-3xl md:text-5xl font-extrabold text-on-surface mb-2">{stat.number}</p>
                  <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.section>

        {/* Mission Section with scroll animation */}
        <motion.section
          style={{ y: y2 }}
          className="py-32 px-8 relative"
        >
          <div className="max-w-4xl mx-auto text-center">
            <motion.p
              initial={{ opacity: 0, clipPath: "inset(100% 0% 0% 0%)" }}
              whileInView={{ opacity: 1, clipPath: "inset(0% 0% 0% 0%)" }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true }}
              className="font-headline text-2xl md:text-4xl lg:text-5xl font-bold text-on-surface leading-relaxed mb-8"
            >
              We believe in the power of{' '}
              <span className="text-tertiary">precise communication</span>{' '}
              between humans and AI.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="text-on-surface-variant text-lg leading-relaxed"
            >
              Prompt Hub is a curated repository of expertly crafted language model protocols,
              designed to help developers and AI enthusiasts achieve consistent, high-quality results.
            </motion.p>
          </div>
        </motion.section>

        {/* Features Grid */}
        <section className="py-32 px-8">
          <div className="max-w-6xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant text-center mb-16"
            >
              What We Offer
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: 'Verified Protocols',
                  desc: 'Prompts tested and validated by our team for consistent performance.',
                  icon: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.13a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.13-1.593a3.745 3.745 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.13a3.745 3.745 0 011.043-3.296 3.745 3.745 0 013.296-1.043A3.745 3.745 0 0112 3c1.268 0 2.39.63 3.13 1.593a3.745 3.745 0 013.296 1.043 3.745 3.745 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                    </svg>
                  ),
                },
                {
                  title: 'Playground',
                  desc: 'Test and refine prompts in real-time with multiple AI models.',
                  icon: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" />
                    </svg>
                  ),
                },
                {
                  title: 'Collections',
                  desc: 'Save and organize your favorite prompts into personalized collections.',
                  icon: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
                    </svg>
                  ),
                },
              ].map((feature, i) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -8, transition: { duration: 0.3 } }}
                  transition={{ duration: 0.6, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
                  viewport={{ once: true }}
                  className="p-8 bg-surface-container border border-outline-variant/10 hover:border-tertiary/30 transition-colors cursor-pointer group"
                >
                  <div className="text-tertiary mb-6 group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="font-headline font-bold text-xl text-on-surface mb-3">{feature.title}</h3>
                  <p className="text-on-surface-variant text-sm leading-relaxed">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32 px-8 text-center relative">
          <motion.div
            animate={{ opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 bg-gradient-to-t from-accent-orange/10 via-transparent to-transparent pointer-events-none"
          />
          <div className="relative z-10 max-w-2xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="font-headline text-3xl md:text-4xl font-extrabold text-on-surface mb-6"
            >
              Ready to Get Started?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-on-surface-variant mb-8"
            >
              Join thousands of developers using precision-crafted prompts.
            </motion.p>
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.3 }}
              viewport={{ once: true }}
              onClick={() => router.push('/')}
              className="px-8 py-4 bg-on-surface text-background font-label text-sm uppercase tracking-widest hover:opacity-90 transition-all cursor-pointer"
            >
              Explore Prompts
            </motion.button>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}