import React from 'react';

const ReasonModal = ({ isOpen, onClose, onSubmit, reason, setReason }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Nhập lý do nghỉ</h2>
        <textarea
          className="w-full p-2 border border-gray-300 rounded-lg mb-4"
          placeholder="Nhập lý do nghỉ..."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          required
        />
        <div className="flex justify-end gap-2">
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
            onClick={onClose}
          >
            Hủy
          </button>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            onClick={onSubmit}
          >
            Gửi
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReasonModal;