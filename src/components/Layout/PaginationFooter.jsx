import React from 'react';

const PaginationFooter = ({
    currentPage,
    totalPages,
    pageSize,
    totalCount,
    onPageChange,
    isDark,
}) => {
    const start = (currentPage - 1) * pageSize + 1;
    const end = Math.min(currentPage * pageSize, totalCount);
    const isFirstPage = currentPage === 1;
    const isLastPage = currentPage === totalPages;

    const textColor = isDark ? 'text-gray-300' : 'text-gray-700';
    const borderColor = isDark ? 'border-gray-600' : 'border-gray-300';
    const bgColor = isDark ? 'bg-gray-800' : 'bg-white';
    const hoverBg = isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100';
    const textBtn = isDark ? 'text-white' : 'text-gray-900';

    return (
        <div className={`flex items-center justify-between mt-6 text-sm ${textColor}`}>
            <div>
                Showing {start} to {end} of {totalCount} results
            </div>
            <div className="flex items-center gap-2">
                <button
                    aria-label="Previous Page"
                    onClick={() => !isFirstPage && onPageChange(currentPage - 1)}
                    disabled={isFirstPage}
                    className={`px-3 py-1 rounded border ${borderColor} ${bgColor} ${hoverBg} ${textBtn} 
            disabled:opacity-50 disabled:cursor-not-allowed transition`}
                >
                    Prev
                </button>

                <span className={`${textColor} px-2`}>
                    Page {currentPage} of {totalPages}
                </span>

                <button
                    aria-label="Next Page"
                    onClick={() => !isLastPage && onPageChange(currentPage + 1)}
                    disabled={isLastPage}
                    className={`px-3 py-1 rounded border ${borderColor} ${bgColor} ${hoverBg} ${textBtn} 
            disabled:opacity-50 disabled:cursor-not-allowed transition`}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default PaginationFooter;
