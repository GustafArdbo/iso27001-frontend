import { apiRequest } from "./api";

export type LoginPayload = {
    email: string;
    password: string;
};

export type LoginResponse = {
    accessToken: string;
    user: {
        id: string;
        email: string;
        name?: string;
    };
};

export function login(payload: LoginPayload) {
    return apiRequest<LoginResponse>("/auth/login", {
        method: "POST",
        body: payload,
    });
}

export function logout(token: string) {
    return apiRequest("/auth/logout", {
        method: "POST",
        token,
    });
}