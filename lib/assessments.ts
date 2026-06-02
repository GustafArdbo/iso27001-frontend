import { apiRequest } from "@/lib/api";

export type CreateDemoRequestPayload = {
    company: string;
    name: string;
    email: string;
    country: string;
    phone?: string;
    size: string;
    message?: string;
    materials: string[];
};

export type DemoRequestResponse = {
    id: string;
};

export async function createDemoRequest(
    payload: CreateDemoRequestPayload
): Promise<DemoRequestResponse> {
    return apiRequest<DemoRequestResponse>("/demo-requests", {
        method: "POST",
        body: payload,
        auth: false,
    });
}