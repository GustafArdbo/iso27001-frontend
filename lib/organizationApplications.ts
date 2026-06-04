import { apiRequest } from "./api";

export type OrganizationApplicationPayload = {
    company: string;
    name: string;
    email: string;
    country: string;
    phone: string;
    size: string;
    message: string;
    materials: string[];
};

export type OrganizationApplicationResponse = {
    id: string;
    company: string;
    name: string;
    email: string;
    status: "PENDING" | "APPROVED" | "REJECTED";
    createdAt: string;
};

export function createOrganizationApplication(
    payload: OrganizationApplicationPayload
) {
    return apiRequest<OrganizationApplicationResponse>(
        "/organization-applications",
        {
            method: "POST",
            body: payload,
            auth: false,
        }
    );
}