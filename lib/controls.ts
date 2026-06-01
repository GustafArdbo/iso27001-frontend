import { apiRequest } from "./api";

export type Control = {
    id: string;
    code: string;
    title: string;
    domain: string;
    owner: string;
    status: "Implemented" | "In progress" | "Not started";
    progress: number;
};

export function getControls(token?: string) {
    return apiRequest<Control[]>("/controls", {
        method: "GET",
        token,
    });
}

export function getControl(id: string, token?: string) {
    return apiRequest<Control>(`/controls/${id}`, {
        method: "GET",
        token,
    });
}