import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  lang?: string;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  lang = 'en'
}) => {
  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      onPageChange(newPage);
    }
  };

  return (
    <div className="flex justify-end mt-auto">
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
        className={`mx-1 rounded-full w-9 h-9 flex justify-center items-center ${
          currentPage === 1
            ? "bg-[#53B4AB] cursor-not-allowed"
            : "bg-gray-700 hover:bg-gray-600"
        }`}
      >
        <svg
          width="24"
          height="25"
          viewBox="0 0 24 25"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`transform ${lang === 'ar' ? 'rotate-180' : ''}`}
        >
          <path
            d="M14 17.772L9 12.772L14 7.77197"
            stroke="black"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <span className="p-2 text-sm">{`Page ${currentPage} of ${totalPages}`}</span>
      
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`mx-1 rounded-full w-9 h-9 flex justify-center items-center ${
          currentPage === totalPages
            ? "bg-[#53B4AB] cursor-not-allowed"
            : "bg-gray-700 hover:bg-gray-600"
        }`}
      >
        <svg
          width="24"
          height="25"
          viewBox="0 0 24 25"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`transform ${lang === 'ar' ? 'rotate-180' : ''}`}
        >
          <path
            d="M10 17.772L15 12.772L10 7.77197"
            stroke="black"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
};

export default Pagination; 