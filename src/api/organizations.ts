import {AxiosResponse} from "axios";
import {HTTP} from "./index";
import {Organization} from "../types/organization.type";

const getList = async (category: string): Promise<Organization[]> => {
    const query = category !== "Все" ? new URLSearchParams({category}).toString() : "";
    const res: AxiosResponse<Organization[]> = await HTTP.get("/organizations/getList?" + query);
    return res.data;
}

const getCategories = async (): Promise<string[]> => {
    const res: AxiosResponse<{ category: string }[]> = await HTTP.get("/organizations/getCategories");
    const categories = res.data.map((el) => el.category);
    categories.unshift("Все");
    return categories;
}

const getOrganizationById = async (id: string): Promise<Organization> => {
    const query = new URLSearchParams({id}).toString();
    const res: AxiosResponse<Organization> = await HTTP.get("/organizations/getInfo?" + query);
    return res.data;
}


export default {
    getList,
    getCategories,
    getOrganizationById
}