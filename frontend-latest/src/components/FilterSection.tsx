'use client';

import React from 'react';
import { Search, Loader2 } from 'lucide-react';

interface FilterSectionProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedModel: string | null;
  setSelectedModel: (model: string | null) => void;
  verifiedOnly: boolean;
  setVerifiedOnly: (verified: boolean) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  isLoading: boolean;
  debouncedSearch: string;
}

const MODEL_FILTERS = ['GPT-4', 'Claude', 'Llama', 'Gemini'];
const SORT_OPTIONS = [
  { label: 'Newest', value: 'newest' },
  { label: 'Most Works', value: 'mostWorks' },
  { label: 'A-Z', value: 'alphabetical' },
];

export const FilterSection: React.FC<FilterSectionProps> = ({
  searchQuery,
  setSearchQuery,
  selectedModel,
  setSelectedModel,
  verifiedOnly,
  setVerifiedOnly,
  sortBy,
  setSortBy,
  isLoading,
  debouncedSearch,
}) => {
  const handleModelFilter = (model: string) => {
    setSelectedModel(prev => (prev === model ? null : model));
  };

  return (
    <section className="mb-12 flex flex-col gap-8 bg-surface-container p-6 md:p-8 border-0 shadow-none">
      <div className="flex flex-col gap-6 justify-between items-stretch md:items-end">
        {/* Search */}
        <div className="w-full md:w-1/2">
          <label className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-2 block">
            Search Query
          </label>
          <div className="relative flex items-center">
            <input
              className="w-full bg-surface-container-low border-b border-outline-variant/30 focus:border-tertiary/50 text-on-surface px-0 py-3 font-headline text-lg focus:ring-0 transition-all outline-none"
              placeholder="Query by system role..."
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {isLoading && debouncedSearch ? (
              <Loader2 className="absolute right-0 text-tertiary animate-spin" size={20} />
            ) : (
              <Search className="absolute right-0 text-on-surface-variant" size={20} />
            )}
          </div>
        </div>

        {/* Model Filter + Sort */}
        <div className="flex flex-col gap-4 w-full">
          <div className="flex flex-col sm:flex-row gap-4 flex-wrap">
            <div className="flex flex-col">
              <label className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-2 block">
                Model Family
              </label>
              <div className="flex gap-2 flex-wrap">
                {MODEL_FILTERS.map(model => (
                  <button
                    key={model}
                    onClick={() => handleModelFilter(model)}
                    className={`px-3 py-2 font-label text-xs uppercase tracking-tighter border-0 transition-colors cursor-pointer ${
                      selectedModel === model
                        ? 'bg-surface-container-highest text-white'
                        : 'bg-surface-container-low text-on-surface-variant hover:text-white'
                    }`}
                  >
                    {model}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-2 items-center">
              <label className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant self-center">Sort:</label>
              {SORT_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setSortBy(opt.value)}
                  className={`px-3 py-1 font-label text-[10px] uppercase tracking-tighter border-0 transition-colors cursor-pointer ${
                    sortBy === opt.value
                      ? 'bg-tertiary/20 text-tertiary'
                      : 'text-on-surface-variant hover:text-white'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tags / Verified */}
      <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center justify-between gap-4 pt-6 border-t border-outline-variant/10">
        <div className="flex flex-wrap gap-2">
          <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mr-2">Category:</span>
          {['Development', 'Business', 'Marketing', 'Writing', 'Education'].map(cat => (
            <button
              key={cat}
              onClick={() => setSearchQuery(cat)}
              className="font-label text-xs uppercase tracking-tighter text-on-surface-variant border-0 px-3 py-1 hover:text-white transition-colors cursor-pointer"
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">Verified Only</span>
            <button
              onClick={() => setVerifiedOnly(v => !v)}
              className="w-10 h-5 bg-surface-container-highest p-1 flex items-center cursor-pointer transition-all"
            >
              <div
                className={`w-3 h-3 transition-all ${verifiedOnly ? 'bg-tertiary translate-x-4' : 'bg-outline-variant/50'}`}
              />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
