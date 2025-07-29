import React from 'react';

const PaginationFooter = ({
    currentPage,
    totalPages,
    pageSize,
    totalCount,
    onPageChange,
}) => {
    const start = (currentPage - 1) * pageSize + 1;
    const end = Math.min(currentPage * pageSize, totalCount);
    const isFirstPage = currentPage === 1;
    const isLastPage = currentPage === totalPages;

    return (
        <div className="flex items-center justify-between mt-6 text-sm text-gray-700 dark:text-gray-300">
            <div>
                Showing {start} to {end} of {totalCount} results
            </div>
            <div className="flex items-center gap-2">
                <button
                    aria-label="Previous Page"
                    onClick={() => !isFirstPage && onPageChange(currentPage - 1)}
                    disabled={isFirstPage}
                    className="px-3 py-1 rounded border border-gray-300 dark:border-gray-600 
                     bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 
                     disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                    Prev
                </button>

                <span className="px-2">
                    Page {currentPage} of {totalPages}
                </span>

                <button
                    aria-label="Next Page"
                    onClick={() => !isLastPage && onPageChange(currentPage + 1)}
                    disabled={isLastPage}
                    className="px-3 py-1 rounded border border-gray-300 dark:border-gray-600 
                     bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 
                     disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default PaginationFooter;
