import {AxiosResponse} from "axios";
import {HTTP} from "./index";
import {Organization, OrganizationNew} from "../types/organization.type";
import {Offer} from "../types/offer.type.ts";

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

const createOrganization = async (newOrg: Omit<OrganizationNew, "icon"> & {
    icon: File;
}): Promise<Organization> => {
    const res: AxiosResponse<Organization> = await HTTP.post("/organizations/create", newOrg, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
    return res.data;
}

const editOrganization = async (orgData: Partial<Omit<OrganizationNew, "icon"> & {
    icon: File;
}>): Promise<{ok: boolean}> => {
    const res: AxiosResponse<{ ok: boolean }> = await HTTP.patch("/organizations/edit", orgData, );
    return res.data;
}

const deleteOrganization = async (id: string): Promise<{ ok: boolean }> => {
    const res: AxiosResponse<{ok: boolean}> = await HTTP.delete("/organizations/delete", {data: {id}});
    return res.data;
}

const createOffer = async (newOffer: Partial<Offer>): Promise<{ok?: boolean, message?: string}> => {
    const res: AxiosResponse<{ok?: boolean, message?: string}> = await HTTP.post("/offers/create", newOffer);
    return res.data;
}

const deleteOffer = async (id: string): Promise<{ok?: boolean, message?: string}> => {
    const res: AxiosResponse<{ok?: boolean, message?: string}> = await HTTP.delete("/offers/delete", {data: {id}});
    return res.data;
}


export default {
    getList,
    getCategories,
    getOrganizationById,
    createOrganization,
    deleteOrganization,
    editOrganization,
    createOffer,
    deleteOffer
}