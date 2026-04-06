'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Search, ChevronLeft, ChevronRight, Loader2, AlertCircle } from 'lucide-react';
import { PromptProtocol, BackendPrompt, mapBackendPrompt } from '../types';
import { api, PaginatedResponse } from '../lib/api';
import { PromptCard } from './PromptCard';

interface ExplorePageProps {
  onPromptClick: (prompt: PromptProtocol) => void;
  onRun: (prompt: PromptProtocol) => void;
}

const ITEMS_PER_PAGE = 9;
const MODEL_FILTERS = ['GPT-4', 'Claude', 'Llama', 'Gemini'];
const SORT_OPTIONS = [
  { label: 'Newest', value: 'newest' },
  { label: 'Most Works', value: 'mostWorks' },
  { label: 'A-Z', value: 'alphabetical' },
];

export const ExplorePage: React.FC<ExplorePageProps> = ({ onPromptClick, onRun }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);

  const [prompts, setPrompts] = useState<PromptProtocol[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: ITEMS_PER_PAGE,
    total: 0,
    totalPages: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounce search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 400);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchQuery]);

  const fetchPrompts = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        page: String(currentPage),
        limit: String(ITEMS_PER_PAGE),
        sortBy,
      });
      if (debouncedSearch) params.set('search', debouncedSearch);
      if (selectedModel) params.set('modelType', selectedModel);
      if (verifiedOnly) params.set('isVerified', 'true');

      const result = await api.get<PaginatedResponse<BackendPrompt>>(`/api/prompts?${params}`);

      if (result.success && result.data) {
        setPrompts(result.data.map(mapBackendPrompt));
        setPagination(result.pagination || { page: 1, limit: ITEMS_PER_PAGE, total: 0, totalPages: 0 });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load prompts');
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, debouncedSearch, selectedModel, verifiedOnly, sortBy]);

  useEffect(() => {
    fetchPrompts();
  }, [fetchPrompts]);

  const handleModelFilter = (model: string) => {
    setSelectedModel(prev => (prev === model ? null : model));
    setCurrentPage(1);
  };

  const totalPages = pagination.totalPages;

  const getPageNumbers = () => {
    const pages: (number | '...')[] = [];
    if (totalPages <= 6) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1, 2, 3);
      if (currentPage > 4) pages.push('...');
      if (currentPage > 3 && currentPage < totalPages - 2) {
        pages.push(currentPage);
      }
      if (currentPage < totalPages - 3) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="pt-32 pb-24 px-8 max-w-7xl mx-auto relative min-h-screen">
      <div className="fixed inset-0 radial-glow pointer-events-none -z-10"></div>

      <header className="mb-16">
        <h1 className="font-headline font-extrabold text-6xl tracking-tight mb-4">EXPLORE_INDEX</h1>
        <p className="font-label text-on-surface-variant tracking-widest text-sm uppercase">
          Curated repository of precision engineered language models protocols.
        </p>
      </header>

      {/* Filters Section */}
      <section className="mb-12 flex flex-col gap-8 bg-surface-container p-8 border-0 shadow-none">
        <div className="flex flex-col md:flex-row gap-6 justify-between items-end">
          {/* Search */}
          <div className="w-full md:w-1/2">
            <label className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-2 block">
              Search_Query
            </label>
            <div className="relative flex items-center">
              <input
                className="w-full bg-surface-container-low border-b border-outline-variant/30 focus:border-tertiary-dim/50 text-on-surface px-0 py-3 font-headline text-lg focus:ring-0 transition-all outline-none"
                placeholder="QUERY_BY_SYSTEM_ROLE..."
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
          <div className="flex flex-col gap-3">
            <div className="flex flex-col">
              <label className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-2 block">
                Model_Family
              </label>
              <div className="flex gap-2 flex-wrap">
                {MODEL_FILTERS.map(model => (
                  <button
                    key={model}
                    onClick={() => handleModelFilter(model)}
                    className={`px-4 py-2 font-label text-xs uppercase tracking-tighter border-0 transition-colors ${
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
            <div className="flex gap-2">
              <label className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant self-center">Sort:</label>
              {SORT_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => { setSortBy(opt.value); setCurrentPage(1); }}
                  className={`px-3 py-1 font-label text-[10px] uppercase tracking-tighter border-0 transition-colors ${
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

        {/* Tags / Verified */}
        <div className="flex flex-wrap items-center justify-between gap-6 pt-6 border-t border-outline-variant/10">
          <div className="flex flex-wrap gap-3">
            <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mr-4">Category:</span>
            {['Development', 'Business', 'Marketing', 'Writing', 'Education'].map(cat => (
              <button
                key={cat}
                onClick={() => setSearchQuery(cat)}
                className="font-label text-xs uppercase tracking-tighter text-on-surface-variant border-0 px-3 py-1 hover:text-white transition-colors"
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">Verified_Only</span>
              <button
                onClick={() => { setVerifiedOnly(v => !v); setCurrentPage(1); }}
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

      {/* Error State */}
      {error && (
        <div className="flex items-center gap-3 p-6 bg-surface-container border-l-2 border-red-500/50 mb-8">
          <AlertCircle size={18} className="text-red-400" />
          <div>
            <p className="font-label text-xs uppercase tracking-widest text-red-400">Connection Error</p>
            <p className="text-sm text-on-surface-variant mt-1">{error} — Make sure the backend is running on port 5000.</p>
          </div>
          <button onClick={fetchPrompts} className="ml-auto font-label text-xs uppercase tracking-widest text-tertiary hover:text-white transition-colors">
            Retry
          </button>
        </div>
      )}

      {/* Loading State */}
      {isLoading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="bg-surface-container-low p-6 animate-pulse">
              <div className="h-3 w-20 bg-surface-container-highest mb-4 rounded" />
              <div className="h-6 w-3/4 bg-surface-container-highest mb-3 rounded" />
              <div className="h-4 w-full bg-surface-container-highest mb-2 rounded" />
              <div className="h-4 w-5/6 bg-surface-container-highest rounded" />
            </div>
          ))}
        </div>
      )}

      {/* Prompts Grid */}
      {!isLoading && !error && (
        <>
          {prompts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-on-surface-variant">
              <p className="font-headline text-2xl uppercase tracking-tight mb-2">No_Results</p>
              <p className="font-label text-xs uppercase tracking-widest">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {prompts.map(prompt => (
                <PromptCard
                  key={prompt.id}
                  prompt={prompt}
                  onClick={onPromptClick}
                  onRun={onRun}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-16 flex items-center justify-between border-t border-outline-variant/10 pt-8">
              <div className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">
                Showing_Results [{(currentPage - 1) * ITEMS_PER_PAGE + 1}-{Math.min(currentPage * ITEMS_PER_PAGE, pagination.total)}] of [{pagination.total.toLocaleString()}]
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="w-10 h-10 flex items-center justify-center bg-surface-container-highest text-on-surface hover:bg-tertiary/10 transition-colors disabled:opacity-30"
                >
                  <ChevronLeft size={18} />
                </button>
                {getPageNumbers().map((page, idx) =>
                  page === '...' ? (
                    <span key={`ellipsis-${idx}`} className="px-3 text-on-surface-variant">...</span>
                  ) : (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page as number)}
                      className={`w-10 h-10 flex items-center justify-center font-label text-xs transition-colors ${
                        currentPage === page
                          ? 'bg-tertiary text-background font-bold'
                          : 'bg-surface-container text-on-surface-variant hover:text-white'
                      }`}
                    >
                      {String(page).padStart(2, '0')}
                    </button>
                  )
                )}
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="w-10 h-10 flex items-center justify-center bg-surface-container-highest text-on-surface hover:bg-tertiary/10 transition-colors disabled:opacity-30"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
