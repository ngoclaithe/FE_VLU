import React, { useState } from 'react';

const ChangeShiftModal = ({ isOpen, shift, onSubmit, onClose }) => {
  const [newDescription, setNewDescription] = useState("");
  const [newDate, setNewDate] = useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-1/3">
        <h2 className="text-lg font-bold mb-4">Đổi Ca Trực</h2>
        <p>Ca hiện tại: {shift?.description}</p>
        <p>Ngày hiện tại: {shift?.fullDate}</p>

        <label className="block mt-4">
          Mô tả ca mới:
          <input
            type="text"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            className="w-full p-2 border rounded mt-2"
          />
        </label>

        <label className="block mt-4">
          Ngày mới:
          <input
            type="date"
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
            className="w-full p-2 border rounded mt-2"
          />
        </label>

        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="bg-gray-200 text-gray-700 py-2 px-4 rounded mr-4"
          >
            Hủy
          </button>
          <button
            onClick={() => onSubmit(newDescription, newDate)}
            className="bg-blue-500 text-white py-2 px-4 rounded"
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangeShiftModal;
