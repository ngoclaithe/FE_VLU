import apiClient from './apiClient';

export const getSchedules = async (skip = 0, limit = 100) => {
    try {
        const response = await apiClient.get('/schedules', {
            params: {
                skip,
                limit
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching schedules:', error);
        throw error;
    }
};

export const getSchedulesByMonth = async (teacher_id,month) => {
    try {
        const response = await apiClient.get(`/schedules/monthly/${teacher_id}/${month}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching schedules by date:', error);
        throw error;
    }
};

export const createSchedule = async (teacherId, description, date) => {
    try {
        const scheduleData = {
            teacher_id: teacherId, 
            description: description, 
            date: date, 
        };

        const response = await apiClient.post('/schedules/register', scheduleData);

        return response.data;
    } catch (error) {
        console.error('Vấn đề chi tiết', error.response.data.detail);

        throw error;
    }
};
export const teacherRegisterSchedule = async (teacherId, description, date) => {
    try {
        const scheduleData = {
            teacher_id: teacherId, 
            description: description, 
            date: date, 
            note: "success"
        };

        const response = await apiClient.post('/schedules/teacher_register_schedule', scheduleData);

        return response.data;
    } catch (error) {
        console.error('Vấn đề chi tiết', error.response.data.detail);

        throw error;
    }
};
export const updateSchedule = async (scheduleId, scheduleData) => {
    try {
        const response = await apiClient.put(`/schedules/${scheduleId}`, scheduleData);
        return response.data;
    } catch (error) {
        console.error('Error updating schedule:', error);
        throw error;
    }
};

export const deleteSchedule = async (teacherId, description, date) => {
    try {
        await apiClient.delete(`/schedules/remove_by_teacher/${teacherId}/${description}/${date}`);
    } catch (error) {
        console.error('Error deleting schedule:', error);
        throw error;
    }
};
export const changeSchedule = async (teacherId, descriptionold, dateold, descriptionnew, datenew) => {
    try {
        await apiClient.put(`/schedules/change_by_teacher/${teacherId}/${descriptionold}/${dateold}/${descriptionnew}/${datenew}/`);
    } catch (error) {
        console.error('Error deleting schedule:', error);
        throw error;
    }
};
export const leaveSchedule = async (teacherId, description, date, reason) => {
    try {
        await apiClient.put(`/schedules/leave_by_teacher/${teacherId}/${description}/${date}`, { reason });
    } catch (error) {
        console.error('Error leaving schedule:', error);
        throw error;
    }
};
export const getSchedulesTodayByTeacherId = async (teacher_id) => {
    try {
        const response = await apiClient.get(`/schedules/today/${teacher_id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching schedules by date:', error);
        throw error;
    }
};

export const updateExcel = async (file) => {
    try {
        const response = await apiClient.post('/schedules/secretary_upload_schedule', file, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        return response.data;
    } catch (error) {
        console.error('Chi tiết lỗi:', error.response ? error.response.data : error);
        throw error;
    }
};