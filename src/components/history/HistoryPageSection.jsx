import React, { useState, useEffect } from "react";
import { getAttendanceByTeacher } from "../../services/apiAttendance";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getTeacherIdByEmail } from "../../services/apiAuth";

const HistoryPageSec = () => {
    const [teacherId, setTeacherId] = useState(null);
    const [attendanceData, setAttendanceData] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchTeacherData = async () => {
        try {
            const email = sessionStorage.getItem("email");
            const accessToken = sessionStorage.getItem("token");
            const fetchedTeacherId = await getTeacherIdByEmail(email, accessToken);
            setTeacherId(fetchedTeacherId);

            const attendanceHistory = await getAttendanceByTeacher(fetchedTeacherId);
            setAttendanceData(attendanceHistory); 
            setLoading(false);  

        } catch (error) {
            setLoading(false); 
            toast.error("Lỗi khi tải dữ liệu điểm danh.");
        }
    };

    useEffect(() => {
        fetchTeacherData();
    }, []); 

    const renderCheckMark = (value) => {
        return value === "true" ? "✔" : "";
    };

    const renderShift = (description) => {
        switch (description) {
            case "1":
                return "Sáng";
            case "2":
                return "Chiều";
            case "3":
                return "Tối";
            default:
                return "";
        }
    };

    const renderAttendanceTable = () => {
        if (attendanceData.length === 0) {
            return <p className="text-gray-500">Không có thông tin điểm danh.</p>;
        }

        return (
            <table className="min-w-full table-auto bg-white shadow-md rounded-lg">
                <thead>
                    <tr className="bg-gray-100 text-left">
                        <th className="px-4 py-2 font-semibold text-gray-700">Ngày</th>
                        <th className="px-4 py-2 font-semibold text-gray-700">Điểm danh vào</th>
                        <th className="px-4 py-2 font-semibold text-gray-700">Điểm danh ra</th>
                        <th className="px-4 py-2 font-semibold text-gray-700">Thời gian</th>
                        <th className="px-4 py-2 font-semibold text-gray-700">Ca trực</th>
                        <th className="px-4 py-2 font-semibold text-gray-700">Ghi chú</th>
                    </tr>
                </thead>
                <tbody>
                    {attendanceData.map((record, index) => (
                        <tr key={index} className="border-t">
                            <td className="px-4 py-2 text-gray-800">{record.date}</td>
                            <td className="px-4 py-2 text-gray-800">{renderCheckMark(record.check_in)}</td>
                            <td className="px-4 py-2 text-gray-800">{renderCheckMark(record.check_out)}</td>
                            <td className="px-4 py-2 text-gray-800">{record.time}</td>
                            <td className="px-4 py-2 text-gray-800">{renderShift(record.description)}</td> {/* Chuyển đổi description thành ca trực */}
                            <td className="px-4 py-2 text-gray-800">{record.note}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    };

    return (
        <div className="history-page p-6">
            <ToastContainer />
            <h2 className="text-2xl font-bold mb-4">Lịch sử điểm danh</h2>

            {loading ? (
                <p className="text-gray-500">Đang tải dữ liệu...</p>
            ) : (
                renderAttendanceTable()  
            )}
        </div>
    );
};

export default HistoryPageSec;
