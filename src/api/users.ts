import {AxiosResponse} from "axios";
import {HTTP} from "./index";
import {User, UserCreate} from "../types/user.type.ts";

const getList = async (): Promise<User[]> => {
    const res: AxiosResponse<User[]> = await HTTP.get("/accounts/getList");
    return res.data;
}

const editUser = async (newUserData: Partial<User>): Promise<{ ok: boolean }> => {
    const res: AxiosResponse<{ok: boolean}> = await HTTP.patch("/accounts/edit", newUserData);
    return res.data;
}

const createClient = async(newUser: UserCreate): Promise<Partial<User>> => {
    const res: AxiosResponse<Partial<User>> = await HTTP.post("/accounts/createclient", newUser);
    return res.data;
}

export default {
    getList,
    editUser,
    createClient
}