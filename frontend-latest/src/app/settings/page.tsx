'use client';

import React, { useState, useEffect, useRef } from 'react';
import { getSession, User } from '@/lib/auth';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useRouter } from 'next/navigation';
import { ChevronDown, Check } from 'lucide-react';

interface DropdownButtonProps {
  value: string;
  options: { label: string; value: string }[];
  onChange: (value: string) => void;
  className?: string;
}

const DropdownButton: React.FC<DropdownButtonProps> = ({ value, options, onChange, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const selected = options.find(o => o.value === value);

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-surface-container-low border border-outline-variant/30 text-on-surface font-label text-xs uppercase tracking-widest hover:border-outline-variant/60 transition-all cursor-pointer min-w-35 justify-between"
      >
        <span>{selected?.label || 'Select'}</span>
        <ChevronDown size={12} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="absolute right-0 top-full mt-1 w-full bg-surface-container border border-outline-variant/30 shadow-xl z-50 min-w-35">
          {options.map(option => (
            <button
              key={option.value}
              onClick={() => { onChange(option.value); setIsOpen(false); }}
              className="w-full flex items-center justify-between px-3 py-2 text-on-surface font-label text-xs uppercase tracking-widest hover:bg-surface-container-highest transition-colors cursor-pointer first:rounded-t last:rounded-b"
            >
              <span>{option.label}</span>
              {value === option.value && <Check size={12} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

interface ToggleProps {
  value: boolean;
  onChange: (value: boolean) => void;
}

const Toggle: React.FC<ToggleProps> = ({ value, onChange }) => {
  return (
    <button
      onClick={() => onChange(!value)}
      className={`w-10 h-5 p-1 flex items-center cursor-pointer transition-colors ${value ? 'bg-tertiary' : 'bg-surface-container-highest'}`}
    >
      <div className={`w-3 h-3 bg-white rounded-full transition-transform ${value ? 'translate-x-5' : 'translate-x-0'}`} />
    </button>
  );
};

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('all');
  const [aiModelFamily, setAiModelFamily] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [resultsPerPage, setResultsPerPage] = useState('9');
  const [compactView, setCompactView] = useState(false);

  useEffect(() => {
    getSession().then(data => {
      if (data?.user) setUser(data.user);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar activeTab="settings" onTabChange={(tab) => router.push(tab === 'home' ? '/' : `/${tab}`)} />
        <div className="grow pt-32 px-8 max-w-3xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-32 bg-surface-container-highest rounded" />
            <div className="h-4 w-48 bg-surface-container-highest rounded" />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const categoryOptions = [
    { label: 'All Categories', value: 'all' },
    { label: 'Development', value: 'development' },
    { label: 'Business', value: 'business' },
    { label: 'Marketing', value: 'marketing' },
    { label: 'Writing', value: 'writing' },
    { label: 'Education', value: 'education' },
  ];

  const modelOptions = [
    { label: 'All Models', value: 'all' },
    { label: 'GPT-4', value: 'gpt4' },
    { label: 'Claude', value: 'claude' },
    { label: 'Llama', value: 'llama' },
    { label: 'Gemini', value: 'gemini' },
  ];

  const sortOptions = [
    { label: 'Newest', value: 'newest' },
    { label: 'Most Works', value: 'most_works' },
    { label: 'A-Z', value: 'az' },
  ];

  const resultsOptions = [
    { label: '9', value: '9' },
    { label: '18', value: '18' },
    { label: '27', value: '27' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar activeTab="settings" onTabChange={(tab) => router.push(tab === 'home' ? '/' : `/${tab}`)} />
      <div className="grow pt-32 pb-24 px-8 max-w-3xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl font-extrabold uppercase tracking-tight mb-2">Settings</h1>
          <p className="font-label text-on-surface-variant text-sm uppercase tracking-widest">Manage your preferences</p>
        </header>

        <div className="space-y-8">
          {/* Account Section */}
          <section className="p-6 bg-surface-container border border-outline-variant/10">
            <h2 className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-4">Account</h2>
            <div className="space-y-4">
              {user ? (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-headline font-bold text-lg">{user.name || 'User'}</p>
                    <p className="font-label text-xs text-on-surface-variant">{user.email}</p>
                  </div>
                  {user.image && (
                    <img src={user.image} alt="Profile" className="w-12 h-12 rounded-full object-cover border border-outline-variant/20" referrerPolicy="no-referrer" />
                  )}
                </div>
              ) : (
                <p className="font-label text-xs text-on-surface-variant">Sign in to manage your account</p>
              )}
            </div>
          </section>

          {/* Browse Preferences Section */}
          <section className="p-6 bg-surface-container border border-outline-variant/10">
            <h2 className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-4">Browse Preferences</h2>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-headline font-bold">Category</p>
                  <p className="font-label text-xs text-on-surface-variant">Filter prompts by category</p>
                </div>
                <DropdownButton
                  value={category}
                  options={categoryOptions}
                  onChange={setCategory}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-headline font-bold">AI Model Family</p>
                  <p className="font-label text-xs text-on-surface-variant">Preferred AI model for prompts</p>
                </div>
                <DropdownButton
                  value={aiModelFamily}
                  options={modelOptions}
                  onChange={setAiModelFamily}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-headline font-bold">Default Sort</p>
                  <p className="font-label text-xs text-on-surface-variant">How prompts are ordered</p>
                </div>
                <DropdownButton
                  value={sortBy}
                  options={sortOptions}
                  onChange={setSortBy}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-headline font-bold">Results Per Page</p>
                  <p className="font-label text-xs text-on-surface-variant">Number of prompts shown</p>
                </div>
                <DropdownButton
                  value={resultsPerPage}
                  options={resultsOptions}
                  onChange={setResultsPerPage}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-headline font-bold">Compact View</p>
                  <p className="font-label text-xs text-on-surface-variant">Show smaller cards</p>
                </div>
                <Toggle
                  value={compactView}
                  onChange={setCompactView}
                />
              </div>
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
}
