import {AxiosResponse} from "axios";

export class CustomError extends Error {
    response: AxiosResponse<any, any> | null = null;
    isAxiosError = false;
};