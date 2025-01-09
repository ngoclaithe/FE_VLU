import apiClient from './apiClient';

export const registerUser = async (email, password, role) => {
    try {
        const response = await apiClient.post("/users/register", {
            email,
            password,
            role,
        });
        console.log("Register Response:", response.data);
        return response.data;
    } catch (error) {
        console.error("Register Error:", error.response?.data || error.message);
        throw error;
    }
};

export const loginUser = async (email, password) => {
    try {
        const formData = new URLSearchParams();
        formData.append("username", email);
        formData.append("password", password);

        const response = await apiClient.post("/users/login", formData, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        });
        console.log("Login Response:", response.data);
        return response.data;
    } catch (error) {
        console.error("Login Error:", error.response?.data || error.message);
        throw error;
    }
};

export const getUserInfo = async (accessToken) => {
    try {
        const response = await apiClient.get("/users/me", {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        console.log("User Info Response:", response.data);
        return response.data;
    } catch (error) {
        console.error("Get User Info Error:", error.response?.data || error.message);
        throw error;
    }
};

export const getAllUsers = async (accessToken) => {
    try {
        const response = await apiClient.get("/users", {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        console.log("All Users Response:", response.data);
        return response.data;
    } catch (error) {
        console.error("Get All Users Error:", error.response?.data || error.message);
        throw error;
    }
};
export const updateRoleUser = async (accessToken, user_id, role) => { 
    try {
        const response = await apiClient.put(
            `/users/${user_id}`, 
            { role }, 
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
            }
        );
        console.log("Update Role Response:", response.data);
        return response.data;
    } catch (error) {
        console.error("Update Role Error:", error.response?.data || error.message);
        throw error;
    }
};
export const deleteUser = async (accessToken, user_id) => { 
    try {
        const response = await apiClient.delete(
            `/users/${user_id}`, 
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
            }
        );
        console.log("Delete User Response:", response.data);
        return response.data;
    } catch (error) {
        console.error("Delete User Error:", error.response?.data || error.message);
        throw error;
    }
};

export const getTeacherIdByEmail = async (email, accessToken) => {
    try {
        const response = await apiClient.get(`/users/teacher-id/${email}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        console.log("Teacher ID Response:", response.data);
        return response.data;
    } catch (error) {
        console.error("Get Teacher ID Error:", error.response?.data || error.message);
        throw error;
    }
};