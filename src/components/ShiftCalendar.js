import React from 'react';
import ShiftCard from './common/ShiftCard';

const ShiftCalendar = ({
  shifts,
  selectedMonth,
  selectedYear,
  daysInMonth,
  isCurrentMonth,
  currentDate,
  onRightClick,
}) => {
  const firstDayOfMonth = new Date(selectedYear, selectedMonth, 1).getDay();
  const blankDays = Array(firstDayOfMonth).fill(null);
  const daysInMonthArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div className="grid grid-cols-7 gap-2">
      {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map((day, index) => (
        <div
          key={index}
          className="text-center font-bold text-gray-700 bg-gray-200 p-2 rounded-lg"
        >
          {day}
        </div>
      ))}

      {blankDays.map((_, index) => (
        <div key={`blank-${index}`} className="bg-transparent" />
      ))}

      {daysInMonthArray.map((day) => {
        const fullDate = `${selectedYear}-${(selectedMonth + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        const dayShifts = shifts[day] || [];
        const isToday = isCurrentMonth && day === currentDate.getDate();

        return (
          <div
            key={day}
            className={`p-3 border border-gray-200 rounded-lg ${isToday ? 'bg-blue-50 border-blue-300' : 'bg-white'
              } hover:shadow-md transition-all`}
          >
            <div className="flex justify-between items-center mb-2">
              <span className={`text-sm font-semibold ${isToday ? 'text-blue-600' : 'text-gray-700'
                }`}>
                {day}
              </span>
            </div>
            <ShiftCard
              day={day}
              shifts={dayShifts}
              fullDate={fullDate}
              onRightClick={onRightClick}
            />
          </div>
        );
      })}
    </div>
  );
};

export default ShiftCalendar;