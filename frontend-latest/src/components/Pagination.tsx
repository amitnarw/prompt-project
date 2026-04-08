'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  total: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  total,
  onPageChange,
  itemsPerPage,
}) => {
  if (totalPages <= 1) return null;

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

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, total);

  return (
    <div className="mt-16 flex flex-col sm:flex-row gap-4 items-center justify-between border-t border-outline-variant/10 pt-8">
      <div className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">
        Showing Results [{startItem}-{endItem}] of [{total.toLocaleString()}]
      </div>
      <div className="flex items-center gap-1 flex-wrap justify-center">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="w-10 h-10 flex items-center justify-center bg-surface-container-highest text-on-surface hover:bg-tertiary/10 transition-colors disabled:opacity-30 cursor-pointer"
        >
          <ChevronLeft size={18} />
        </button>
        {getPageNumbers().map((page, idx) =>
          page === '...' ? (
            <span key={`ellipsis-${idx}`} className="px-3 text-on-surface-variant">...</span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page as number)}
              className={`w-10 h-10 flex items-center justify-center font-label text-xs transition-colors cursor-pointer ${
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
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="w-10 h-10 flex items-center justify-center bg-surface-container-highest text-on-surface hover:bg-tertiary/10 transition-colors disabled:opacity-30 cursor-pointer"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};
