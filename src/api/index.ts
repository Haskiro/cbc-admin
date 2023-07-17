import axios from "axios";
import auth from "./auth.ts"
import organizations from "./organizations.ts";

export const HTTP = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default {
    auth,
    organizations
}