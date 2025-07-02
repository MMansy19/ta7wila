"use client";
import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChangeClient: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChangeClient,
}) => {

  
  return (

    <div className="flex flex-wrap gap-10 justify-between items-start w-full mt-auto max-md:max-w-full p-3">
      <div className="flex gap-2.5 items-center leading-tight text-center min-w-[240px]">
        <div className="flex gap-2.5 justify-center items-center self-stretch px-4 py-2 my-auto text-sm font-medium text-gray-400 bg-gray-400 bg-opacity-20 rounded-[40px]">
          <div className="self-stretch my-auto">{currentPage}</div>
        </div>
        <div className="self-stretch my-auto text-xs text-zinc-500">
          Showing {currentPage} to {currentPage} of {totalPages} records
        </div>
      </div>
      <div className="flex gap-6 justify-center items-center min-h-[40px] rounded-[40px]">
        <button
          onClick={() => onPageChangeClient(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex gap-2.5 justify-center items-center self-stretch px-1 my-auto w-10 h-10 bg-gray-400 min-h-[40px] rounded-[40px]"
          aria-label="Previous page"
        >
          <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14 17.772L9 12.772L14 7.77197" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>

        </button>
        <div className="self-stretch my-auto text-sm font-medium leading-tight text-center text-gray-400">
          {currentPage}
        </div>
        <button
          onClick={() => onPageChangeClient(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex gap-2.5 justify-center items-center self-stretch px-1 my-auto w-10 h-10 bg-gray-400 min-h-[40px] rounded-[40px]"
          aria-label="Next page"
        >
          <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 17.772L15 12.772L10 7.77197" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>

        </button>
      </div>
    </div>

  );
};

export default Pagination;
