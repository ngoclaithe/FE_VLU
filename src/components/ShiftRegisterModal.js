import React from 'react';

const ShiftRegisterModal = ({
  isOpen,
  onClose,
  selectedShifts,
  onSelectShift,
  onSubmitRegister,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full">
        <h2 className="text-xl font-bold mb-4">Đăng ký ca trực</h2>

        <div className="grid grid-cols-7 gap-2">
          {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map((day, index) => (
            <div
              key={index}
              className="text-center font-bold text-gray-700 bg-gray-200 p-2 rounded-lg flex items-center justify-center"
            >
              {day}
            </div>
          ))}
          {Array.from({ length: 7 }).map((_, index) => (
            <button
              key={index}
              className={`w-full h-12 rounded-lg flex items-center justify-center ${selectedShifts[`${index + 1}-morning`] ? 'bg-green-600' : 'bg-green-200'
                } hover:bg-green-300 transition-all`}
              onClick={() => onSelectShift(index + 1, 'morning')}
            />
          ))}

          {Array.from({ length: 7 }).map((_, index) => (
            <button
              key={index}
              className={`w-full h-12 rounded-lg flex items-center justify-center ${selectedShifts[`${index + 1}-afternoon`] ? 'bg-red-600' : 'bg-red-200'
                } hover:bg-red-300 transition-all`}
              onClick={() => onSelectShift(index + 1, 'afternoon')}
            />
          ))}
        </div>

        <div className="flex justify-end mt-4">
          <button
            className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-all"
            onClick={onSubmitRegister}
          >
            Xác nhận
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

export default ShiftRegisterModal;