import apiClient from './apiClient';

export const getAllShifts = async (skip = 0, limit = 100) => {
    try {
        const response = await apiClient.get(`shifts/?skip=${skip}&limit=${limit}`);
        return response.data;
    } catch (error) {
        console.error("Get All Shifts Error:", error.response?.data || error.message);
        throw error;
    }
};

export const getShiftById = async (shiftId) => {
    try {
        const response = await apiClient.get(`shifts/${shiftId}`);
        return response.data;
    } catch (error) {
        console.error("Get Shift Error:", error.response?.data || error.message);
        throw error;
    }
};

export const getShiftsByDate = async (date) => {
    try {
        const response = await apiClient.get(`shifts/date/${date}`);
        return response.data;
    } catch (error) {
        console.error("Get Shifts By Date Error:", error.response?.data || error.message);
        throw error;
    }
};

export const getShiftsByMonth = async (year, month) => {
    try {
        const response = await apiClient.get(`shifts/month/${year}/${month}`);
        return response.data;
    } catch (error) {
        console.error("Get Shifts By Month Error:", error.response?.data || error.message);
        throw error;
    }
};
export const getShiftsByMonthForDean = async (year, month) => {
    try {
        const response = await apiClient.get(`shifts/month-for-dean/${year}/${month}`);
        return response.data;
    } catch (error) {
        console.error("Get Shifts By Month For Dean Error:", error.response?.data || error.message);
        throw error;
    }
};
export const createShift = async (shiftData) => {
    try {
        const response = await apiClient.post('shifts/', shiftData);
        return response.data;
    } catch (error) {
        console.error("Create Shift Error:", error.response?.data || error.message);
        throw error;
    }
};

export const updateShift = async (shiftId, shiftData) => {
    try {
        const response = await apiClient.put(`shifts/${shiftId}`, shiftData);
        return response.data;
    } catch (error) {
        console.error("Update Shift Error:", error.response?.data || error.message);
        throw error;
    }
};

export const updateShiftShowTeacher = async (year, month, show_teacher) => {
    try {
        const response = await apiClient.put(`shifts/update_show_teacher/${year}/${month}/${show_teacher}`);
        return response.data;
    } catch (error) {
        console.error("Update Shift Show Teacher Error:", error.response?.data || error.message);
        throw error;
    }
};

export const deleteShift = async (shiftId) => {
    try {
        const response = await apiClient.delete(`shifts/${shiftId}`);
        return response.data;
    } catch (error) {
        console.error("Delete Shift Error:", error.response?.data || error.message);
        throw error;
    }
};
export const getShiftsWaiting = async (date) => {
    try {
        console.log("Gia tri date la:", date);
        const response = await apiClient.get(`shifts/waiting/${date}`);
        
        if (Array.isArray(response.data)) {
            console.log("Dữ liệu nhận được:", response.data); 

            const filteredShifts = response.data.filter(shift => 
                shift.teachers && shift.teachers.length > 0
            );

            console.log("Dữ liệu sau khi lọc:", filteredShifts); 
            return filteredShifts; 
        }

        return []; 
    } catch (error) {
        console.error("Get getShiftsWaiting Error:", error.response?.data || error.message);
        throw error;
    }
};