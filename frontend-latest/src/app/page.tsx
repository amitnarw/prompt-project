'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { PromptCard } from '@/components/PromptCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Search, Plus, X, Filter, ChevronDown } from 'lucide-react';
import Link from 'next/link';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'mostWorks', label: 'Most Works' },
  { value: 'alphabetical', label: 'A-Z' },
];

const CATEGORIES = ['Writing', 'Coding', 'Analysis', 'Creative', 'Education', 'Business', 'Marketing', 'Development', 'Productivity', 'Travel', 'Career'];

export default function HomePage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showVerified, setShowVerified] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['prompts', page, debouncedSearch, sortBy, selectedCategory, showVerified],
    queryFn: () =>
      api.prompts.getAll({
        page,
        limit: 9,
        search: debouncedSearch || undefined,
        category: selectedCategory || undefined,
        sortBy: sortBy as any,
        isVerified: showVerified || undefined,
      }),
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setDebouncedSearch(search);
    setPage(1);
  };

  const clearFilters = () => {
    setSortBy('newest');
    setSelectedCategory('');
    setShowVerified(false);
    setSearch('');
    setDebouncedSearch('');
  };

  const hasActiveFilters = selectedCategory || showVerified || search;

  if (isError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-[#ee7d77]">Error</CardTitle>
            <CardDescription className="text-[#acabaa]">Failed to load prompts. Please try again.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#e7e5e4]">Prompt Library</h1>
          <p className="text-[#acabaa] text-sm">
            Discover and share AI prompts
          </p>
        </div>
        <Link href="/prompts/new">
          <Button size="sm" className="gap-2">
            <Plus className="h-3 w-3" />
            Create Prompt
          </Button>
        </Link>
      </div>

      {/* Compact Search & Filters Row */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        {/* Search */}
        <form onSubmit={handleSearch} className="flex-1 min-w-[200px] max-w-md">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#acabaa]" />
            <Input
              type="search"
              placeholder="Search prompts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 h-9 text-sm"
            />
          </div>
        </form>

        {/* Sort Dropdown */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="h-9 px-3 text-sm border border-[rgba(72,72,72,0.15)] bg-[#131313] text-[#e7e5e4]"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>

        {/* Verified Toggle */}
        <Badge
          variant={showVerified ? 'default' : 'outline'}
          className="cursor-pointer h-9 px-3"
          onClick={() => setShowVerified(!showVerified)}
        >
          Verified
        </Badge>

        {/* More Filters Toggle */}
        <Button
          variant="outline"
          size="sm"
          className="h-9 gap-1"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter className="h-3.5 w-3.5" />
          Filters
          <ChevronDown className={`h-3 w-3 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
        </Button>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="h-9 gap-1 text-[#acabaa]">
            <X className="h-3 w-3" />
            Clear
          </Button>
        )}
      </div>

      {/* Expandable Category Filters */}
      {showFilters && (
        <div className="flex flex-wrap gap-2 mb-4 pb-4">
          {CATEGORIES.map((cat) => (
            <Badge
              key={cat}
              variant={selectedCategory === cat ? 'default' : 'outline'}
              className="cursor-pointer px-2.5 py-1 text-xs"
              onClick={() => setSelectedCategory(selectedCategory === cat ? '' : cat)}
            >
              {cat}
            </Badge>
          ))}
        </div>
      )}

      {/* Results */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-[#acabaa]" />
        </div>
      ) : data?.data.length === 0 ? (
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-[#e7e5e4]">No prompts found</CardTitle>
            <CardDescription className="text-[#acabaa]">
              {hasActiveFilters ? 'Try different filters' : 'Be the first to create a prompt!'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {hasActiveFilters ? (
              <Button variant="outline" onClick={clearFilters}>Clear Filters</Button>
            ) : (
              <Link href="/prompts/new">
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Create Prompt
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data?.data.map((prompt) => (
              <PromptCard key={prompt.id} prompt={prompt} />
            ))}
          </div>

          {data && data.pagination.totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              <span className="flex items-center px-4 text-sm text-[#acabaa]">
                Page {page} of {data.pagination.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => p + 1)}
                disabled={page >= data.pagination.totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
