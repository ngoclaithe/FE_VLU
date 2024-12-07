import React, { useState, useMemo } from 'react';
import ShiftCard from '../../components/common/ShiftCard';
import { useTeacherShifts } from '../../hooks/useTeacherShifts';
import {
  teacherRegisterSchedule,
  leaveSchedule,
  changeSchedule
} from '../../services/apiSchedule';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

const ShiftListTeacher = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [oldShift, setOldShift] = useState(null);
  const [newShift, setNewShift] = useState(null);

  const { shifts, daysInMonth, teacherId } = useTeacherShifts(selectedMonth, selectedDate);

  const months = [
    'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
    'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12',
  ];

  const registeredShifts = useMemo(() => {
    const allRegisteredShifts = [];
    Object.keys(shifts).forEach(day => {
      shifts[day]
        .filter(shift => shift.registered)
        .forEach(shift => {
          allRegisteredShifts.push({
            ...shift,
            fullDate: `${selectedDate.getFullYear()}-${(selectedMonth + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`
          });
        });
    });
    return allRegisteredShifts;
  }, [shifts, selectedMonth, selectedDate]);

  const availableShifts = useMemo(() => {
    const allAvailableShifts = [];
    Object.keys(shifts).forEach(day => {
      shifts[day]
        .filter(shift => !shift.registered)
        .forEach(shift => {
          allAvailableShifts.push({
            ...shift,
            fullDate: `${selectedDate.getFullYear()}-${(selectedMonth + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`
          });
        });
    });
    return allAvailableShifts;
  }, [shifts, selectedMonth, selectedDate]);

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
              ? leaveSchedule(teacherId, shift.description, formattedDate)
              : teacherRegisterSchedule(teacherId, shift.description, formattedDate);

            apiCall.then(() => {
              toast.success(shift.registered ? 'Xin nghỉ ca thành công!' : 'Đăng ký ca thành công!', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                toastId: "success-toast",
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
          onClick: () => { }
        }
      ]
    });
  };

  const handleSwapShift = () => {
    setIsModalOpen(true);
  };

  const handleSubmitSwap = () => {
    if (!oldShift || !newShift) {
      toast.error('Vui lòng chọn cả ca cũ và ca mới', {
        position: "top-right",
        autoClose: 2000,
      });
      return;
    }

    changeSchedule(
      teacherId,
      oldShift.description,
      oldShift.fullDate,
      newShift.description,
      newShift.fullDate
    )
      .then(() => {
        toast.success('Đã gửi yêu cầu đổi ca!', {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          toastId: "success-toast",
          zIndex: 100,
        });
        setIsModalOpen(false);
        setOldShift(null);
        setNewShift(null);
      })
      .catch((error) => {
        toast.error('Lỗi khi đổi ca:', error, {
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

          <button
            className="bg-blue-500 text-white p-2 rounded-lg shadow-sm"
            onClick={handleSwapShift}
          >
            Xin đổi ca trực
          </button>
        </div>

        {isModalOpen && (
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
                  className="bg-blue-500 text-white p-2 rounded-lg"
                  onClick={handleSubmitSwap}
                >
                  Xác nhận đổi ca
                </button>
                <button
                  className="bg-gray-500 text-white p-2 rounded-lg ml-2"
                  onClick={() => {
                    setIsModalOpen(false);
                    setOldShift(null);
                    setNewShift(null);
                  }}
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        )}

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