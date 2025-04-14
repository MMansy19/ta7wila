import { ReactNode } from 'react';

interface ModalWrapperProps {
  children: ReactNode;
}

const ModalWrapper = ({ children }: ModalWrapperProps) => (
  <div className="fixed w-full z-20 inset-0 bg-black bg-opacity-70 flex justify-center items-center">
    <div className="bg-neutral-900 rounded-[18px] p-6 shadow-lg w-[600px] mx-6">
      {children}
    </div>
  </div>
);

export default ModalWrapper;