import { IResponseDataHttp } from "./response";

export interface IResponseDataHttpList<T> extends IResponseDataHttp<T[]> {
    currentPage: number;
    totalItems?: number;
    totalPages: number;
}