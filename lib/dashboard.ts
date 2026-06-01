import { apiRequest } from "./api";

export type DashboardSummary = {
    overallCompliance: number;
    controls: {
        implemented: number;
        inProgress: number;
        notStarted: number;
        total: number;
    };
    risks: {
        high: number;
        medium: number;
        low: number;
    };
    evidence: {
        uploaded: number;
        missing: number;
        expiring: number;
    };
};

export function getDashboardSummary(token?: string) {
    return apiRequest<DashboardSummary>("/dashboard/summary", {
        method: "GET",
        token,
    });
}