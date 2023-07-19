import axios from "axios";
import auth from "./auth"
import organizations from "./organizations";
import users from "./users"
import {CustomError} from "../types/customError.ts";

export const HTTP = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

HTTP.interceptors.response.use((response) => {
    if (response.data.message) {
        const customError = new CustomError(response.data.message);
        customError.response = response;
        customError.isAxiosError = true;

        return Promise.reject(customError);
    }
    return response;
}, (error) => {
    return Promise.reject(error);
});

export default {
    auth,
    organizations,
    users
}