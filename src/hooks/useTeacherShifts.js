import { useState, useEffect } from 'react';
import { 
  getSchedulesByMonth
} from '../services/apiSchedule';
import { 
    getShiftsByMonth
  } from '../services/apiShift';
import { getTeacherIdByEmail } from '../services/apiAuth';

export const useTeacherShifts = (selectedMonth, selectedYear) => {
  const [shifts, setShifts] = useState([]);
  const [daysInMonth, setDaysInMonth] = useState(30);
  const [teacherId, setTeacherId] = useState(null);

  useEffect(() => {
    const email = sessionStorage.getItem('email');
    const token = sessionStorage.getItem('token');

    if (email && token) {
      getTeacherIdByEmail(email, token)
        .then(setTeacherId)
        .catch(error => console.error('Lỗi khi lấy teacherId:', error));
    }
  }, []);

  useEffect(() => {
    if (!teacherId) return;
    const days = new Date(selectedYear, selectedMonth + 1, 0).getDate();
    setDaysInMonth(days);

    const month = (selectedMonth + 1).toString().padStart(2, '0');
    const yearMonth = `${selectedYear}-${month}`;

    Promise.all([
      getShiftsByMonth(selectedYear, selectedMonth + 1),
      getSchedulesByMonth(teacherId, yearMonth)
    ])
    .then(([shiftsData, schedulesData]) => {
      const groupedShifts = shiftsData.reduce((acc, shift) => {
        const day = new Date(shift.date).getDate();
        if (!acc[day]) acc[day] = [];
        acc[day].push(shift);
        return acc;
      }, {});

      const groupedSchedules = schedulesData.reduce((acc, schedule) => {
        const day = new Date(schedule.date).getDate();
        if (!acc[day]) acc[day] = [];
        acc[day].push(schedule);
        return acc;
      }, {});

      const updatedShifts = { ...groupedShifts };
      for (let day in groupedSchedules) {
        if (updatedShifts[day]) {
          updatedShifts[day] = updatedShifts[day].map(shift => {
            const matchingSchedule = groupedSchedules[day].find(
              schedule => schedule.description === shift.description
            );
            return {
              ...shift,
              registered: !!matchingSchedule,
              note: matchingSchedule ? matchingSchedule.note : null
            };
          });
        }
      }

      setShifts(updatedShifts);
    })
    .catch(error => console.error('Lỗi khi lấy dữ liệu:', error));
  }, [selectedMonth, selectedYear, teacherId]);

  return { shifts, daysInMonth, teacherId };
};