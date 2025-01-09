import React, { useState } from 'react';

const CreateShiftModal = ({ isOpen, onClose, onSubmit }) => {
  const [schoolYear, setSchoolYear] = useState('');
  const [semester, setSemester] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [morningStart, setMorningStart] = useState('');
  const [morningEnd, setMorningEnd] = useState('');
  const [afternoonStart, setAfternoonStart] = useState('');
  const [afternoonEnd, setAfternoonEnd] = useState('');
  const [selectedShifts, setSelectedShifts] = useState({});

  if (!isOpen) return null;

  const handleSelectShift = (day, shiftType) => {
    const key = `${day}-${shiftType}`;
    setSelectedShifts((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSubmit = () => {
    const shiftData = {
      schoolYear,
      semester,
      startDate,
      endDate,
      morningStart,
      morningEnd,
      afternoonStart,
      afternoonEnd,
      selectedShifts,
    };
    onSubmit(shiftData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full">
        <h2 className="text-xl font-bold mb-4">Tạo lịch trực</h2>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Năm học</label>
            <select
              value={schoolYear}
              onChange={(e) => setSchoolYear(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
            >
              <option value="  ">   </option>
              <option value="2022-2023">2022-2023</option>
              <option value="2023-2024">2023-2024</option>
              <option value="2024-2025">2024-2025</option>
              <option value="2025-2026">2025-2026</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Học kỳ</label>
            <select
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
            >
              <option value="  ">   </option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Ngày bắt đầu</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Ngày kết thúc</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Thời gian bắt đầu ca sáng</label>
            <input
              type="time"
              value={morningStart}
              onChange={(e) => setMorningStart(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Thời gian kết thúc ca sáng</label>
            <input
              type="time"
              value={morningEnd}
              onChange={(e) => setMorningEnd(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Thời gian bắt đầu ca chiều</label>
            <input
              type="time"
              value={afternoonStart}
              onChange={(e) => setAfternoonStart(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Thời gian kết thúc ca chiều</label>
            <input
              type="time"
              value={afternoonEnd}
              onChange={(e) => setAfternoonEnd(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2 mb-4">
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
              onClick={() => handleSelectShift(index + 1, 'morning')}
            />
          ))}

          {Array.from({ length: 7 }).map((_, index) => (
            <button
              key={index}
              className={`w-full h-12 rounded-lg flex items-center justify-center ${selectedShifts[`${index + 1}-afternoon`] ? 'bg-red-600' : 'bg-red-200'
                } hover:bg-red-300 transition-all`}
              onClick={() => handleSelectShift(index + 1, 'afternoon')}
            />
          ))}
        </div>

        <div className="flex justify-end mt-4">
          <button
            className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-all"
            onClick={handleSubmit}
          >
            Submit
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

export default CreateShiftModal;