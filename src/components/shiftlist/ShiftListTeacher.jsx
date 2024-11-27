import React, { useState } from 'react';
import ShiftCard from '../../components/common/ShiftCard';
import { useTeacherShifts } from '../../hooks/useTeacherShifts';
import {
  teacherRegisterSchedule,
  deleteSchedule
} from '../../services/apiSchedule';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { confirmAlert } from 'react-confirm-alert'; 
import 'react-confirm-alert/src/react-confirm-alert.css'; 

const ShiftListTeacher = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const { shifts, daysInMonth, teacherId } = useTeacherShifts(selectedMonth, selectedDate);

  const months = [
    'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
    'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12',
  ];

  const handleRightClick = (shift) => {

    confirmAlert({
      message: `Xác nhận đồng ý hoặc hủy`,
      buttons: [
        {
          label: 'Đồng ý',
          onClick: () => {
            const year = selectedDate.getFullYear();
            const month = selectedMonth + 1;
            const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${shift.day.toString().padStart(2, '0')}`;

            const apiCall = shift.registered
              ? deleteSchedule(teacherId, shift.description, formattedDate)
              : teacherRegisterSchedule(teacherId, shift.description, formattedDate);

            apiCall.then(() => {
              toast.success(shift.registered ? 'Xóa ca thành công!' : 'Đăng ký ca thành công!', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                toastId: "error-toast",
                zIndex: 100,
              });
            }).catch(error => {
              toast.error('Lỗi khi thao tác ca:', error, {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                toastId: "error-toast",
                zIndex: 100,
              });
            });
          }
        },
        {
          label: 'Hủy',
          onClick: () => {  }
        }
      ]
    });
  };

  return (
    <>
      <ToastContainer />
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
            const fullDate = `${selectedDate.getFullYear()}-${(selectedMonth + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
            const dayShifts = shifts[day] || [];
            return (
              <ShiftCard
                key={day}
                day={day}
                shifts={dayShifts}
                fullDate={fullDate}
                onRightClick={handleRightClick}
              />
            );
          })}
        </div>
      </div>
    </>
  );
};

export default ShiftListTeacher;
