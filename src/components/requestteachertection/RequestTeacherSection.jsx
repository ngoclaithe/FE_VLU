import React, { useState } from "react"; 
import { getShiftsWaiting } from "../../services/apiShift";
import { updateSchedule } from "../../services/apiSchedule";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RequestTeacherSection = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]); 
  const [shiftData, setShiftData] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleCheckShifts = async () => {
    setLoading(true);
    try {
      const response = await getShiftsWaiting(selectedDate); 
      if (response && response.length > 0) {
        setShiftData(response);
      } else {
        setShiftData([]);
        toast.info("Không có dữ liệu ca làm việc cho ngày này.");
      }
    } catch (error) {
      toast.error("Lỗi khi lấy dữ liệu: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (scheduleId, shift) => { 
    try {
      if (!shift.teachers || shift.teachers.length === 0) {
        toast.error("Không có giáo viên cho ca trực này.");
        return;
      }
  
      const teacher_id = shift.teachers[0].teacher_id;
      const note = shift.teachers[0].note === "waiting" ? "success" : shift.teachers[0].note === "leave_of_absence" ? "leave_approval" : "success";

      const scheduleData = { 
        teacher_id: teacher_id, 
        description: shift.description, 
        date: shift.date,              
        note: note               
      };
    
      const response = await updateSchedule(scheduleId, scheduleData);
      if (response) {
        toast.success("Phê duyệt thành công!");
        handleCheckShifts();
      }
    } catch (error) {
      toast.error("Lỗi khi phê duyệt: " + error.message);
    }
  };

  const handleDelete = async(scheduleId, shift) => {
    try {
        if (!shift.teachers || shift.teachers.length === 0) {
          toast.error("Không có giáo viên cho ca trực này.");
          return;
        }
    
        const teacher_id = shift.teachers[0].teacher_id;
    
        const scheduleData = { 
          teacher_id: teacher_id, 
          description: shift.description, 
          date: shift.date,              
          note: "fail"               
        };
      
        const response = await updateSchedule(scheduleId, scheduleData);
        if (response) {
          toast.success("Từ chối!");
          handleCheckShifts();
        }
      } catch (error) {
        toast.error("Lỗi khi phê duyệt: " + error.message);
      }
  };

  const handleReason = (shift) => {
    if (shift.teachers.length > 0) {
      const teacher = shift.teachers[0];
      toast.info(`Lý do: ${teacher.detail_reason || "Không có chi tiết lý do."}`);
    } else {
      toast.info("Không có lý do được cung cấp.");
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Kiểm tra yêu cầu giáo viên</h2>
      <div className="flex items-center space-x-4 mb-6">
        <input 
          type="date" 
          value={selectedDate} 
          onChange={(e) => setSelectedDate(e.target.value)} 
          className="border rounded px-2 py-1"
        />
        <button 
          onClick={handleCheckShifts}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition disabled:bg-gray-400"
        >
          {loading ? "Đang kiểm tra..." : "Kiểm tra yêu cầu"}
        </button>
      </div>

      {shiftData.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">Mã ca</th>
                <th className="border p-2">Ngày</th>
                <th className="border p-2">Ca trực</th>
                <th className="border p-2">ID Giáo viên</th>
                <th className="border p-2">Giáo viên</th>
                <th className="border p-2">Bộ môn</th>
                <th className="border p-2">Số điện thoại</th>
                <th className="border p-2">Yêu cầu</th>
                <th className="border p-2">Hành động</th> 
              </tr>
            </thead>
            <tbody>
              {shiftData.map((shift, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="border p-2 text-center">{shift.shift_id}</td>
                  <td className="border p-2 text-center">{shift.date}</td>
                  <td className="border p-2 text-center">{shift.description}</td>
                  <td className="border p-2">
                    {shift.teachers.length > 0 ? (
                      shift.teachers.map((teacher, idx) => (
                        <div key={idx} className="mb-2">
                          <div>{teacher.teacher_id}</div>
                        </div>
                      ))
                    ) : (
                      <div className="text-red-600">Chưa có ID giáo viên</div>
                    )}
                  </td>
                  <td className="border p-2">
                    {shift.teachers.length > 0 ? (
                      shift.teachers.map((teacher, idx) => (
                        <div key={idx} className="mb-2">
                          <div>{teacher.teacher_name}</div>
                        </div>
                      ))
                    ) : (
                      <div className="text-red-600">Chưa có giáo viên</div>
                    )}
                  </td>
                  <td className="border p-2">
                    {shift.teachers.length > 0 ? (
                      shift.teachers.map((teacher, idx) => (
                        <div key={idx} className="mb-2">{teacher.subject}</div>
                      ))
                    ) : (
                      <div className="text-red-600">Không có môn học</div>
                    )}
                  </td>
                  <td className="border p-2">
                    {shift.teachers.length > 0 ? (
                      shift.teachers.map((teacher, idx) => (
                        <div key={idx} className="mb-2">{teacher.phone}</div>
                      ))
                    ) : (
                      <div className="text-red-600">Chưa có số điện thoại</div>
                    )}
                  </td>
                  <td className="border p-2 text-center">
                    {shift.teachers.length > 0 ? (
                      shift.teachers.map((teacher, idx) => (
                        <div key={idx} className="mb-2">
                          {teacher.note === "leave_of_absence" ? "Giáo viên xin nghỉ" : 
                           teacher.note === "waiting" ? "Giáo viên xin đổi ca" : ""}
                        </div>
                      ))
                    ) : (
                      <div className="text-red-600">Không có yêu cầu</div>
                    )}
                  </td>
                  <td className="border p-2 text-center">
                    <button
                      onClick={() => handleApprove(shift.shift_id, shift)}
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mr-2"
                    >
                      Phê duyệt
                    </button>
                    <button
                      onClick={() => handleDelete(shift.shift_id, shift)}
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 mr-2"
                    >
                      Từ chối
                    </button>
                    <button
                      onClick={() => handleReason(shift)}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                      Lý do
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default RequestTeacherSection;