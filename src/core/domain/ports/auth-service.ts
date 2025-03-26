import { RegisterResponseDto } from "src/infraestructure/http/dto/response/register";
import { IResponseDataHttp } from "src/infraestructure/http/model/response";
import { User } from "../entities/user";


export interface AuthLoginUserInformation {
    email: string; 
    password: string
}

export interface AuthRegisterUserInformation extends AuthLoginUserInformation {
    fullName: string;
}

export interface AuthLoginResponse {
    token: string;
    user: User
}

export interface AuthServicePort {
    login(user: AuthLoginUserInformation): Promise<AuthLoginResponse>;
    register(user: AuthRegisterUserInformation): Promise<User>;
}