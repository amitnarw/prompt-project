'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { PromptCard } from '@/components/PromptCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FilterSidebar, type FilterState } from '@/components/FilterSidebar';
import { Loader2, Search, Plus, SlidersHorizontal, X } from 'lucide-react';
import Link from 'next/link';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'mostWorks', label: 'Most Works' },
  { value: 'mostDoesntWork', label: 'Most Doesnt Work' },
  { value: 'alphabetical', label: 'Alphabetical' },
];

const CATEGORIES = ['Writing', 'Coding', 'Analysis', 'Creative', 'Education', 'Business', 'Marketing', 'Development', 'Productivity', 'Travel', 'Career', 'Health & Fitness', 'Cooking', 'Content Creation', 'Wellness', 'Legal', 'Events', 'Education'];
const TAGS = ['ai', 'gpt', 'claude', 'gemini', 'writing', 'coding', 'creative', 'productivity', 'programming', 'sql', 'database', 'api', 'documentation', 'debugging', 'tutoring', 'learning', 'interview', 'job-search', 'resume', 'career', 'professional', 'email', 'communication', 'marketing', 'social-media', 'seo', 'content', 'blog', 'video', 'youtube', 'scriptwriting', 'presentation', 'business', 'meeting', 'notes', 'fitness', 'workout', 'health', 'recipes', 'cooking', 'travel', 'vacation', 'planning'];
const MODEL_TYPES = ['GPT-4', 'Claude', 'Gemini', 'Llama', 'Other'];

export default function HomePage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    category: '',
    tags: [],
    sortBy: 'newest',
    isVerified: false,
    modelType: '',
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: ['prompts', page, debouncedSearch, filters],
    queryFn: () =>
      api.prompts.getAll({
        page,
        limit: 12,
        search: debouncedSearch || undefined,
        category: filters.category || undefined,
        tags: filters.tags.length > 0 ? filters.tags : undefined,
        sortBy: filters.sortBy as any,
        isVerified: filters.isVerified || undefined,
        modelType: filters.modelType || undefined,
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

  if (isError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-destructive">Error</CardTitle>
            <CardDescription>Failed to load prompts. Please try again.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Prompt Library</h1>
          <p className="text-muted-foreground mt-1">
            Discover and share AI prompts
          </p>
        </div>
        <Link href="/prompts/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Create Prompt
          </Button>
        </Link>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex gap-2 mb-6">
        <form onSubmit={handleSearch} className="flex-1 flex gap-2">
          <Input
            type="search"
            placeholder="Search prompts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" variant="secondary">
            <Search className="h-4 w-4" />
          </Button>
        </form>
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="gap-2"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
        </Button>
      </div>

      {/* Filter Sidebar (mobile) / Drawer */}
      {showFilters && (
        <div className="lg:hidden mb-6 p-4 border rounded-lg bg-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Filters</h3>
            <Button variant="ghost" size="sm" onClick={() => setShowFilters(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <FilterSidebar
            filters={filters}
            onFiltersChange={setFilters}
            categories={CATEGORIES}
            availableTags={TAGS}
            modelTypes={MODEL_TYPES}
          />
        </div>
      )}

      {/* Desktop Layout with Sidebar */}
      <div className="flex gap-8">
        {/* Desktop Filter Sidebar */}
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-4">
            <FilterSidebar
              filters={filters}
              onFiltersChange={setFilters}
              categories={CATEGORIES}
              availableTags={TAGS}
              modelTypes={MODEL_TYPES}
            />
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : data?.data.length === 0 ? (
            <Card className="max-w-md mx-auto">
              <CardHeader>
                <CardTitle>No prompts found</CardTitle>
                <CardDescription>
                  {debouncedSearch || filters.category || filters.tags.length > 0
                    ? 'Try different filters'
                    : 'Be the first to create a prompt!'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/prompts/new">
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Create Prompt
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {data?.data.map((prompt) => (
                  <PromptCard key={prompt.id} prompt={prompt} />
                ))}
              </div>

              {data && data.pagination.totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                  <Button
                    variant="outline"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    Previous
                  </Button>
                  <span className="flex items-center px-4 text-sm text-muted-foreground">
                    Page {page} of {data.pagination.totalPages}
                  </span>
                  <Button
                    variant="outline"
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
      </div>
    </div>
  );
}
