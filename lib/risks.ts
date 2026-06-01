import { apiRequest } from "./api";

export type Risk = {
    id: string;
    title: string;
    severity: "High" | "Medium" | "Low";
    owner: string;
    status: "Open" | "In progress" | "Mitigated";
};

export function getRisks(token?: string) {
    return apiRequest<Risk[]>("/risks", {
        method: "GET",
        token,
    });
}

export function getRisk(id: string, token?: string) {
    return apiRequest<Risk>(`/risks/${id}`, {
        method: "GET",
        token,
    });
}