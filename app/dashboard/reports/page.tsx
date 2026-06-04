"use client";

import { useState } from "react";
import AppTopbar from "@/components/AppTopbar";
import { createReport, type ReportType } from "@/lib/reports";

type ReportCard = {
    title: string;
    description: string;
    type: ReportType;
};

type Status = "idle" | "loading" | "success" | "error";

const reportCards: ReportCard[] = [
    {
        title: "Readiness report",
        description: "Export a high-level readiness summary for leadership.",
        type: "READINESS",
    },
    {
        title: "Control report",
        description: "Review implementation status across all ISO 27001 controls.",
        type: "CONTROL",
    },
    {
        title: "Evidence export",
        description: "Prepare evidence packages for audit or internal review.",
        type: "EVIDENCE",
    },
];

export default function ReportsPage() {
    const [status, setStatus] = useState<Status>("idle");
    const [activeType, setActiveType] = useState<ReportType | null>(null);
    const [message, setMessage] = useState("");
    const [downloadUrl, setDownloadUrl] = useState("");

    async function handleGenerate(type: ReportType) {
        try {
            setStatus("loading");
            setActiveType(type);
            setMessage("");
            setDownloadUrl("");

            const report = await createReport(type, "PDF");

            setStatus("success");
            setMessage("Report generated successfully.");
            setDownloadUrl(report.downloadUrl ?? "");
        } catch (error) {
            console.error(error);
            setStatus("error");
            setMessage(
                error instanceof Error ? error.message : "Could not generate report."
            );
        }
    }

    return (
        <main className="app-main reports-page">
            <AppTopbar
                title="Reports"
                description="Create readiness summaries, control reports, and evidence exports."
            />

            <section className="app-page-grid">
                {reportCards.map((card) => {
                    const isLoading = status === "loading" && activeType === card.type;

                    return (
                        <article className="app-card report-card" key={card.type}>
                            <h2>{card.title}</h2>
                            <p>{card.description}</p>

                            <button
                                type="button"
                                className="app-action report-action-button"
                                onClick={() => handleGenerate(card.type)}
                                disabled={isLoading}
                            >
                                {isLoading ? "Generating..." : "Generate →"}
                            </button>
                        </article>
                    );
                })}
            </section>

            {message && (
                <section className="app-card app-table-card report-status-card">
                    <p className={status === "error" ? "report-error" : "report-success"}>
                        {message}
                    </p>

                    {downloadUrl && (
                        <a
                            href={downloadUrl}
                            className="landing-button primary app-small-button"
                            target="_blank"
                            rel="noreferrer"
                        >
                            Download report
                        </a>
                    )}
                </section>
            )}
        </main>
    );
}
