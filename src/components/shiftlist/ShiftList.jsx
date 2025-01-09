import React, { useEffect, useState } from 'react';
import { getShiftsByMonthForDean, updateShiftShowTeacher } from '../../services/apiShift';
import {
  getListSemester,
  secretaryCreateSemesterShift,
  secretaryUpdateSemesterShift,
  secretaryDeleteSemesterShift,
  deanUpdateSemesterApprove,
  deanUpdateSemesterApproveNotTeacher,
  deanUpdateSemesterRefuse
} from '../../services/apiSemester';
import InfoSchedule from '../../components/modal/InfoSchedule';
import CreateShiftModal from './CreateShiftModal';
import UpdateSemesterModal from './UpdateSemesterModal';

const ShiftCard = ({ day, shifts, onShowSchedule, fullDate }) => {
  const [hoveredShift, setHoveredShift] = useState(null);
  const getShiftColor = (description) => {
    switch (description) {
      case "1":
        return "bg-blue-100";
      case "2":
        return "bg-red-100";
      default:
        return "bg-gray-100";
    }
  };

  return (
    <div
      className="bg-white shadow-lg rounded-lg p-4 border border-gray-200 flex flex-col relative min-h-[200px] hover:bg-gray-50 transition-all duration-300"
    >
      <h3 className="text-lg font-semibold text-gray-700 mb-4">{`Ngày ${day}`}</h3>

      <div className="flex-grow space-y-3 overflow-hidden">
        {shifts.map((shift) => (
          <div
            key={shift.id}
            className={`mb-3 p-3 rounded-lg cursor-pointer ${getShiftColor(shift.description)} h-12 flex items-center justify-center ${hoveredShift === shift?.id ? 'bg-opacity-75' : ''}`}
            onMouseEnter={() => shift && setHoveredShift(shift.id)}
            onMouseLeave={() => setHoveredShift(null)}
            onClick={() => onShowSchedule(fullDate, shift.description)}
          />
        ))}
      </div>
    </div>
  );
};

