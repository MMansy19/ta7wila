import { useTranslation } from "@/context/translation-context";
import { FC } from 'react';

interface PaginationButtonProps {
  direction: 'prev' | 'next';
  disabled: boolean;
  onClick: () => void;
}

const PaginationButton: FC<PaginationButtonProps> = ({ direction, disabled, onClick }) => {
  const translations = useTranslation();
  const pathD = direction === 'prev' 
    ? "M14 17.772L9 12.772L14 7.77197" 
    : "M10 17.772L15 12.772L10 7.77197";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`mx-1 rounded-full w-11 h-11 flex justify-center items-center ${
        disabled ? "bg-[#53B4AB] cursor-not-allowed" : "bg-gray-700 hover:bg-gray-600"
      }`}
      aria-label={direction === 'prev' ? translations.pagination.previous : translations.pagination.next}
    >
      <svg width="24" height="25" viewBox="0 0 24 25" fill="none">
        <path
          d={pathD}
          stroke="black"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
};

export default PaginationButton;