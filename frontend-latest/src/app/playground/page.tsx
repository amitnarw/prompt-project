'use client';

import React, { useState, useEffect } from 'react';
import { PlaygroundPage } from '@/components/PlaygroundPage';
import { PromptProtocol } from '@/types';
import { useRouter } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

interface PlaygroundPageWrapperProps {
  initialPrompt?: PromptProtocol | null;
}

export default function PlaygroundPageWrapper({ initialPrompt }: PlaygroundPageWrapperProps) {
  const router = useRouter();
  const [session, setSession] = useState<{ user: { id: string } } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSession().then(data => {
      setSession(data?.user ? data as { user: { id: string } } : null);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar activeTab="playground" onTabChange={(tab) => router.push(tab === 'home' ? '/' : `/${tab}`)} />
        <div className="flex-grow pt-16 flex items-center justify-center">
          <div className="text-on-surface-variant font-label text-xs uppercase tracking-widest">Loading...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar activeTab="playground" onTabChange={(tab) => router.push(tab === 'home' ? '/' : `/${tab}`)} />
        <div className="flex-grow pt-32 flex flex-col items-center justify-center text-center px-8">
          <h2 className="font-headline font-extrabold text-4xl uppercase tracking-tight mb-4">Playground</h2>
          <p className="text-on-surface-variant font-label text-sm uppercase tracking-widest mb-8">Sign in to access the Playground</p>
          <button
            onClick={() => router.push('/explore')}
            className="px-6 py-3 bg-surface-bright text-on-surface font-label text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-all cursor-pointer"
          >
            Back to Explore
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar activeTab="playground" onTabChange={(tab) => router.push(tab === 'home' ? '/' : `/${tab}`)} />
      <div className="flex-grow">
        <PlaygroundPage initialPrompt={initialPrompt || null} />
      </div>
      <Footer />
    </div>
  );
}