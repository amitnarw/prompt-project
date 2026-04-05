'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface FilterState {
  category: string;
  tags: string[];
  sortBy: string;
  isVerified: boolean;
  modelType: string;
}

interface FilterSidebarProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  categories: string[];
  availableTags: string[];
  modelTypes: string[];
}

export function FilterSidebar({
  filters,
  onFiltersChange,
  categories,
  availableTags,
  modelTypes,
}: FilterSidebarProps) {
  const [search, setSearch] = useState(filters.category);

  const handleCategoryChange = (category: string) => {
    onFiltersChange({ ...filters, category });
  };

  const handleTagToggle = (tag: string) => {
    const newTags = filters.tags.includes(tag)
      ? filters.tags.filter((t) => t !== tag)
      : [...filters.tags, tag];
    onFiltersChange({ ...filters, tags: newTags });
  };

  const handleSortChange = (sortBy: string) => {
    onFiltersChange({ ...filters, sortBy });
  };

  const handleVerifiedChange = (isVerified: boolean) => {
    onFiltersChange({ ...filters, isVerified });
  };

  const handleModelTypeChange = (modelType: string) => {
    onFiltersChange({ ...filters, modelType });
  };

  const clearFilters = () => {
    onFiltersChange({
      category: '',
      tags: [],
      sortBy: 'newest',
      isVerified: false,
      modelType: '',
    });
    setSearch('');
  };

  const hasActiveFilters =
    filters.category ||
    filters.tags.length > 0 ||
    filters.sortBy !== 'newest' ||
    filters.isVerified ||
    filters.modelType;

  return (
    <div className="space-y-6">
      {/* Header with clear */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Filters</h3>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1">
            <X className="h-3 w-3" />
            Clear
          </Button>
        )}
      </div>

      {/* Sort By */}
      <div className="space-y-2">
        <Label>Sort By</Label>
        <select
          className="w-full p-2 border rounded-md text-sm bg-background"
          value={filters.sortBy}
          onChange={(e) => handleSortChange(e.target.value)}
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="mostWorks">Most Works</option>
          <option value="mostDoesntWork">Most Doesnt Work</option>
          <option value="alphabetical">Alphabetical</option>
          <option value="rating">Best Rating</option>
        </select>
      </div>

      {/* Category */}
      <div className="space-y-2">
        <Label>Category</Label>
        <Input
          placeholder="Search categories..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          list="categories"
          className="text-sm"
        />
        <datalist id="categories">
          {categories.map((cat) => (
            <option key={cat} value={cat} />
          ))}
        </datalist>
        {categories
          .filter((c) => c.toLowerCase().includes(search.toLowerCase()))
          .slice(0, 5)
          .map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => handleCategoryChange(cat)}
              className={cn(
                'block w-full text-left px-2 py-1 text-sm rounded hover:bg-accent',
                filters.category === cat && 'bg-accent'
              )}
            >
              {cat}
            </button>
          ))}
      </div>

      {/* Verified Only */}
      <div className="flex items-center space-x-2">
        <Checkbox
          id="verified"
          checked={filters.isVerified}
          onCheckedChange={(checked: boolean | 'indeterminate') => handleVerifiedChange(checked === true)}
        />
        <Label htmlFor="verified" className="text-sm font-normal cursor-pointer">
          Verified only
        </Label>
      </div>

      {/* Model Type */}
      {modelTypes.length > 0 && (
        <div className="space-y-2">
          <Label>Model Type</Label>
          <select
            className="w-full p-2 border rounded-md text-sm bg-background"
            value={filters.modelType}
            onChange={(e) => handleModelTypeChange(e.target.value)}
          >
            <option value="">All Models</option>
            {modelTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Tags */}
      {availableTags.length > 0 && (
        <div className="space-y-2">
          <Label>Tags</Label>
          <div className="flex flex-wrap gap-2">
            {availableTags.slice(0, 15).map((tag) => (
              <Badge
                key={tag}
                variant={filters.tags.includes(tag) ? 'default' : 'outline'}
                className="cursor-pointer text-xs"
                onClick={() => handleTagToggle(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
