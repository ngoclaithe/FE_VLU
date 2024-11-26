import React, { useEffect, useState } from 'react';
import { getShiftsByMonth, createShift, updateShift, deleteShift } from '../../services/apiShift';
import { getSchedulesByDate } from '../../services/apiSchedule';
import InfoSchedule from '../../components/modal/InfoSchedule';

const ShiftModal = ({ isOpen, onClose, onSelect, day }) => {
  const shifts = [
    { id: "1", time: "18:00-19:30", description: "1" },
    { id: "2", time: "19:30-21:00", description: "2" },
    { id: "3", time: "21:00-22:30", description: "3" },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-lg max-w-sm w-full p-6" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-lg font-bold text-gray-800 mb-4">
          Chọn ca trực cho ngày {day}
        </h2>
        <div className="space-y-3">
          {shifts.map((shift) => (
            <button
              key={shift.id}
              onClick={() => {
                onSelect(day, shift.description);
                onClose();
              }}
              className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-800 text-left py-2 px-4 rounded-md"
            >
              {shift.time}
            </button>
          ))}
        </div>
        <button
          onClick={onClose}
          className="mt-4 w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md"
        >
          Đóng
        </button>
      </div>
    </div>
  );
};

const ShiftCard = ({ day, shifts, onCreate, onDelete, onShowSchedule, fullDate }) => {
  const descriptionToTime = {
    "1": "18:00-19:30",
    "2": "19:30-21:00",
    "3": "21:00-22:30",
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4 border border-gray-200 h-full flex flex-col">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">{`Ngày ${day}`}</h3>

      <div className="flex-grow space-y-3">
        {shifts.map((shift) => (
          <div key={shift.id} className="mb-3">
            <p className="text-sm text-gray-600">{`Ca trực: ${descriptionToTime[shift.description] || "Không có thông tin"}`}</p>
            <div className="flex justify-between mt-2">
              <button
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                onClick={() => onShowSchedule(fullDate, shift.description)}
              >
                Hiển thị người trực
              </button>
              <button
                className="text-red-600 hover:text-red-700 text-sm font-medium"
                onClick={() => onDelete(shift.id)}
              >
                Xóa Ca
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-auto pt-4">
        {shifts.length < 3 && (
          <button
            className="bg-green-500 hover:bg-green-600 text-white w-full py-2 px-4 rounded-md"
            onClick={() => onCreate(day)}
          >
            Thêm ca trực
          </button>
        )}
      </div>
    </div>
  );
};

const ShiftList = () => {
  const [shifts, setShifts] = useState([]);
  const [daysInMonth, setDaysInMonth] = useState(30);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [shiftModalOpen, setShiftModalOpen] = useState(false);
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedDescription, setSelectedDescription] = useState("");

  const months = [
    'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
    'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12',
  ];

  useEffect(() => {
    const year = selectedDate.getFullYear();
    const days = new Date(year, selectedMonth + 1, 0).getDate();
    setDaysInMonth(days);

    getShiftsByMonth(year, selectedMonth + 1).then((data) => {
      const groupedShifts = data.reduce((acc, shift) => {
        const day = new Date(shift.date).getDate();
        if (!acc[day]) acc[day] = [];
        acc[day].push(shift);
        return acc;
      }, {});
      setShifts(groupedShifts);
    });
  }, [selectedMonth, selectedDate]);

  const handleCreateShift = (day) => {
    setSelectedDay(day);
    setShiftModalOpen(true);
  };

  const handleShiftSelect = (day, description) => {
    const year = selectedDate.getFullYear();
    const month = selectedMonth + 1;
    const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;

    if (
      shifts[day] &&
      shifts[day].some((shift) => shift.description === description)
    ) {
      console.log("Ca trực này đã tồn tại!");
      return;
    }

    console.log("Giá trị date khi gửi lên API", formattedDate);
    createShift({
      date: formattedDate,
      description: description
    }).then((newShift) => {
      setShifts((prevShifts) => {
        const updatedShifts = { ...prevShifts };
        if (!updatedShifts[day]) updatedShifts[day] = [];
        updatedShifts[day].push(newShift);
        return updatedShifts;
      });
      setShiftModalOpen(false);
      window.location.reload();
    });
  };

  const handleShowSchedule = (fullDate, description) => {
    setSelectedDay(fullDate);
    setSelectedDescription(description);
    console.log("Giá trị fullDate", fullDate);
    console.log("Giá trị description", description);
    setInfoModalOpen(true);
  };

  const handleDeleteShift = (shiftId) => {
    deleteShift(shiftId).then(() => {
      setShifts((prevShifts) => {
        const updatedShifts = { ...prevShifts };
        for (const day in updatedShifts) {
          updatedShifts[day] = updatedShifts[day].filter((s) => s.id !== shiftId);
        }
        return updatedShifts;
      });
    });
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (event.target.classList.contains("fixed")) {
        setInfoModalOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Danh sách ca trực</h1>

      <div className="flex justify-between items-center mb-6">
        <select
          className="bg-white border border-gray-300 rounded-lg p-2 shadow-sm"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
        >
          {months.map((month, index) => (
            <option key={index} value={index}>{month}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...Array(daysInMonth)].map((_, index) => {
          const day = index + 1;
          const shiftData = shifts[day] || [];
          const year = selectedDate.getFullYear();
          const month = (selectedMonth + 1).toString().padStart(2, "0");
          const fullDate = `${year}-${month}-${day.toString().padStart(2, "0")}`;

          return (
            <ShiftCard
              key={day}
              day={day}
              shifts={shiftData}
              onCreate={handleCreateShift}
              onDelete={handleDeleteShift}
              onShowSchedule={handleShowSchedule}
              fullDate={fullDate}
            />
          );
        })}
      </div>

      <ShiftModal
        isOpen={shiftModalOpen}
        onClose={() => setShiftModalOpen(false)}
        onSelect={handleShiftSelect}
        day={selectedDay}
      />
      <InfoSchedule
        isOpen={infoModalOpen}
        onClose={() => setInfoModalOpen(false)}
        day={selectedDay}
        description={selectedDescription}
      />
    </div>
  );
};

export default ShiftList;