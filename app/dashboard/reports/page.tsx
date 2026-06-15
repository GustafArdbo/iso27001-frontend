"use client";

import { FormEvent, useEffect, useState } from "react";
import AppTopbar from "@/components/AppTopbar";
import {
    AppEmptyState,
    AppErrorState,
    AppLoadingState,
} from "@/components/AppDataState";
import {
    createReport,
    downloadReport,
    getReports,
    type Report,
    type ReportFormat,
    type ReportType,
} from "@/lib/reports";

type PageStatus = "loading" | "ready" | "error";

const reportTypes: ReportType[] = ["READINESS", "CONTROL", "EVIDENCE", "RISK"];
const reportFormats: ReportFormat[] = ["PDF", "LATEX"];

function getErrorMessage(error: unknown) {
    return error instanceof Error ? error.message : "Could not load reports.";
}

function statusPill(status: Report["status"]) {
    if (status === "READY") return "good";
    if (status === "FAILED") return "error";
    return "warning";
}

function formatDate(value: string) {
    return new Intl.DateTimeFormat("en", {
        month: "short",
        day: "numeric",
        year: "numeric",
    }).format(new Date(value));
}

export default function ReportsPage() {
    const [status, setStatus] = useState<PageStatus>("loading");
    const [message, setMessage] = useState("");
    const [reports, setReports] = useState<Report[]>([]);
    const [generating, setGenerating] = useState(false);

    async function loadReports() {
        try {
            setStatus("loading");
            setMessage("");
            setReports(await getReports());
            setStatus("ready");
        } catch (error) {
            console.error(error);
            setMessage(getErrorMessage(error));
            setStatus("error");
        }
    }

    useEffect(() => {
        loadReports();
    }, []);

    async function handleGenerate(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const type = String(formData.get("type") ?? "READINESS") as ReportType;
        const format = String(formData.get("format") ?? "PDF") as ReportFormat;

        try {
            setGenerating(true);
            setMessage("");
            const report = await createReport(type, format);
            setReports((currentReports) => [report, ...currentReports]);
            setStatus("ready");
        } catch (error) {
            console.error(error);
            setMessage(getErrorMessage(error));
            setStatus("error");
        } finally {
            setGenerating(false);
        }
    }

    async function handleDownload(report: Report) {
        try {
            setMessage("");
            const { downloadUrl } = report.downloadUrl
                ? { downloadUrl: report.downloadUrl }
                : await downloadReport(report.id);

            window.open(downloadUrl, "_blank", "noopener,noreferrer");
        } catch (error) {
            console.error(error);
            setMessage(getErrorMessage(error));
            setStatus("error");
        }
    }

    return (
        <main className="app-main reports-page">
            <AppTopbar
                title="Reports"
                description="Create readiness summaries, control reports, and evidence exports."
            />

            {status === "loading" && <AppLoadingState title="Loading reports" />}

            {status === "error" && (
                <AppErrorState title="Could not load reports" message={message} />
            )}

            {status === "ready" && (
                <>
                    <section className="app-card">
                        <div className="app-card-header">
                            <h2>Generate report</h2>
                        </div>
                        <form className="settings-form" onSubmit={handleGenerate}>
                            <label>
                                Report type
                                <select name="type" defaultValue="READINESS">
                                    {reportTypes.map((type) => (
                                        <option key={type} value={type}>
                                            {type}
                                        </option>
                                    ))}
                                </select>
                            </label>
                            <label>
                                Format
                                <select name="format" defaultValue="PDF">
                                    {reportFormats.map((format) => (
                                        <option key={format} value={format}>
                                            {format}
                                        </option>
                                    ))}
                                </select>
                            </label>
                            <button type="submit" disabled={generating}>
                                {generating ? "Generating..." : "Generate report"}
                            </button>
                        </form>
                    </section>

                    {!reports.length ? (
                        <AppEmptyState
                            title="No reports"
                            message="Generated reports will appear here."
                        />
                    ) : (
                        <section className="app-card app-table-card">
                            <div className="app-card-header">
                                <h2>Reports</h2>
                            </div>
                            <table className="app-table">
                                <thead>
                                    <tr>
                                        <th>Title</th>
                                        <th>Type</th>
                                        <th>Format</th>
                                        <th>Status</th>
                                        <th>Created</th>
                                        <th>Download</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reports.map((report) => (
                                        <tr key={report.id}>
                                            <td>{report.title}</td>
                                            <td>{report.type}</td>
                                            <td>{report.format}</td>
                                            <td>
                                                <span className={`app-pill ${statusPill(report.status)}`}>
                                                    {report.status}
                                                </span>
                                            </td>
                                            <td>{formatDate(report.createdAt)}</td>
                                            <td>
                                                {report.status === "READY" ? (
                                                    <button
                                                        type="button"
                                                        className="report-link-button"
                                                        onClick={() => handleDownload(report)}
                                                    >
                                                        Download
                                                    </button>
                                                ) : (
                                                    <span className="app-muted-text">Unavailable</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </section>
                    )}
                </>
            )}
        </main>
    );
}
