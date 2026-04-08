'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export default function CollectionsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSession().then(data => {
      if (!data?.user) {
        router.push('/explore');
      } else {
        setLoading(false);
      }
    });
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar activeTab="collections" onTabChange={(tab) => router.push(tab === 'home' ? '/' : `/${tab}`)} />
        <div className="flex-grow pt-16 flex items-center justify-center">
          <div className="text-on-surface-variant font-label text-xs uppercase tracking-widest">Loading...</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar activeTab="collections" onTabChange={(tab) => router.push(tab === 'home' ? '/' : `/${tab}`)} />
      <div className="flex-grow pt-32 px-8 max-w-7xl mx-auto text-center">
        <h2 className="text-4xl font-extrabold uppercase tracking-tighter mb-4">Collections</h2>
        <p className="text-on-surface-variant font-label text-sm uppercase tracking-widest">Your saved prompt collections will appear here.</p>
      </div>
      <Footer />
    </div>
  );
}