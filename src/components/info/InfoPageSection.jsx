import React, { useEffect, useState } from 'react';
import { getTeacherById, updateTeacher, updateTeacherImage, getTeacherImage } from '../../services/apiTeacher';
import { getTeacherIdByEmail } from '../../services/apiAuth';

const InfoPageSection = () => {
    const [teacherData, setTeacherData] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [updatedData, setUpdatedData] = useState({});
    const [imageFile, setImageFile] = useState(null);
    const [imageSrc, setImageSrc] = useState(null); 

    const fetchTeacherData = async () => {
        try {
            const email = sessionStorage.getItem('email');
            const accessToken = sessionStorage.getItem('token');
            const teacherId = await getTeacherIdByEmail(email, accessToken);
            console.log("Gia tri teacherId", teacherId);
            const data = await getTeacherById(teacherId);
            setTeacherData(data);
            setUpdatedData(data);
            fetchTeacherImage(teacherId); 
        } catch (error) {
            console.error("Failed to fetch teacher data:", error);
        }
    };

    const fetchTeacherImage = async (teacherId) => {
        try {
            const imageData = await getTeacherImage(teacherId);
            console.log("gia tri imageData",imageData);
            setImageSrc(imageData); 
        } catch (error) {
            console.error("Failed to fetch teacher image:", error);
        }
    };

    useEffect(() => {
        fetchTeacherData();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUpdatedData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleImageChange = (e) => {
        setImageFile(e.target.files[0]);
    };

    const handleUpdateInfo = async () => {
        try {
            await updateTeacher(teacherData.id, updatedData);
            setIsEditing(false);
            fetchTeacherData(); 
        } catch (error) {
            console.error("Failed to update teacher info:", error);
        }
    };

    const handleUpdateImage = async () => {
        if (!imageFile) return;
        try {
            console.log("Gia tri teacherData.id", teacherData.id);
            console.log("Gia tri imageFile", imageFile);
            await updateTeacherImage(teacherData.id, imageFile);
            setImageFile(null);
            fetchTeacherImage(teacherData.id); 
        } catch (error) {
            console.error("Failed to update teacher image:", error);
        }
    };

    if (!teacherData) {
        return <p className="text-center text-gray-500">Loading...</p>;
    }

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-md">
            <h1 className="text-2xl font-bold text-center mb-6">Thông tin giảng viên</h1>
            <div className="flex items-center mb-6">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                    {imageSrc ? (
                        <img
                            src={`${imageSrc}`} 
                            alt={teacherData.name}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-500">
                            No Image
                        </div>
                    )}
                </div>
                <div className="ml-6">
                    {!isEditing ? (
                        <>
                            <p className="text-lg font-semibold">{teacherData.name}</p>
                            <p className="text-gray-700">Bộ môn: {teacherData.subject}</p>
                            <p className="text-gray-700">Số điện thoại: {teacherData.phone}</p>
                            <p className="text-gray-700">Mã CBGV {teacherData.teacher_code}</p>
                        </>
                    ) : (
                        <div className="space-y-4">
                            <input
                                type="text"
                                name="name"
                                value={updatedData.name}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                                placeholder="Tên giáo viên"
                            />
                            <input
                                type="text"
                                name="subject"
                                value={updatedData.subject}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                                placeholder="Môn học"
                            />
                            <input
                                type="text"
                                name="phone"
                                value={updatedData.phone}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                                placeholder="Số điện thoại"
                            />
                            <input
                                type="text"
                                name="teacher_code"
                                value={updatedData.teacher_code}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                                placeholder="Mã CBGV"
                            />
                        </div>
                    )}
                </div>
            </div>
            <div className="flex space-x-4">
                {!isEditing ? (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    >
                        Chỉnh sửa
                    </button>
                ) : (
                    <button
                        onClick={handleUpdateInfo}
                        className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                    >
                        Lưu
                    </button>
                )}
                <label className="cursor-pointer px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300">
                    <input
                        type="file"
                        className="hidden"
                        onChange={handleImageChange}
                    />
                    Cập nhật ảnh
                </label>
                <button
                    onClick={handleUpdateImage}
                    className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600"
                    disabled={!imageFile}
                >
                    Lưu ảnh
                </button>
            </div>
        </div>
    );
};

export default InfoPageSection;
