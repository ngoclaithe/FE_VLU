import axios from 'axios';

const apiClient = axios.create({
    baseURL: "https://d99d-1-55-14-110.ngrok-free.app", 
    headers: {
        "Content-Type": "application/json", 
        "ngrok-skip-browser-warning": "true", 
    },
});

export default apiClient;