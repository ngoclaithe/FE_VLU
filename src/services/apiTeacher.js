import apiClient from './apiClient';

export const getAllTeacher = async () => {
    try {
        const response = await apiClient.get("/teachers/");
        console.log("Teachers List Response:", response.data);
        return response.data;
    } catch (error) {
        console.error("Get Teachers List Error:", error.response?.data || error.message);
        throw error;
    }
};

export const getTeacherById = async (teacher_id) => {
    try {
        const response = await apiClient.get(`/teachers/${teacher_id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getSchedulesByDate = async (targetDate) => {
    try {
        const response = await apiClient.get(`/teachers/shifts/${targetDate}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching schedules by date:', error);
        throw error;
    }
};

export const getSchedulesByDateAndDescription = async (targetDate, description) => {
    try {
        const response = await apiClient.get(`/teachers/shifts/${targetDate}/description/${description}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching schedules by date:', error);
        throw error;
    }
};

export const updateTeacher = async (teacher_id, updatedData) => {
    try {
        const response = await apiClient.put(`/teachers/${teacher_id}`, updatedData);
        console.log("Update Teacher Response:", response.data);
        return response.data;
    } catch (error) {
        console.error("Update Teacher Error:", error.response?.data || error.message);
        throw error;
    }
};

export const updateTeacherImage = async (teacher_id, file) => {
    try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await apiClient.post(`/teachers/${teacher_id}/upload-image`, formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            },
        });
        console.log("Update Teacher Image Response:", response.data);
        return response.data;
    } catch (error) {
        console.error("Update Teacher Image Error:", error.response?.data || error.message);
        throw error;
    }
};

export const getTeacherImage = async (teacher_id) => {
    try {
        const response = await apiClient.get(`/teachers/${teacher_id}/image`);
        // console.log("Teacher Image Response:", response.data);
        return response.data.image_data; 
    } catch (error) {
        console.error("Get Teacher Image Error:", error.response?.data || error.message);
        throw error;
    }
};