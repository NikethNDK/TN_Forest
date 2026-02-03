/**
 * Pagination Component
 * 
 * Reusable pagination controls for product lists
 */

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  /** When true, always show the bar (buttons disabled when only one page). */
  alwaysShow?: boolean;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  alwaysShow = false,
}) => {
  const totalPagesSafe = Math.max(1, totalPages);
  if (!alwaysShow && totalPagesSafe <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-4 mt-8">
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="px-4 py-2 bg-interactive-primaryDefault text-interactive-primaryText rounded-lg font-semibold disabled:bg-interactive-disabled disabled:cursor-not-allowed hover:bg-interactive-primaryHover transition-colors flex items-center"
      >
        <ChevronLeft className="h-5 w-5 mr-1" />
        Previous
      </button>
      <span className="text-content-primary font-medium">
        Page {currentPage} of {totalPagesSafe}
      </span>
      <button
        onClick={() => onPageChange(Math.min(totalPagesSafe, currentPage + 1))}
        disabled={currentPage === totalPagesSafe}
        className="px-4 py-2 bg-interactive-primaryDefault text-interactive-primaryText rounded-lg font-semibold disabled:bg-interactive-disabled disabled:cursor-not-allowed hover:bg-interactive-primaryHover transition-colors flex items-center"
      >
        Next
        <ChevronRight className="h-5 w-5 ml-1" />
      </button>
    </div>
  );
};

export default Pagination;
