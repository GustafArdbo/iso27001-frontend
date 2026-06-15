"use client";

import { useEffect, useState } from "react";
import AppTopbar from "@/components/AppTopbar";
import {
    AppEmptyState,
    AppErrorState,
    AppLoadingState,
} from "@/components/AppDataState";
import { getCurrentAuthUser } from "@/lib/auth";
import { getLatestAssessment } from "@/lib/assessments";
import {
    createReport,
    downloadReportFile,
    getReports,
    type Report,
    type ReportType,
} from "@/lib/reports";

type PageStatus = "loading" | "ready" | "error";
type ActionStatus = "idle" | "loading" | "success" | "error";

type ReportCard = {
    title: string;
    description: string;
    type: ReportType;
    filename: string;
};

const reportCards: ReportCard[] = [
    {
        title: "Evidence",
        description:
            "Prepare an evidence export for audit review and internal documentation.",
        type: "EVIDENCE_EXPORT",
        filename: "evidence-report.pdf",
    },
    {
        title: "Control",
        description:
            "Generate a control report showing implementation status and gaps.",
        type: "CONTROL",
        filename: "control-report.pdf",
    },
    {
        title: "Readiness",
        description:
            "Create a readiness summary for leadership and audit preparation.",
        type: "READINESS",
        filename: "readiness-report.pdf",
    },
];

function getErrorMessage(error: unknown) {
    return error instanceof Error ? error.message : "Could not load reports.";
}

function formatDate(value: string) {
    return new Intl.DateTimeFormat("en", {
        month: "short",
        day: "numeric",
        year: "numeric",
    }).format(new Date(value));
}

function getReportLabel(type: ReportType) {
    if (type === "EVIDENCE_EXPORT") return "Evidence";
    if (type === "CONTROL") return "Control";
    return "Readiness";
}

export default function ReportsPage() {
    const [pageStatus, setPageStatus] = useState<PageStatus>("loading");
    const [actionStatus, setActionStatus] = useState<ActionStatus>("idle");
    const [message, setMessage] = useState("");
    const [reports, setReports] = useState<Report[]>([]);
    const [organizationId, setOrganizationId] = useState("");
    const [assessmentId, setAssessmentId] = useState("");
    const [loadingKey, setLoadingKey] = useState("");

    async function loadReportsPage() {
        try {
            setPageStatus("loading");
            setMessage("");

            const me = await getCurrentAuthUser();
            const firstMembership = me.memberships?.[0];

            if (!firstMembership?.organizationId) {
                throw new Error("No organization membership found.");
            }

            const latestAssessment = await getLatestAssessment();

            if (!latestAssessment?.id) {
                throw new Error(
                    "No assessment is available. Create an assessment before generating reports."
                );
            }

            const currentReports = await getReports(firstMembership.organizationId);

            setOrganizationId(firstMembership.organizationId);
            setAssessmentId(latestAssessment.id);
            setReports(currentReports);
            setPageStatus("ready");
        } catch (error) {
            console.error(error);
            setMessage(getErrorMessage(error));
            setPageStatus("error");
        }
    }

    useEffect(() => {
        void loadReportsPage();
    }, []);

    async function refreshReports() {
        if (!organizationId) return;

        const currentReports = await getReports(organizationId);
        setReports(currentReports);
    }

    async function handleGenerate(card: ReportCard) {
        try {
            setActionStatus("loading");
            setLoadingKey(card.type);
            setMessage("");

            if (!organizationId) {
                throw new Error("No organization selected.");
            }

            if (!assessmentId) {
                throw new Error("No assessment selected.");
            }

            const report = await createReport(organizationId, {
                type: card.type,
                assessmentId,
            });

            await downloadReportFile(report.id, "PDF", card.filename);

            await refreshReports();

            setActionStatus("success");
            setMessage(`${card.title} report generated as PDF.`);
        } catch (error) {
            console.error(error);
            setActionStatus("error");
            setMessage(getErrorMessage(error));
        } finally {
            setLoadingKey("");
        }
    }

    async function handleDownloadExisting(report: Report) {
        try {
            setActionStatus("loading");
            setLoadingKey(report.id);
            setMessage("");

            const label = getReportLabel(report.type).toLowerCase();

            await downloadReportFile(report.id, "PDF", `${label}-report.pdf`);

            setActionStatus("success");
            setMessage(`${getReportLabel(report.type)} report downloaded as PDF.`);
        } catch (error) {
            console.error(error);
            setActionStatus("error");
            setMessage(getErrorMessage(error));
        } finally {
            setLoadingKey("");
        }
    }

    if (pageStatus === "loading") {
        return (
            <main className="app-main reports-page">
                <AppTopbar
                    title="Reports"
                    description="Create readiness summaries, control reports, and evidence exports."
                />
                <AppLoadingState title="Loading reports" />
            </main>
        );
    }

    if (pageStatus === "error") {
        return (
            <main className="app-main reports-page">
                <AppTopbar
                    title="Reports"
                    description="Create readiness summaries, control reports, and evidence exports."
                />
                <AppErrorState title="Could not load reports" message={message} />
            </main>
        );
    }

    return (
        <main className="app-main reports-page">
            <AppTopbar
                title="Reports"
                description="Create readiness summaries, control reports, and evidence exports."
            />

            <section className="report-card-grid">
                {reportCards.map((card) => (
                    <article className="app-card report-option-card" key={card.type}>
                        <div>
                            <h2>{card.title}</h2>
                            <p>{card.description}</p>
                        </div>

                        <button
                            type="button"
                            className="report-generate-button"
                            onClick={() => handleGenerate(card)}
                            disabled={actionStatus === "loading"}
                        >
                            {loadingKey === card.type ? "Generating..." : "Generate report"}
                        </button>
                    </article>
                ))}
            </section>

            {message && (
                <section className="app-card report-status-card">
                    <p className={actionStatus === "error" ? "report-error" : "report-success"}>
                        {message}
                    </p>
                </section>
            )}

            {!reports.length ? (
                <AppEmptyState
                    title="No reports"
                    message="Generated reports will appear here."
                />
            ) : (
                <section className="app-card app-table-card reports-table-card">
                    <div className="app-card-header">
                        <h2>Reports</h2>
                    </div>

                    <div className="app-table-scroll">
                        <table className="app-table reports-table">
                            <thead>
                            <tr>
                                <th>Title</th>
                                <th>Type</th>
                                <th>Status</th>
                                <th>Created</th>
                                <th>Download</th>
                            </tr>
                            </thead>

                            <tbody>
                            {reports.map((report) => (
                                <tr key={report.id}>
                                    <td>{report.title}</td>
                                    <td>{getReportLabel(report.type)}</td>
                                    <td>
                                            <span
                                                className={`report-status-pill ${report.status.toLowerCase()}`}
                                            >
                                                {report.status}
                                            </span>
                                    </td>
                                    <td>{formatDate(report.createdAt)}</td>
                                    <td>
                                        {report.status === "READY" ? (
                                            <button
                                                type="button"
                                                className="report-table-button"
                                                onClick={() => handleDownloadExisting(report)}
                                                disabled={actionStatus === "loading"}
                                            >
                                                {loadingKey === report.id ? "..." : "Download PDF"}
                                            </button>
                                        ) : (
                                            <span className="app-muted-text">Unavailable</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            )}
        </main>
    );
}