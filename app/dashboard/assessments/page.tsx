"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import AppTopbar from "@/components/AppTopbar";
import {
    AppEmptyState,
    AppErrorState,
    AppLoadingState,
} from "@/components/AppDataState";
import {
    createAssessmentForCurrentOrganization,
    getAssessmentSummary,
    getCurrentOrganizationAssessments,
    type AssessmentResponse,
    type AssessmentSummaryResponse,
} from "@/lib/assessments";

type PageStatus = "loading" | "ready" | "error";

type AssessmentRow = AssessmentResponse & {
    summary: AssessmentSummaryResponse | null;
};

function getErrorMessage(error: unknown) {
    return error instanceof Error ? error.message : "Could not load assessments.";
}

function statusPill(status: AssessmentResponse["status"]) {
    if (status === "COMPLETED") return "good";
    if (status === "IN_PROGRESS") return "warning";
    return "neutral";
}

function formatDate(value: string) {
    return new Intl.DateTimeFormat("en", {
        month: "short",
        day: "numeric",
        year: "numeric",
    }).format(new Date(value));
}

export default function AssessmentsPage() {
    const [status, setStatus] = useState<PageStatus>("loading");
    const [message, setMessage] = useState("");
    const [assessments, setAssessments] = useState<AssessmentRow[]>([]);
    const [creating, setCreating] = useState(false);

    async function loadAssessments() {
        try {
            setStatus("loading");
            setMessage("");

            const assessmentData = await getCurrentOrganizationAssessments();
            const rows = await Promise.all(
                assessmentData.map(async (assessment) => ({
                    ...assessment,
                    summary: await getAssessmentSummary(assessment.id).catch(() => null),
                }))
            );

            setAssessments(rows);
            setStatus("ready");
        } catch (error) {
            console.error(error);
            setMessage(getErrorMessage(error));
            setStatus("error");
        }
    }

    useEffect(() => {
        loadAssessments();
    }, []);

    async function handleCreate(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const form = event.currentTarget;
        const formData = new FormData(form);
        const name = String(formData.get("name") ?? "").trim();

        if (!name) return;

        try {
            setCreating(true);
            setMessage("");
            await createAssessmentForCurrentOrganization(name);
            form.reset();
            await loadAssessments();
        } catch (error) {
            console.error(error);
            setMessage(getErrorMessage(error));
            setStatus("error");
        } finally {
            setCreating(false);
        }
    }

    const latest = assessments[0] ?? null;
    const score = latest?.summary?.scorePercentage ?? 0;
    const progress = latest?.summary?.completionPercentage ?? 0;
    const answered = latest?.summary?.answeredControls ?? 0;
    const total = latest?.summary?.totalControls ?? 0;

    const averageScore = useMemo(() => {
        const scored = assessments
            .map((assessment) => assessment.summary?.scorePercentage)
            .filter((value): value is number => typeof value === "number");

        if (!scored.length) return 0;

        return Math.round(
            scored.reduce((sum, value) => sum + value, 0) / scored.length
        );
    }, [assessments]);

    return (
        <main className="app-main assessments-page">
            <AppTopbar
                title="Assessments"
                description="Run readiness reviews, answer questions, and track gaps."
            />

            {status === "loading" && <AppLoadingState title="Loading assessments" />}

            {status === "error" && (
                <AppErrorState title="Could not load assessments" message={message} />
            )}

            {status === "ready" && (
                <>
                    <section className="app-page-grid two">
                        <article className="app-card assessment-highlight">
                            <h2>{latest ? latest.name : "Assessment progress"}</h2>
                            <p>
                                {latest
                                    ? `${answered} of ${total} controls answered.`
                                    : "Create an assessment to start tracking readiness."}
                            </p>
                            <div className="assessment-progress">
                                <span style={{ width: `${progress}%` }}></span>
                            </div>
                        </article>

                        <article className="app-card">
                            <h2>Gap score</h2>
                            <strong className="assessment-score">
                                {latest ? `${Math.round(score)}%` : `${averageScore}%`}
                            </strong>
                            <p>
                                {latest
                                    ? "Current readiness score for the latest assessment."
                                    : "Average readiness score across available assessments."}
                            </p>
                        </article>
                    </section>

                    <section className="app-card app-table-card">
                        <div className="app-card-header">
                            <div>
                                <h2>New assessment</h2>
                                <p className="app-muted-text">
                                    Create an assessment for the current organization.
                                </p>
                            </div>
                        </div>
                        <form className="settings-form" onSubmit={handleCreate}>
                            <label>
                                Assessment name
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Enter assessment name"
                                    required
                                />
                            </label>
                            <button type="submit" disabled={creating}>
                                {creating ? "Creating..." : "Create assessment"}
                            </button>
                        </form>
                    </section>

                    {!assessments.length ? (
                        <AppEmptyState
                            title="No assessments"
                            message="No assessments were returned by the API."
                        />
                    ) : (
                        <section className="app-card app-table-card">
                            <div className="app-card-header">
                                <h2>Assessments</h2>
                            </div>

                            <table className="app-table">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Status</th>
                                        <th>Progress</th>
                                        <th>Score</th>
                                        <th>Created</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {assessments.map((assessment) => (
                                        <tr key={assessment.id}>
                                            <td>{assessment.name}</td>
                                            <td>
                                                <span className={`app-pill ${statusPill(assessment.status)}`}>
                                                    {assessment.status.replace("_", " ")}
                                                </span>
                                            </td>
                                            <td>
                                                {assessment.summary
                                                    ? `${Math.round(
                                                          assessment.summary.completionPercentage
                                                      )}%`
                                                    : "Unavailable"}
                                            </td>
                                            <td>
                                                {assessment.summary
                                                    ? `${Math.round(
                                                          assessment.summary.scorePercentage
                                                      )}%`
                                                    : "Unavailable"}
                                            </td>
                                            <td>{formatDate(assessment.createdAt)}</td>
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
