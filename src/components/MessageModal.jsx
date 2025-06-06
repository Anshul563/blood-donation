import React from 'react';

function MessageModal({
  message,
  isVisible,
  onClose,
  primaryButtonText,
  onPrimaryClick,
  secondaryButtonText,
  onSecondaryClick,
}) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full text-center">
        <p className="text-lg font-semibold mb-4">{message}</p>

        {/* Buttons Container */}
        <div className="flex justify-center space-x-4">
          {primaryButtonText && onPrimaryClick && (
            <button
              onClick={onPrimaryClick}
              className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors"
            >
              {primaryButtonText}
            </button>
          )}
          {secondaryButtonText && onSecondaryClick && (
            <button
              onClick={onSecondaryClick}
              className="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-colors"
            >
              {secondaryButtonText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default MessageModal;
