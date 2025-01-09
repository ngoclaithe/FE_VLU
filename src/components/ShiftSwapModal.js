import React from 'react';

const ShiftSwapModal = ({
  isOpen,
  onClose,
  oldShift,
  newShift,
  setOldShift,
  setNewShift,
  registeredShifts,
  availableShifts,
  onSubmitSwap,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
        <h2 className="text-xl font-bold mb-4">Đổi ca trực</h2>

        <div className="mb-4">
          <label className="block mb-2">Chọn ca cũ</label>
          <select
            className="w-full p-2 border border-gray-300 rounded"
            value={oldShift ? JSON.stringify(oldShift) : ''}
            onChange={(e) => setOldShift(e.target.value ? JSON.parse(e.target.value) : null)}
          >
            <option value="">Chọn ca cũ</option>
            {registeredShifts
              .filter(shift => shift.note === 'success')
              .map((shift, index) => (
                <option
                  key={index}
                  value={JSON.stringify(shift)}
                >
                  Ca {`${shift.description} - Ngày ${shift.fullDate}`}
                </option>
              ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block mb-2">Chọn ca mới</label>
          <select
            className="w-full p-2 border border-gray-300 rounded"
            value={newShift ? JSON.stringify(newShift) : ''}
            onChange={(e) => setNewShift(e.target.value ? JSON.parse(e.target.value) : null)}
          >
            <option value="">Chọn ca mới</option>
            {availableShifts.map((shift, index) => (
              <option
                key={index}
                value={JSON.stringify(shift)}
              >
                Ca {`${shift.description} - Ngày ${shift.fullDate}`}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end">
          <button
            className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-all"
            onClick={onSubmitSwap}
          >
            Xác nhận đổi ca
          </button>
          <button
            className="bg-gray-500 text-white p-2 rounded-lg ml-2 hover:bg-gray-600 transition-all"
            onClick={onClose}
          >
            Hủy
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShiftSwapModal;