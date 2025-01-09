import apiClient from './apiClient';

export const uploadAttendanceTeacherImageCheckIn = async (teacher_id, file, description) => {
    try {
        const formData = new FormData();
        formData.append("file", file, "attendance_image.png");
        formData.append("description", description); 

        const response = await apiClient.post(`/attendance/${teacher_id}/upload-image/check_in`, formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            },
        });

        console.log("Giá trị trong form:");
        formData.forEach((value, key) => {
            console.log(key + ": " + value);
        });
        return response.data;
    } catch (error) {
        console.error("Update Teacher Image Check-In Error:", error.response?.data || error.message);
        throw error;
    }
};

export const uploadAttendanceTeacherImageCheckOut = async (teacher_id, file, description) => {
    try {
        const formData = new FormData();
        formData.append("file", file, "attendance_image.png");
        formData.append("description", description); 

        const response = await apiClient.post(`/attendance/${teacher_id}/upload-image/check_out`, formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            },
        });

        console.log("Giá trị trong form:");
        formData.forEach((value, key) => {
            console.log(key + ": " + value);
        });
        return response.data;
    } catch (error) {
        console.error("Update Teacher Image Check-Out Error:", error.response?.data || error.message);
        throw error;
    }
};
export const verifyAttendance = async (date) => {
    try {
        const dateStatisticalData = {
            date: date, 
        };

        const response = await apiClient.post('/attendance/verify_timing', dateStatisticalData);

        return response.data;
    } catch (error) {
        console.error('Vấn đề chi tiết', error.response.data.detail);
        throw error;
    }
};
export const getStatistical = async (date) => {
    try {
        const dateStatisticalData = {
            date: date, 
        };

        const response = await apiClient.post('/attendance/get-attendance-details', dateStatisticalData);

        return response.data;
    } catch (error) {
        console.error('Vấn đề chi tiết', error.response.data.detail);
        throw error;
    }
};
export const getAttendanceByTeacher = async (teacherId) => {
    try {
        const response = await apiClient.get(`/attendance/get-attendance-by-teacher/${teacherId}`);
        return response.data;
    } catch (error) {
        console.error('Vấn đề chi tiết:', error.response?.data?.detail || error.message);
        throw error;
    }
};
