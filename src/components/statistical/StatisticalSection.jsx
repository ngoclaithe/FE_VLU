import React, { useState } from "react";
import { verifyAttendance, getStatistical } from "../../services/apiAttendance";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const StatisticalSection = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [attendanceDetails, setAttendanceDetails] = useState([]);

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); 
    const day = date.getDate().toString().padStart(2, '0'); 
    return `${year}-${month}-${day}`;
  };

  const handleStatistical = async () => {
    try {

      const formattedDate = formatDate(selectedDate);

      await verifyAttendance(formattedDate);

      const response = await getStatistical(formattedDate);
      
      if (response.data.success) {
        setAttendanceDetails(response.data.attendance_details);
        toast.success("Lấy thống kê thành công!");
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra khi thống kê: " + error.message);
    }
  };

  const renderAttendanceStatus = (status) => {
    switch(status) {
      case "Đã điểm danh":
        return <span className="text-green-600 font-semibold">{status}</span>;
      case "Chưa điểm danh":
        return <span className="text-red-600 font-semibold">{status}</span>;
      default:
        return status;
    }
  };

  const renderNoteStyle = (note) => {
    if (note.includes("muộn")) {
      return <span className="text-orange-600 font-semibold">{note}</span>;
    }
    if (note === "Chưa điểm danh") {
      return <span className="text-red-600">{note}</span>;
    }
    return <span className="text-green-600">{note}</span>;
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Thống kê giảng viên trực</h2>
      <div className="flex items-center space-x-4 mb-6">
        <input 
          type="date" 
          value={formatDate(selectedDate)} 
          onChange={(e) => setSelectedDate(new Date(e.target.value))}
          className="border rounded px-2 py-1"
        />
        <button 
          onClick={handleStatistical}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          Thống kê
        </button>
      </div>

      {attendanceDetails.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">Ca</th>
                <th className="border p-2">Giáo Viên</th>
                <th className="border p-2">Giờ Vào</th>
                <th className="border p-2">Ghi Chú Vào</th>
                <th className="border p-2">Giờ Ra</th>
                <th className="border p-2">Ghi Chú Ra</th>
                <th className="border p-2">Trạng Thái</th>
              </tr>
            </thead>
            <tbody>
              {attendanceDetails.map((detail, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="border p-2 text-center">{detail.shift_description}</td>
                  <td className="border p-2">{detail.teacher_name}</td>
                  <td className="border p-2 text-center">{detail.time_check_in || 'Chưa điểm danh'}</td>
                  <td className="border p-2 text-center">{renderNoteStyle(detail.note_check_in)}</td>
                  <td className="border p-2 text-center">{detail.time_check_out || 'Chưa điểm danh'}</td>
                  <td className="border p-2 text-center">{renderNoteStyle(detail.note_check_out)}</td>
                  <td className="border p-2 text-center">{renderAttendanceStatus(detail.attendance_status)}</td>
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

export default StatisticalSection;
