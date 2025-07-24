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

    return (
        <div className="flex items-center justify-between mt-6 text-sm text-gray-700 dark:text-gray-300">
            <div>
                Showing {start} to {end} of {totalCount} results
            </div>
            <div className="flex items-center gap-2">
                <button
                    onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 transition"
                >
                    Prev
                </button>
                <span>
                    Page {currentPage} of {totalPages}
                </span>
                <button
                    onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 transition"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default PaginationFooter;
