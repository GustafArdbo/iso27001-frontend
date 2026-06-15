import {
    getCurrentOrganizationAssessments,
    getAssessmentSummary,
} from "./assessments";

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

const reportTitles: Record<ReportType, string> = {
    READINESS: "Readiness report",
    CONTROL: "Control report",
    EVIDENCE: "Evidence export",
    RISK: "Risk report",
};

function buildReport(
    assessmentId: string,
    type: ReportType,
    format: ReportFormat,
    createdAt: string
): Report {
    return {
        id: `${assessmentId}:${type}:${format}`,
        title: reportTitles[type],
        type,
        format,
        status: "READY",
        createdAt,
    };
}

export async function getReports() {
    const assessments = await getCurrentOrganizationAssessments();

    return assessments.map((assessment) =>
        buildReport(assessment.id, "READINESS", "PDF", assessment.createdAt)
    );
}

export async function getReport(id: string) {
    const [assessmentId, type = "READINESS", format = "PDF"] = id.split(":");
    const summary = await getAssessmentSummary(assessmentId);

    return buildReport(
        summary.id,
        type as ReportType,
        format as ReportFormat,
        new Date().toISOString()
    );
}

export async function createReport(
    type: ReportType,
    format: ReportFormat = "PDF"
) {
    const assessments = await getCurrentOrganizationAssessments();
    const latestAssessment = assessments[0];

    if (!latestAssessment) {
        throw new Error("No assessment is available for report generation.");
    }

    const summary = await getAssessmentSummary(latestAssessment.id);

    return buildReport(summary.id, type, format, new Date().toISOString());
}

export async function downloadReport(id: string) {
    const report = await getReport(id);

    if (!report.downloadUrl) {
        throw new Error("The backend API does not expose report downloads yet.");
    }

    return { downloadUrl: report.downloadUrl };
}
