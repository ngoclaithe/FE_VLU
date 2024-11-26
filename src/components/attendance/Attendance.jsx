import React, { useRef, useState, useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import { uploadAttendanceTeacherImageCheckIn, uploadAttendanceTeacherImageCheckOut } from "../../services/apiAttendance";
import { getTeacherIdByEmail } from "../../services/apiAuth";
import { getSchedulesTodayByTeacherId } from "../../services/apiSchedule";
import { descriptionToTime } from '../../services/shiftUtils';
import { toast, ToastContainer } from 'react-toastify';

const AttendanceSection = () => {
    const videoRef = useRef(null);
    const [capturedImage, setCapturedImage] = useState(null);
    const [teacherId, setTeacherId] = useState(null);
    const [isCameraActive, setIsCameraActive] = useState(false);
    const [todaySchedules, setTodaySchedules] = useState([]);
    const [selectedShift, setSelectedShift] = useState(null); 

    const fetchTeacherData = async () => {
        try {
            const email = sessionStorage.getItem("email");
            const accessToken = sessionStorage.getItem("token");
            const fetchedTeacherId = await getTeacherIdByEmail(email, accessToken);
            setTeacherId(fetchedTeacherId);

            try {
                const schedules = await getSchedulesTodayByTeacherId(fetchedTeacherId);
                setTodaySchedules(schedules);

                if (schedules.length === 0) {
                    toast.info("Bạn không có ca trực hôm nay");
                }
            } catch (scheduleError) {
                toast.error("Không thể lấy lịch trực: " + scheduleError.message);
            }
        } catch (error) {
            console.error("Failed to fetch teacher ID:", error);
            toast.error("Không thể lấy thông tin giáo viên");
        }
    };

    useEffect(() => {
        fetchTeacherData();
    }, []);

    const startCamera = () => {
        navigator.mediaDevices
            .getUserMedia({ video: true })
            .then((stream) => {
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    videoRef.current.play();
                    setIsCameraActive(true);
                }
            })
            .catch((err) => {
                console.error("Error accessing camera:", err);
                toast.error("Không thể truy cập camera");
            });
    };

    const stopCamera = () => {
        const stream = videoRef.current?.srcObject;
        const tracks = stream?.getTracks() || [];

        tracks.forEach(track => track.stop());

        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }

        setIsCameraActive(false);
    };

    const handleAttendance = (checkType) => {
        if (!isCameraActive || !videoRef.current) {
            toast.error("Camera chưa được kích hoạt");
            return;
        }

        if (!selectedShift) {
            toast.error("Bạn chưa chọn ca điểm danh");
            return;
        }

        const video = videoRef.current;
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        const imageData = canvas.toDataURL("image/png");

        const byteString = atob(imageData.split(",")[1]);
        const arrayBuffer = new ArrayBuffer(byteString.length);
        const uintArray = new Uint8Array(arrayBuffer);

        for (let i = 0; i < byteString.length; i++) {
            uintArray[i] = byteString.charCodeAt(i);
        }

        const blob = new Blob([uintArray], { type: "image/png" });

        if (teacherId) {
            const description = selectedShift.description; 
            if (checkType === 'check_in') {
                uploadAttendanceTeacherImageCheckIn(teacherId, blob, description)
                    .then(() => toast.success("Điểm danh thành công"))
                    .catch(() => toast.error("Lỗi khi tải ảnh điểm danh vào"));
            } else if (checkType === 'check_out') {
                uploadAttendanceTeacherImageCheckOut(teacherId, blob, description)
                    .then(() => toast.success("Điểm danh ra thành công"))
                    .catch(() => toast.error("Lỗi khi tải ảnh điểm danh ra"));
            }
        } else {
            toast.error("Không có thông tin giáo viên");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center p-6 bg-gray-100 min-h-screen">
            <ToastContainer />

            {todaySchedules.length > 0 && (
                <div className="mb-6 w-full max-w-md">
                    <h3 className="text-xl font-bold mb-3 text-center">Lịch Trực Hôm Nay</h3>
                    {todaySchedules.map((schedule, index) => (
                        <div
                            key={index}
                            onClick={() => setSelectedShift(schedule)}
                            className={`bg-white rounded-lg shadow-md p-4 mb-3 cursor-pointer ${selectedShift === schedule ? "border-2 border-blue-500" : ""}`}
                        >
                            <p>
                                <strong>Ca:</strong> {schedule.description} 
                                ({descriptionToTime[schedule.description] || "Không có thông tin"})
                            </p>
                            <p><strong>Ngày:</strong> {new Date(schedule.date).toLocaleDateString()}</p>
                        </div>
                    ))}
                </div>
            )}

            <section className="mb-6">
                <video
                    ref={videoRef}
                    className="border rounded-lg shadow-md w-full max-w-md"
                />
                {capturedImage && (
                    <div className="mt-4">
                        <h4 className="text-lg font-semibold text-gray-700">Ảnh chụp:</h4>
                        <img
                            src={capturedImage}
                            alt="Captured"
                            className="border rounded-lg shadow-md w-full max-w-md mt-2"
                        />
                    </div>
                )}
            </section>

            <div className="space-x-4">
                <button
                    onClick={startCamera}
                    className="px-6 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition duration-200"
                >
                    Bật Camera
                </button>
                <button
                    onClick={() => handleAttendance('check_in')}
                    disabled={!isCameraActive}
                    className={`px-6 py-2 text-white rounded-lg shadow-md transition duration-200 ${isCameraActive
                        ? "bg-green-500 hover:bg-green-600"
                        : "bg-gray-400 cursor-not-allowed"
                    }`}
                >
                    Điểm Danh
                </button>
                <button
                    onClick={() => handleAttendance('check_out')}
                    disabled={!isCameraActive}
                    className={`px-6 py-2 text-white rounded-lg shadow-md transition duration-200 ${isCameraActive
                        ? "bg-yellow-500 hover:bg-yellow-600"
                        : "bg-gray-400 cursor-not-allowed"
                    }`}
                >
                    Điểm Danh Ra
                </button>
                <button
                    onClick={stopCamera}
                    disabled={!isCameraActive}
                    className={`px-6 py-2 text-white rounded-lg shadow-md transition duration-200 ${isCameraActive
                        ? "bg-red-500 hover:bg-red-600"
                        : "bg-gray-400 cursor-not-allowed"
                    }`}
                >
                    Tắt Camera
                </button>
            </div>
        </div>
    );
};

export default AttendanceSection;
