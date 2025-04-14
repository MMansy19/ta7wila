import { useTranslation } from "@/context/translation-context";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  handlePageChange: (newPage: number) => void;
}

const Pagination = ({ currentPage, totalPages, handlePageChange }: PaginationProps) => {
  const translations = useTranslation();
  
  return (
    <div className="flex justify-end mt-auto">
      <PaginationButton
        direction="prev"
        disabled={currentPage === 1}
        onClick={() => handlePageChange(currentPage - 1)}
      />
      <span className="px-2 py-3">
        {`${translations.pagination.page} ${currentPage} ${translations.pagination.of} ${totalPages}`}
      </span>
      <PaginationButton
        direction="next"
        disabled={currentPage === totalPages}
        onClick={() => handlePageChange(currentPage + 1)}
      />
    </div>
  );
};

interface PaginationButtonProps {
  direction: 'prev' | 'next';
  disabled: boolean;
  onClick: () => void;
}

const PaginationButton = ({ direction, disabled, onClick }: PaginationButtonProps) => {
  const d = direction === 'prev' 
    ? "M14 17.772L9 12.772L14 7.77197" 
    : "M10 17.772L15 12.772L10 7.77197";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`mx-1 rounded-full w-11 h-11 flex justify-center items-center ${
        disabled ? "bg-[#53B4AB] cursor-not-allowed" : "bg-gray-700 hover:bg-gray-600"
      }`}
    >
      <svg width="24" height="25" viewBox="0 0 24 25" fill="none">
        <path
          d={d}
          stroke="black"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
};

export default Pagination;