const ShiftList = () => {
  const [shifts, setShifts] = useState([]);
  const [daysInMonth, setDaysInMonth] = useState(30);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedDescription, setSelectedDescription] = useState("");
  const [showTeacher, setShowTeacher] = useState(false);
  const [semesters, setSemesters] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [showShiftSection, setShowShiftSection] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [createShiftModalOpen, setCreateShiftModalOpen] = useState(false);
  const [updateSemesterModalOpen, setUpdateSemesterModalOpen] = useState(false);

  useEffect(() => {
    const role = sessionStorage.getItem('role');
    if (role) {
      setUserRole(role);
    }
  }, []);

  useEffect(() => {
    getListSemester().then((data) => {
      setSemesters(data);
    });
  }, []);

  const handleCreateShiftSubmit = async (shiftData) => {
    try {
      console.log('Dữ liệu lịch trực:', shiftData);
      const response = await secretaryCreateSemesterShift(shiftData);
      console.log('Phản hồi từ API:', response);
      alert('Tạo lịch trực thành công!');
      setCreateShiftModalOpen(false);
      getListSemester().then((data) => {
        setSemesters(data);
      });
    } catch (error) {
      console.error('Lỗi khi tạo lịch trực:', error);
      alert('Có lỗi xảy ra khi tạo lịch trực. Vui lòng thử lại.');
    }
  };

  const handleUpdateSemesterSubmit = async (id, data) => {
    try {
      console.log("Gia tri data:", data);
      const response = await secretaryUpdateSemesterShift(id, data);
      console.log('Phản hồi từ API:', response);
      alert('Cập nhật học kỳ thành công!');
      setUpdateSemesterModalOpen(false);
      getListSemester().then((data) => {
        setSemesters(data);
      });
    } catch (error) {
      console.error('Lỗi khi cập nhật học kỳ:', error);
      alert('Có lỗi xảy ra khi cập nhật học kỳ. Vui lòng thử lại.');
    }
  };

  const handleDeleteSemester = async (id) => {
    try {
      const response = await secretaryDeleteSemesterShift(id);
      console.log('Phản hồi từ API:', response);
      alert('Xóa học kỳ thành công!');
      getListSemester().then((data) => {
        setSemesters(data);
      });
    } catch (error) {
      console.error('Lỗi khi xóa học kỳ:', error);
      alert('Có lỗi xảy ra khi xóa học kỳ. Vui lòng thử lại.');
    }
  };

  useEffect(() => {
    if (selectedSemester) {
      const startDate = new Date(selectedSemester.start_day);
      const endDate = new Date(selectedSemester.end_day);
      const month = startDate.getMonth() + 1;
      const year = startDate.getFullYear();

      setSelectedMonth(month - 1);
      setSelectedYear(year);

      getShiftsByMonthForDean(year, month).then((data) => {
        const groupedShifts = data.reduce((acc, shift) => {
          const day = new Date(shift.date).getDate();
          if (!acc[day]) acc[day] = [];
          acc[day].push(shift);
          return acc;
        }, {});
        setShifts(groupedShifts);
      });
    }
  }, [selectedSemester]);

  useEffect(() => {
    if (selectedSemester) {
      getShiftsByMonthForDean(selectedYear, selectedMonth + 1).then((data) => {
        const groupedShifts = data.reduce((acc, shift) => {
          const day = new Date(shift.date).getDate();
          if (!acc[day]) acc[day] = [];
          acc[day].push(shift);
          return acc;
        }, {});
        setShifts(groupedShifts);
      });
    }
  }, [selectedMonth, selectedYear, selectedSemester]);

  const handleTeacherVisibilityToggle = async () => {
    if (selectedSemester) {
      try {
        const newStatus = selectedSemester.status === 'approve' ? 'approve_not_teacher' : 'approve';
        const response = newStatus === 'approve' 
          ? await deanUpdateSemesterApprove(selectedSemester.id, { status: newStatus })
          : await deanUpdateSemesterApproveNotTeacher(selectedSemester.id, { status: newStatus });
        
        console.log('Cập nhật trạng thái thành công:', response);
        getListSemester().then((data) => {
          setSemesters(data);
          setSelectedSemester(data.find(sem => sem.id === selectedSemester.id));
        });
      } catch (error) {
        console.error('Lỗi khi cập nhật trạng thái:', error);
      }
    }
  };

  const months = [
    'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
    'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12',
  ];
  const years = Array.from({ length: 11 }, (_, index) => new Date().getFullYear() - 5 + index);

  const handleShowSchedule = (fullDate, description) => {
    setSelectedDay(fullDate);
    setSelectedDescription(description);
    console.log("Giá trị fullDate", fullDate);
    console.log("Giá trị description", description);
    setInfoModalOpen(true);
  };

  const handleBackToSemesterList = () => {
    setSelectedSemester(null);
    setShowShiftSection(false);
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

  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'Đang chờ';
      case 'approve':
      case 'approve_not_teacher':
        return 'Phê duyệt';
      case 'refuse':
        return 'Từ chối';
      default:
        return status;
    }
  };

  const getWeeksInMonth = (year, month) => {
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();
    const firstDayOfWeek = firstDayOfMonth.getDay();
    const weeks = [];
    let week = [];

    for (let i = 0; i < firstDayOfWeek; i++) {
      week.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      week.push(day);
      if (week.length === 7) {
        weeks.push(week);
        week = [];
      }
    }

    if (week.length > 0) {
      while (week.length < 7) {
        week.push(null);
      }
      weeks.push(week);
    }

    return weeks;
  };

  const weeks = getWeeksInMonth(selectedYear, selectedMonth);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {!showShiftSection && (
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Danh sách học kỳ</h1>
          {userRole === 'secretary' && (
            <button
              className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded mb-4"
              onClick={() => setCreateShiftModalOpen(true)}
            >
              Tạo lịch trực
              
            </button>
          )}
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Học kỳ</th>
                <th className="py-2 px-4 border-b">Năm học</th>
                <th className="py-2 px-4 border-b">Ngày bắt đầu</th>
                <th className="py-2 px-4 border-b">Ngày kết thúc</th>
                <th className="py-2 px-4 border-b">Trạng thái</th>
                <th className="py-2 px-4 border-b">Chi tiết</th>
              </tr>
            </thead>
            <tbody>
              {semesters.map((semester) => (
                <tr key={semester.id}>
                  <td className="py-2 px-4 border-b text-center">{semester.id_semester}</td>
                  <td className="py-2 px-4 border-b text-center">{semester.school_year}</td>
                  <td className="py-2 px-4 border-b text-center">{semester.start_day}</td>
                  <td className="py-2 px-4 border-b text-center">{semester.end_day}</td>
                  <td className="py-2 px-4 border-b text-center">{getStatusText(semester.status)}</td>
                  <td className="py-2 px-4 border-b text-center">
                    <button
                      className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded"
                      onClick={() => {
                        setSelectedSemester(semester);
                        setShowShiftSection(true);
                      }}
                    >
                      Chi tiết
                    </button>
                    <button
                          className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded ml-2"
                          onClick={() => handleDeleteSemester(semester.id)}
                        >
                          Xóa
                        </button>
                    {semester.status === 'pending' && userRole === 'dean' && (
                      <>
                        <button
                          className="bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded ml-2"
                          onClick={async () => {
                            try {
                              const response = await deanUpdateSemesterApprove(semester.id, { status: 'approve' });
                              console.log('Phê duyệt thành công:', response);
                              getListSemester().then((data) => {
                                setSemesters(data);
                              });
                            } catch (error) {
                              console.error('Lỗi khi phê duyệt:', error);
                            }
                          }}
                        >
                          Phê duyệt
                        </button>
                        <button
                          className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded ml-2"
                          onClick={async () => {
                            try {
                              const response = await deanUpdateSemesterRefuse(semester.id, { status: 'refuse' });
                              console.log('Từ chối thành công:', response);
                              getListSemester().then((data) => {
                                setSemesters(data);
                              });
                            } catch (error) {
                              console.error('Lỗi khi từ chối:', error);
                            }
                          }}
                        >
                          Từ chối
                        </button>
                      </>
                    )}
                    {semester.status === 'pending' && userRole === 'secretary' && (
                      <>
                        <button
                          className="bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-3 rounded ml-2"
                          onClick={() => {
                            setSelectedSemester(semester);
                            setUpdateSemesterModalOpen(true);
                          }}
                        >
                          Chỉnh sửa
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showShiftSection && selectedSemester && (
        <>
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Danh sách ca trực</h1>
          <button
            className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded mb-4"
            onClick={handleBackToSemesterList}
          >
            Quay lại
          </button>

          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-4">
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
                {years.map((year) => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">Đóng/Mở Đăng Ký</span>
              <div
                className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer 
                  ${selectedSemester.status === 'approve' ? 'bg-green-500' : 'bg-red-500'}`}
                onClick={handleTeacherVisibilityToggle}
              >
                <div
                  className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 
                              ${selectedSemester.status === 'approve' ? 'translate-x-6' : ''}`}
                />
              </div>
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

          <div className="grid grid-cols-7 gap-2">
            {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map((day, index) => (
              <div
                key={index}
                className="text-center font-bold text-gray-700 bg-gray-200 p-2 rounded-lg"
              >
                {day}
              </div>
            ))}

            {weeks.map((week, weekIndex) => (
              <React.Fragment key={weekIndex}>
                {week.map((day, dayIndex) => {
                  if (day === null) {
                    return (
                      <div
                        key={`blank-${dayIndex}`}
                        className="bg-transparent"
                      />
                    );
                  }

                  const shiftData = shifts[day] || [];
                  const fullDate = `${selectedYear}-${(selectedMonth + 1).toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;

                  return (
                    <div
                      key={day}
                      className="p-3 border border-gray-200 rounded-lg bg-white hover:shadow-md transition-all"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-semibold text-gray-700">
                          {day}
                        </span>
                      </div>
                      <ShiftCard
                        day={day}
                        shifts={shiftData}
                        onShowSchedule={handleShowSchedule}
                        fullDate={fullDate}
                      />
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </>
      )}

      <InfoSchedule
        isOpen={infoModalOpen}
        onClose={() => setInfoModalOpen(false)}
        day={selectedDay}
        description={selectedDescription}
      />
      <CreateShiftModal
        isOpen={createShiftModalOpen}
        onClose={() => setCreateShiftModalOpen(false)}
        onSubmit={handleCreateShiftSubmit}
      />
      <UpdateSemesterModal
        isOpen={updateSemesterModalOpen}
        onClose={() => setUpdateSemesterModalOpen(false)}
        onSubmit={handleUpdateSemesterSubmit}
        semester={selectedSemester}
      />
    </div>
  );
};

export default ShiftList; 