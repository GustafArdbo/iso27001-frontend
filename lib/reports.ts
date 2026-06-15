import { createClient } from "@/lib/supabase/client";
import { apiRequest } from "./api";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "");

if (!API_BASE_URL) {
    throw new Error("Missing NEXT_PUBLIC_API_BASE_URL");
}

export type ReportType = "READINESS" | "CONTROL" | "EVIDENCE_EXPORT";
export type ReportDownloadFormat = "PDF" | "LATEX";
export type ReportStatus = "GENERATING" | "READY" | "FAILED";

export type Report = {
    id: string;
    organizationId: string;
    assessmentId: string;
    type: ReportType;
    status: ReportStatus;
    title: string;
    templateVersion?: string;
    scorePercentage?: number;
    gapPercentage?: number;
    completionPercentage?: number;
    totalControls?: number;
    answeredControls?: number;
    generatedAt?: string;
    failureReason?: string;
    createdAt: string;
    downloadUrl?: string;
    latexUrl?: string;
};

export type CreateReportPayload = {
    type: ReportType;
    assessmentId: string;
};

function getReportDownloadPath(
    reportId: string,
    format: ReportDownloadFormat
) {
    if (format === "LATEX") {
        return `/reports/${reportId}/latex`;
    }

    return `/reports/${reportId}/download`;
}

async function getAccessToken() {
    const supabase = createClient();

    const {
        data: { session },
    } = await supabase.auth.getSession();

    return session?.access_token;
}

function triggerBrowserDownload(blob: Blob, filename: string) {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = filename;

    document.body.appendChild(link);
    link.click();

    link.remove();
    window.URL.revokeObjectURL(url);
}

export function getReports(organizationId: string) {
    return apiRequest<Report[]>(`/organizations/${organizationId}/reports`, {
        method: "GET",
    });
}

export function getReport(reportId: string) {
    return apiRequest<Report>(`/reports/${reportId}`, {
        method: "GET",
    });
}

export function createReport(
    organizationId: string,
    payload: CreateReportPayload
) {
    return apiRequest<Report>(`/organizations/${organizationId}/reports`, {
        method: "POST",
        body: payload,
    });
}

export async function downloadReportFile(
    reportId: string,
    format: ReportDownloadFormat,
    filename: string
) {
    const accessToken = await getAccessToken();

    const response = await fetch(
        `${API_BASE_URL}${getReportDownloadPath(reportId, format)}`,
        {
            method: "GET",
            headers: {
                ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
            },
        }
    );

    if (!response.ok) {
        const errorText = await response.text();

        throw new Error(
            `Report download failed: ${response.status} ${response.statusText} - ${errorText}`
        );
    }

    const blob = await response.blob();
    triggerBrowserDownload(blob, filename);
}