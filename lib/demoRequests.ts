import { apiRequest } from "./api";

export type DemoRequestPayload = {
    company: string;
    name: string;
    email: string;
    country: string;
    phone: string;
    size: string;
    message: string;
    materials: string[];
};

export function createDemoRequest(payload: DemoRequestPayload) {
    return apiRequest("/demo-requests", {
        method: "POST",
        body: payload,
        auth: false,
    });
}