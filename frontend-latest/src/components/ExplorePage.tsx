'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { PromptProtocol, BackendPrompt, mapBackendPrompt } from '../types';
import { api, PaginatedResponse } from '../lib/api';
import { FilterSection } from './FilterSection';
import { PromptsGrid } from './PromptsGrid';
import { Pagination } from './Pagination';
import { LoadingSkeleton } from './LoadingSkeleton';
import { ErrorBanner } from './ErrorBanner';

interface ExplorePageProps {
  onPromptClick: (prompt: PromptProtocol) => void;
  onRun: (prompt: PromptProtocol) => void;
}

const ITEMS_PER_PAGE = 9;

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

  return (
    <div className="pt-32 pb-24 px-4 md:px-8 max-w-7xl mx-auto relative min-h-screen">
      <div className="fixed inset-0 radial-glow pointer-events-none -z-10"></div>

      <header className="mb-12 md:mb-16">
        <h1 className="font-headline font-extrabold text-4xl md:text-6xl tracking-tight mb-4">EXPLORE INDEX</h1>
        <p className="font-label text-on-surface-variant tracking-widest text-xs md:text-sm uppercase">
          Curated repository of precision engineered language models protocols.
        </p>
      </header>

      <FilterSection
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedModel={selectedModel}
        setSelectedModel={setSelectedModel}
        verifiedOnly={verifiedOnly}
        setVerifiedOnly={setVerifiedOnly}
        sortBy={sortBy}
        setSortBy={setSortBy}
        isLoading={isLoading}
        debouncedSearch={debouncedSearch}
      />

      {error && (
        <ErrorBanner error={error} onRetry={fetchPrompts} />
      )}

      {isLoading && !error && (
        <LoadingSkeleton />
      )}

      {!isLoading && !error && (
        <PromptsGrid
          prompts={prompts}
          onPromptClick={onPromptClick}
          onRun={onRun}
        />
      )}

      {!isLoading && !error && (
        <Pagination
          currentPage={currentPage}
          totalPages={pagination.totalPages}
          total={pagination.total}
          onPageChange={setCurrentPage}
          itemsPerPage={ITEMS_PER_PAGE}
        />
      )}
    </div>
  );
};
