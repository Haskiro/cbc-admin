import {AxiosResponse} from "axios";
import {HTTP} from "./index";
import {Organization} from "../types/organization.type";
import {User} from "../types/user.type.ts";

const getList = async (): Promise<User[]> => {
    const res: AxiosResponse<User[]> = await HTTP.get("/accounts/getList");
    return res.data;
}

const editUser = async (newUserData: Partial<User>): Promise<{ ok: boolean }> => {
    const res: AxiosResponse<{ok: boolean}> = await HTTP.patch("/accounts/edit");
    return res.data;
}

export default {
    getList,
    editUser
}