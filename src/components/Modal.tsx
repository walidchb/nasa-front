import React from 'react';

interface FilterModalProps {
  onClose: () => void;
  children: React.ReactNode;
  popup?: boolean;
  className?: any;
}

const Modal: React.FC<FilterModalProps> = ({
  onClose,
  children,
  popup,
  className,
}) => {
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  return (
    <div
      style={{ zIndex: '1000' }}
      className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-600 bg-opacity-50"
      onClick={handleOverlayClick}
    >
      <div
        className={
          popup
            ? 'w-full md:w-[55%] lg:w-[55%] h-[650px] md:h-[550px] lg:h-[500px] bg-white p-8 rounded-lg'
            : 'w-[75%] bg-white p-8 rounded-lg' + ' ' + className
        }
      >
        {children}
      </div>
    </div>
  );
};

export default Modal;
