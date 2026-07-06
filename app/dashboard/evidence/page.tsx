"use client";

import { useEffect, useMemo, useState } from "react";
import AppTopbar from "@/components/AppTopbar";
import {
    AppEmptyState,
    AppErrorState,
    AppLoadingState,
} from "@/components/AppDataState";
import {
    getCurrentOrganizationAssessments,
    type AssessmentResponse,
} from "@/lib/assessments";
import type { StoredEvaluation } from "@/lib/iso27001Evaluation";
import {
    buildEvaluationDashboard,
    getEvidencePillClass,
    loadStoredEvaluation,
    saveStoredEvaluation,
    type EvaluationDashboardData,
} from "@/lib/iso27001EvaluationDashboard";

type PageStatus = "loading" | "ready" | "error";

function getErrorMessage(error: unknown) {
    return error instanceof Error ? error.message : "Could not load evidence.";
}

function formatDate(value: string) {
    return new Intl.DateTimeFormat("en", {
        month: "short",
        day: "numeric",
        year: "numeric",
    }).format(new Date(value));
}

export default function EvidencePage() {
    const [status, setStatus] = useState<PageStatus>("loading");
    const [message, setMessage] = useState("");
    const [assessment, setAssessment] = useState<AssessmentResponse | null>(null);
    const [evaluation, setEvaluation] = useState<StoredEvaluation | null>(null);

    useEffect(() => {
        let active = true;

        async function loadEvidence() {
            try {
                setStatus("loading");
                setMessage("");

                const assessments = await getCurrentOrganizationAssessments();
                const latestAssessment = assessments[0] ?? null;
                const storedEvaluation = latestAssessment
                    ? loadStoredEvaluation(latestAssessment.id)
                    : null;

                if (!active) return;

                setAssessment(latestAssessment);
                setEvaluation(storedEvaluation);
                setStatus("ready");
            } catch (error) {
                if (!active) return;

                console.error(error);
                setMessage(getErrorMessage(error));
                setStatus("error");
            }
        }

        loadEvidence();

        return () => {
            active = false;
        };
    }, []);

    const dashboard = useMemo<EvaluationDashboardData | null>(
        () => (evaluation ? buildEvaluationDashboard(evaluation) : null),
        [evaluation]
    );

    function updateEvidenceNote(controlCode: string, comment: string) {
        if (!assessment || !evaluation) return;

        const nextEvaluation = {
            ...evaluation,
            comments: {
                ...evaluation.comments,
                [controlCode]: comment,
            },
        };

        setEvaluation(nextEvaluation);
        saveStoredEvaluation(assessment.id, nextEvaluation);
    }

    return (
        <main className="app-main evidence-page">
            <AppTopbar
                title="Evidence"
                description="Collect, review, and organize audit evidence from assessment questions."
            />

            {status === "loading" && <AppLoadingState title="Loading evidence" />}

            {status === "error" && (
                <AppErrorState title="Could not load evidence" message={message} />
            )}

            {status === "ready" && (!assessment || !dashboard) && (
                <AppEmptyState
                    title="No assessment"
                    message="Create an assessment before collecting evidence."
                />
            )}

            {status === "ready" && dashboard && (
                <>
                    <section className="app-page-grid">
                        <article className="app-card evidence-stat">
                            <strong>{dashboard.evidenceCounts.Uploaded}</strong>
                            <span>Uploaded</span>
                        </article>
                        <article className="app-card evidence-stat">
                            <strong>{dashboard.evidenceCounts.Missing}</strong>
                            <span>Missing</span>
                        </article>
                        <article className="app-card evidence-stat">
                            <strong>{dashboard.evidenceCounts.Expiring}</strong>
                            <span>Needs review</span>
                        </article>
                    </section>
                    <section className="app-card app-table-card">
                        <div className="app-card-header">
                            <h2>Evidence library</h2>
                        </div>
                        <table className="app-table">
                            <thead>
                                <tr>
                                    <th>Evidence</th>
                                    <th>Control</th>
                                    <th>Owner</th>
                                    <th>Status</th>
                                    <th>Updated</th>
                                    <th>Notes</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dashboard.evidence.map((item) => (
                                    <tr key={item.id}>
                                        <td>{item.title}</td>
                                        <td>{item.controlCode}</td>
                                        <td>{item.owner}</td>
                                        <td>
                                            <span
                                                className={`app-pill ${getEvidencePillClass(
                                                    item.status
                                                )}`}
                                            >
                                                {item.status}
                                            </span>
                                        </td>
                                        <td>{formatDate(item.updatedAt)}</td>
                                        <td>
                                            <textarea
                                                className="dashboard-inline-textarea"
                                                value={item.comment}
                                                placeholder="Add evidence notes"
                                                onChange={(event) =>
                                                    updateEvidenceNote(
                                                        item.controlCode,
                                                        event.target.value
                                                    )
                                                }
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </section>
                </>
            )}
        </main>
    );
}
