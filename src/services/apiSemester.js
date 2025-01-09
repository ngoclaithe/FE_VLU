import apiClient from './apiClient';

export const getListSemester = async() => {
    try {
        const response = await apiClient.get('/semesters');
        return response.data;
    }catch (error) {
        console.error('Error fetching schedules:', error);
        throw error;
    }
}
export const getListSemesterForTeacher = async() => {
    try {
        const response = await apiClient.get('/semesters/for_teacher/');
        return response.data;
    }catch (error) {
        console.error('Error fetching schedules:', error);
        throw error;
    }
}
export const createScheduleSemester = async (data) => {
    try {
        const response = await apiClient.post('/semesters/', data);
        return response.data;
    } catch (error) {
        console.error('Vấn đề chi tiết', error.response.data.detail);

        throw error;
    }
};
export const updateScheduleSemester = async (id, data) => {
    try {
        const response = await apiClient.put(`/schedules/${id}`, data);
        return response.data;
    } catch (error) {
        console.error('Error updating schedule:', error);
        throw error;
    }
};
export const secretaryCreateSemesterShift = async(data) => {
    try {
        const response = await apiClient.post(`/semesters/create-with-shifts/`, data);
        return response.data;
    } catch (error) {
        console.error('Error updating schedule:', error);
        throw error;
    }
}
export const secretaryUpdateSemesterShift = async(id, data) => {
    try {
        const response = await apiClient.put(`/semesters/update-with-shifts/${id}`, data);
        return response.data;
    } catch (error) {
        console.error('Error updating schedule:', error);
        throw error;
    }
}
export const secretaryDeleteSemesterShift = async(id) => {
    try {
        const response = await apiClient.delete(`/semesters/delete-with-shifts/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error updating schedule:', error);
        throw error;
    }
}
export const deanUpdateSemesterApprove = async(id, semester_data_status) => {
    try {
        const response = await apiClient.put(`/semesters/dean_update_semester_approve/${id}`, semester_data_status);
        return response.data;
    } catch (error) {
        console.error('Error updating schedule:', error);
        throw error;
    }
}
export const deanUpdateSemesterApproveNotTeacher = async(id, semester_data_status) => {
    try {
        const response = await apiClient.put(`/semesters/dean_update_semester_approve_not_teacher/${id}`, semester_data_status);
        return response.data;
    } catch (error) {
        console.error('Error updating schedule:', error);
        throw error;
    }
}
export const deanUpdateSemesterRefuse = async(id, semester_data_status) => {
    try {
        const response = await apiClient.put(`/semesters/dean_update_semester_refuse/${id}`, semester_data_status);
        return response.data;
    } catch (error) {
        console.error('Error updating schedule:', error);
        throw error;
    }
}
export const registerTeacherSchedule = async (teacher_id, semester_id, shiftsToRegister) => {
    try {
        const payload = {
            teacher_id: teacher_id,
            semester_id: semester_id,
            shiftsToRegister: shiftsToRegister
        };

        const response = await apiClient.post(`/shifts/register-teacher-shift`, payload);
        return response.data;
    } catch (error) {
        console.error('Error updating schedule:', error);
        throw error;
    }
};