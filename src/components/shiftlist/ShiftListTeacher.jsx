import React, { useState, useMemo, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getListSemesterForTeacher, registerTeacherSchedule } from '../../services/apiSemester';
import { showToast } from '../../utils/toast';
import SemesterList from '../../components/SemesterList';
import ShiftCalendar from '../../components/ShiftCalendar';
import ShiftRegisterModal from '../../components/ShiftRegisterModal';
import ShiftSwapModal from '../../components/ShiftSwapModal';
import { useTeacherShifts } from '../../hooks/useTeacherShifts';
import { leaveSchedule, changeSchedule } from '../../services/apiSchedule';
import ReasonModal from '../../components/ReasonModal'; 

const ShiftListTeacher = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isReasonModalOpen, setIsReasonModalOpen] = useState(false); 
  const [oldShift, setOldShift] = useState(null);
  const [newShift, setNewShift] = useState(null);
  const [selectedShifts, setSelectedShifts] = useState({});
  const [semesters, setSemesters] = useState([]);
  const [showShiftSection, setShowShiftSection] = useState(false);
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [selectedShift, setSelectedShift] = useState(null); 
  const [reason, setReason] = useState(''); 

  useEffect(() => {
    getListSemesterForTeacher().then((data) => {
      setSemesters(data);
    });
  }, []);

  const { shifts, daysInMonth, teacherId } = useTeacherShifts(selectedMonth, selectedYear);

  const months = [
    'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
    'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12',
  ];

  const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 5 + i);

  const registeredShifts = useMemo(() => {
    const allRegisteredShifts = [];
    Object.keys(shifts).forEach(day => {
      shifts[day]
        .filter(shift => shift.registered)
        .forEach(shift => {
          allRegisteredShifts.push({
            ...shift,
            fullDate: `${selectedYear}-${(selectedMonth + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`
          });
        });
    });
    return allRegisteredShifts;
  }, [shifts, selectedMonth, selectedYear]);

  const availableShifts = useMemo(() => {
    const allAvailableShifts = [];
    Object.keys(shifts).forEach(day => {
      shifts[day]
        .filter(shift => !shift.registered)
        .forEach(shift => {
          allAvailableShifts.push({
            ...shift,
            fullDate: `${selectedYear}-${(selectedMonth + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`
          });
        });
    });
    return allAvailableShifts;
  }, [shifts, selectedMonth, selectedYear]);

  const handleSelectSemester = (semester) => {
    setSelectedSemester(semester); 
    setShowShiftSection(true);
    const startDate = new Date(semester.start_day);
    setSelectedMonth(startDate.getMonth());
    setSelectedYear(startDate.getFullYear());
  };

  const handleRightClick = (shift) => {
    if (shift.note === 'success') {
      setSelectedShift(shift); 
      setIsReasonModalOpen(true); 
    }
  };

  const handleLeaveSubmit = () => {
    if (!selectedShift || !reason) {
      showToast('Vui lòng nhập lý do nghỉ', 'error');
      return;
    }

    const year = selectedYear;
    const month = selectedMonth + 1;
    const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${selectedShift.day.toString().padStart(2, '0')}`;

    leaveSchedule(teacherId, selectedShift.description, formattedDate, reason)
      .then(() => {
        showToast('Xin nghỉ ca thành công!');
        setIsReasonModalOpen(false); 
        setReason(''); 
      })
      .catch(error => {
        showToast('Lỗi khi thao tác ca: ' + error.message, 'error');
      });
  };

  const handleSwapShift = () => {
    setIsModalOpen(true);
  };

  const handleRegisterShift = () => {
    setIsRegisterModalOpen(true);
  };

  const handleSelectShift = (day, shiftType) => {
    setSelectedShifts((prev) => {
      const key = `${day}-${shiftType}`;
      const newSelectedShifts = { ...prev };
      if (newSelectedShifts[key]) {
        delete newSelectedShifts[key];
      } else {
        newSelectedShifts[key] = true;
      }
      return newSelectedShifts;
    });
  };

  const handleSubmitRegister = () => {
    if (!selectedSemester) {
      showToast('Vui lòng chọn học kỳ trước khi đăng ký ca trực', 'error');
      return;
    }
  
    const shiftsToRegister = Object.keys(selectedShifts).reduce((acc, key) => {
      const [day, shiftType] = key.split('-');
      const shiftKey = `shift_${shiftType === 'morning' ? 1 : 2}`;
      if (!acc[day]) acc[day] = {};
      acc[day][shiftKey] = true;
      return acc;
    }, {});
  
    console.log("Các ca đã chọn:", shiftsToRegister);
    console.log("Học kỳ được chọn:", selectedSemester.id);
  
    registerTeacherSchedule(teacherId, selectedSemester.id, shiftsToRegister)
      .then(() => {
        showToast('Đăng ký ca thành công!');
        setIsRegisterModalOpen(false);
        setSelectedShifts({});
      })
      .catch((error) => {
        showToast('Lỗi khi đăng ký ca: ' + error.message, 'error');
      });
  
    setIsRegisterModalOpen(false);
    setSelectedShifts({});
  };

  const handleSubmitSwap = () => {
    if (!oldShift || !newShift) {
      showToast('Vui lòng chọn cả ca cũ và ca mới', 'error');
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
        showToast('Đã gửi yêu cầu đổi ca!');
        setIsModalOpen(false);
        setOldShift(null);
        setNewShift(null);
      })
      .catch((error) => {
        showToast('Lỗi khi đổi ca: ' + error.message, 'error');
      });
  };

  return (
    <>
      <ToastContainer />
      <div className="p-6 bg-gray-100 min-h-screen">
        {!showShiftSection ? (
          <SemesterList semesters={semesters} onSelectSemester={handleSelectSemester} />
        ) : (
          <>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Danh sách ca trực</h1>
            <button
              className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded mb-4"
              onClick={() => setShowShiftSection(false)}
            >
              Quay lại
            </button>
            <div className="flex justify-between items-center mb-6">
              <div className="flex gap-4">
                <select
                  className="bg-white border border-gray-300 rounded-lg p-2 shadow-sm"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                >
                  {months.map((month, index) => (
                    <option key={index} value={index}>{month}</option>
                  ))}
                </select>

                <select
                  className="bg-white border border-gray-300 rounded-lg p-2 shadow-sm"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                >
                  {years.map((year, index) => (
                    <option key={index} value={year}>{year}</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-4">
                <button
                  className="bg-blue-500 text-white p-2 rounded-lg shadow-sm hover:bg-blue-600 transition-all"
                  onClick={handleSwapShift}
                >
                  Xin đổi ca trực
                </button>
                {selectedSemester?.status !== "approve_not_teacher" && (
                  <button
                    className="bg-green-500 text-white p-2 rounded-lg shadow-sm hover:bg-green-600 transition-all"
                    onClick={handleRegisterShift}
                  >
                    Đăng ký ca trực
                  </button>
                )}
              </div>
            </div>
            <div className="mb-6 bg-white p-4 rounded-lg shadow-md border border-gray-200">
              <div className="flex flex-col space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-20 h-6 bg-blue-100 rounded-lg"></div>
                  <span className="text-sm font-semibold text-gray-700">Ca sáng:</span>
                  <span className="text-sm text-gray-600">{`${selectedSemester.time_start_shift_1} - ${selectedSemester.time_end_shift_1}`}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-20 h-6 bg-red-100 rounded-lg"></div> 
                  <span className="text-sm font-semibold text-gray-700">Ca chiều:</span>
                  <span className="text-sm text-gray-600">{`${selectedSemester.time_start_shift_2} - ${selectedSemester.time_end_shift_2}`}</span>
                </div>
              </div>
            </div>

            <ShiftCalendar
              shifts={shifts}
              selectedMonth={selectedMonth}
              selectedYear={selectedYear}
              daysInMonth={daysInMonth}
              isCurrentMonth={selectedMonth === new Date().getMonth() && selectedYear === new Date().getFullYear()}
              currentDate={new Date()}
              onRightClick={handleRightClick}
            />

            <ShiftRegisterModal
              isOpen={isRegisterModalOpen}
              onClose={() => setIsRegisterModalOpen(false)}
              selectedShifts={selectedShifts}
              onSelectShift={handleSelectShift}
              onSubmitRegister={handleSubmitRegister}
            />

            <ShiftSwapModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              oldShift={oldShift}
              newShift={newShift}
              setOldShift={setOldShift}
              setNewShift={setNewShift}
              registeredShifts={registeredShifts}
              availableShifts={availableShifts}
              onSubmitSwap={handleSubmitSwap}
            />

            <ReasonModal
              isOpen={isReasonModalOpen}
              onClose={() => setIsReasonModalOpen(false)}
              onSubmit={handleLeaveSubmit}
              reason={reason}
              setReason={setReason}
            />
          </>
        )}
      </div>
    </>
  );
};

export default ShiftListTeacher;