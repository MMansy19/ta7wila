import { useTranslation } from "@/context/translation-context";
import { useParams } from "next/navigation";

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
      <span className="px-2 text-sm flex items-center justify-center">
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
  const params = useParams();
  const lang = params.lang as string;
  const isRTL = lang === 'ar';
  
  // Define SVG paths based on language direction
  const getPath = () => {
    if (isRTL) {
      // For RTL languages (Arabic), reverse the direction
      return direction === 'prev' 
        ? "M10 17.772L15 12.772L10 7.77197" // Next arrow for RTL
        : "M14 17.772L9 12.772L14 7.77197"; // Prev arrow for RTL
    } else {
      // For LTR languages (English), keep the original direction
      return direction === 'prev' 
        ? "M14 17.772L9 12.772L14 7.77197" // Prev arrow for LTR
        : "M10 17.772L15 12.772L10 7.77197"; // Next arrow for LTR
    }
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`mx-1 rounded-full w-9 h-9 flex justify-center items-center ${
        disabled ? "bg-[#53B4AB] cursor-not-allowed" : "bg-gray-700 hover:bg-gray-600"
      }`}
    >
      <svg width="24" height="25" viewBox="0 0 24 25" fill="none">
        <path
          d={getPath()}
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