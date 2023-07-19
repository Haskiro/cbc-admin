import {AxiosResponse} from "axios";
import {HTTP} from "./index.ts";
import {User} from "../types/user.type.ts";

export type LoginData = {
    email: string,
    password: string
}
const loginUser = async (loginData: LoginData): Promise<string> => {
    const res: AxiosResponse<{ token: string }> = await HTTP.post("/auth/login", loginData);
    return res.data.token;
}

const getCurrentUserInfo = async (): Promise<User> => {
    const res: AxiosResponse<User> = await HTTP.get("/accounts/getInfo");
    return res.data;
}

const changePassword = async (passwordData: {password: string, newPassword: string}): Promise<{ok?: boolean, message?: string}> => {
    const res: AxiosResponse<{ok?: boolean, message?: string}> = await HTTP.patch("/accounts/changePassword", passwordData);
    return  res.data;
}

export default {
    loginUser,
    getCurrentUserInfo,
    changePassword
}