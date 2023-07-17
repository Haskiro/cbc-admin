import {AxiosResponse} from "axios";
import {HTTP} from "./index.ts";
import {User} from "../types/user.type.ts";

export type LoginData = {
    email: string,
    password: string
}
const loginUser = async (loginData: LoginData): Promise<string> => {
    const res: AxiosResponse<{ token: string }> = await HTTP.post("/auth/login", loginData);
    HTTP.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
    return res.data.token;
}

const getCurrentUserInfo = async (): Promise<User> => {
    const res: AxiosResponse<User> = await HTTP.get("/accounts/getInfo");
    return res.data;
}

export default {
    loginUser,
    getCurrentUserInfo
}