import React from "react";

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-darkGray p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-semibold text-white">{title || "Confirm Action"}</h2>
        <p className="text-lightGray mt-2">{message || "Are you sure you want to proceed?"}</p>

        <div className="flex justify-end mt-4 space-x-3">
          <button
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            onClick={onConfirm}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
