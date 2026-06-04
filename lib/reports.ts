import { apiRequest } from "./api";

export type ReportType = "READINESS" | "CONTROL" | "EVIDENCE" | "RISK";
export type ReportFormat = "PDF" | "LATEX";

export type ReportStatus = "PENDING" | "GENERATING" | "READY" | "FAILED";

export type Report = {
    id: string;
    title: string;
    type: ReportType;
    format: ReportFormat;
    status: ReportStatus;
    createdAt: string;
    downloadUrl?: string;
};

export type CreateReportPayload = {
    type: ReportType;
    format: ReportFormat;
};

export function getReports() {
    return apiRequest<Report[]>("/reports", {
        method: "GET",
    });
}

export function getReport(id: string) {
    return apiRequest<Report>(`/reports/${id}`, {
        method: "GET",
    });
}

export function createReport(type: ReportType, format: ReportFormat = "PDF") {
    const payload: CreateReportPayload = {
        type,
        format,
    };

    return apiRequest<Report>("/reports", {
        method: "POST",
        body: payload,
    });
}

export function downloadReport(id: string) {
    return apiRequest<{ downloadUrl: string }>(`/reports/${id}/download`, {
        method: "GET",
    });
}