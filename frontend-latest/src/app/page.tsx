'use client';

import React, { useState } from 'react';
import { Navbar, Footer } from '@/components/Layout';
import { ExplorePage } from '@/components/ExplorePage';
import { PlaygroundPage } from '@/components/PlaygroundPage';
import { PromptModal } from '@/components/PromptModal';
import { PromptProtocol } from '@/types';

export default function App() {
  const [activeTab, setActiveTab] = useState('explore');
  const [selectedPrompt, setSelectedPrompt] = useState<PromptProtocol | null>(null);
  const [playgroundPrompt, setPlaygroundPrompt] = useState<PromptProtocol | null>(null);

  const handleRun = (prompt: PromptProtocol) => {
    setPlaygroundPrompt(prompt);
    setSelectedPrompt(null);
    setActiveTab('playground');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />
      
      <div className="flex-grow">
        {activeTab === 'explore' && (
          <ExplorePage 
            onPromptClick={setSelectedPrompt} 
            onRun={handleRun}
          />
        )}
        {activeTab === 'playground' && (
          <PlaygroundPage initialPrompt={playgroundPrompt} />
        )}
        {['home', 'collections', 'pricing', 'about'].includes(activeTab) && (
          <div className="pt-32 px-8 max-w-7xl mx-auto text-center">
            <h2 className="text-4xl font-extrabold uppercase tracking-tighter mb-4">{activeTab}</h2>
            <p className="text-on-surface-variant">This section is under development.</p>
            <button 
              onClick={() => setActiveTab('explore')}
              className="mt-8 px-6 py-2 bg-surface-bright text-on-surface font-label text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-all"
            >
              Back to Explore
            </button>
          </div>
        )}
      </div>

      <PromptModal 
        prompt={selectedPrompt} 
        onClose={() => setSelectedPrompt(null)} 
        onRun={handleRun}
      />

      <Footer />
    </div>
  );
}
