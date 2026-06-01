import { apiRequest } from "./api";

export type Report = {
    id: string;
    title: string;
    type: "Readiness" | "Risk" | "Evidence" | "Executive";
    createdAt: string;
    downloadUrl?: string;
};

export function getReports(token?: string) {
    return apiRequest<Report[]>("/reports", {
        method: "GET",
        token,
    });
}

export function createReport(type: Report["type"], token?: string) {
    return apiRequest<Report>("/reports", {
        method: "POST",
        body: { type },
        token,
    });
}