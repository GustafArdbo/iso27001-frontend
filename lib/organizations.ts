import { apiRequest } from "./api";

export type Organization = {
    id: string;
    name: string;
    createdAt: string;
};

export function getOrganization(id: string) {
    return apiRequest<Organization>(`/organizations/${id}`, {
        method: "GET",
    });
}