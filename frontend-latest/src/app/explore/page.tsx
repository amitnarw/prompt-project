'use client';

import React from 'react';
import { ExplorePage } from '@/components/ExplorePage';
import { PromptModal } from '@/components/PromptModal';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { PromptProtocol } from '@/types';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { AnimatePresence } from 'motion/react';

export default function ExplorePageWrapper() {
  const router = useRouter();
  const [selectedPrompt, setSelectedPrompt] = useState<PromptProtocol | null>(null);

  const handleRun = (_prompt: PromptProtocol) => {
    router.push('/playground');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar activeTab="explore" onTabChange={(tab) => router.push(tab === 'home' ? '/' : `/${tab}`)} />
      <div className="flex-grow">
        <ExplorePage
          onPromptClick={setSelectedPrompt}
          onRun={handleRun}
        />
        <AnimatePresence mode="wait">
          {selectedPrompt && (
            <PromptModal
              key={selectedPrompt.id}
              prompt={selectedPrompt}
              onClose={() => setSelectedPrompt(null)}
              onRun={handleRun}
            />
          )}
        </AnimatePresence>
      </div>
      <Footer />
    </div>
  );
}