import React, { useState, useEffect } from 'react';
import { createSchedule, deleteSchedule } from '../../services/apiSchedule';
import { getAllTeacher, getSchedulesByDateAndDescription } from '../../services/apiTeacher';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const InfoSchedule = ({ day, description, onClose, isOpen }) => {
  const [schedules, setSchedules] = useState(null);
  const [teacherId, setTeacherId] = useState('');
  const [showTeacherInput, setShowTeacherInput] = useState(false);
  const [teachers, setTeachers] = useState([]);

  useEffect(() => {
    if (isOpen && day && description) {
      getSchedulesByDateAndDescription(day, description).then((data) => {
        if (data && data.teachers) {
          setSchedules(data);
        } else {
          console.error("Dữ liệu trả về không hợp lệ:", data);
        }
      }).catch(error => {
        console.error("Lỗi khi gọi API:", error);
      });
    }
  }, [isOpen, day, description]);

  const handleAddTeacher = () => {
    createSchedule(teacherId, description, day).then(() => {
      getSchedulesByDateAndDescription(day, description).then((data) => {
        if (data && data.teachers) {
          setSchedules(data);
        }
      });
      setTeacherId('');
      setShowTeacherInput(false);
    }).catch(error => {
      toast.error(error.response?.data?.detail || 'Có lỗi xảy ra khi tạo lịch.', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        toastId: "error-toast",
        zIndex: 100,
      });
      console.error("Lỗi khi tạo lịch:", error);
    });
  };

  const handleDeleteTeacher = (teacherId) => {
    console.log("Giá trị teacherId đang chọn:", teacherId);
    console.log("Giá trị description đang chọn:", description);
    console.log("Giá trị date đang chọn:", day);
    deleteSchedule( teacherId, description, day ).then(() => {
      getSchedulesByDateAndDescription(day, description).then((data) => {
        if (data && data.teachers) {
          setSchedules(data);
        }
      });
    });
  };

  const handleShowTeacherInput = () => {
    getAllTeacher().then((data) => {
      setTeachers(data);
      setShowTeacherInput(true);
    }).catch(error => {
      console.error("Lỗi khi lấy danh sách giáo viên:", error);
    });
  };

  if (!isOpen || !schedules) return null;

  return (
    <><ToastContainer/>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-6">
          <h2 className="text-xl font-semibold mb-4">Thông tin lịch trực - {day} (Mô tả: {description})</h2>
          <div className="space-y-6">
            <div key={schedules.shift_id} className="border p-4 rounded-md">
              <h3 className="text-lg font-bold mb-2">
                Ca trực {schedules.description} ({schedules.date})
              </h3>
              <div className="space-y-2">
                {schedules.teachers.map((teacher) => (
                  <div
                    key={teacher.teacher_id}
                    className="flex justify-between items-center bg-gray-100 p-2 rounded-md"
                  >
                    <span>
                      {teacher.teacher_name} - {teacher.phone} - {teacher.subject}
                    </span>
                    <button
                      onClick={() => handleDeleteTeacher(teacher.teacher_id)}
                      className="text-red-600 hover:underline"
                    >
                      Xóa
                    </button>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                {!showTeacherInput && (
                  <button
                    onClick={handleShowTeacherInput}
                    className="mt-2 bg-blue-500 text-white py-2 w-full rounded-md"
                  >
                    Thêm người trực
                  </button>
                )}

                {showTeacherInput && (
                  <>
                    <select
                      value={teacherId}
                      onChange={(e) => setTeacherId(e.target.value)}
                      className="p-2 border rounded-md w-full"
                    >
                      <option value="">Chọn giáo viên</option>
                      {teachers.map((teacher) => (
                        <option key={teacher.id} value={teacher.id}>
                          {teacher.name} - {teacher.subject} - {teacher.id}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={handleAddTeacher}
                      className="mt-2 bg-blue-500 text-white py-2 w-full rounded-md"
                    >
                      Thêm giáo viên
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="mt-6 bg-gray-500 text-white py-2 w-full rounded-md"
          >
            Đóng
          </button>
        </div>
      </div>
    </>

  );
};

export default InfoSchedule;
