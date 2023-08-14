import React, { useState } from 'react';

const Modal = (props: {
  children?: React.ReactNode | string;
  controlButtons?: React.ReactNode;
  isOpen?: boolean;
  maxWidth?: '4xl' | '5xl' | '6xl';
  onClose?: (start: string, end: string) => unknown;
  title?: string;
}) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(props.isOpen ? props.isOpen : true);
  const startDate = 'hello';
  const endDate = 'world';

  const closeModal = () => {
    setIsModalOpen(false);
    if (props.onClose) {
      props.onClose(startDate, endDate);
    }
  };

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    // Stop event propagation to prevent closing the modal
    event.stopPropagation();
  };

  const maxWidth = () => {
    switch (props.maxWidth) {
      case '4xl':
        return 'sm:max-w-4xl';
      case '5xl':
        return 'sm:max-w-5xl';
      case '6xl':
        return 'sm:max-w-6xl';
      default:
        return 'sm:max-w-6xl';
    }
  };

  return (
    <>
      {isModalOpen && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              aria-hidden="true"
              onClick={e => handleOverlayClick(e)}
            ></div>
            <div className={`bg-white rounded-lg overflow shadow-xl transform transition-all ${maxWidth()} sm:w-full`}>
              <div className="bg-gray-100 px-4 py-3 border-b rounded-t-lg">
                <h3 className="text-lg font-medium text-gray-900">{props?.title}</h3>
              </div>
              <div className="px-4 py-3">{props.children}</div>
              <div className="bg-gray-100 px-4 py-3 flex justify-end rounded-b-lg">
                {props.controlButtons || (
                  <button
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 focus:outline-none"
                    onClick={closeModal}
                  >
                    Close
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
