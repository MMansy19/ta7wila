import React from "react";

interface ActionButtonProps {
  text: string;
}

const ActionButton: React.FC<ActionButtonProps> = ({ text }) => {
  return (
    <button className="relative flex items-center justify-center w-36 h-12 text-sm font-bold text-[#53B4AB] rounded-lg 
      bg-black bg-opacity-80 hover:bg-opacity-50 transition-all duration-300">
      {text}
      <span className="absolute inset-0 rounded-lg bg-gradient-to-b from-transparent to-[#53B4AB] opacity-30"></span>
    </button>
  );
};

export default ActionButton;
