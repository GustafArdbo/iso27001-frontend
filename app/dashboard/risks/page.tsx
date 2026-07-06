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
import {
    buildEvaluationDashboard,
    getPriorityPillClass,
    loadStoredEvaluation,
    type EvaluationDashboardData,
} from "@/lib/iso27001EvaluationDashboard";

type PageStatus = "loading" | "ready" | "error";

function getErrorMessage(error: unknown) {
    return error instanceof Error ? error.message : "Could not load risks.";
}

export default function RisksPage() {
    const [status, setStatus] = useState<PageStatus>("loading");
    const [message, setMessage] = useState("");
    const [assessment, setAssessment] = useState<AssessmentResponse | null>(null);
    const [dashboard, setDashboard] = useState<EvaluationDashboardData | null>(null);

    useEffect(() => {
        let active = true;

        async function loadRisks() {
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
                setDashboard(
                    storedEvaluation ? buildEvaluationDashboard(storedEvaluation) : null
                );
                setStatus("ready");
            } catch (error) {
                if (!active) return;

                console.error(error);
                setMessage(getErrorMessage(error));
                setStatus("error");
            }
        }

        loadRisks();

        return () => {
            active = false;
        };
    }, []);

    const risks = useMemo(() => dashboard?.risks ?? [], [dashboard]);

    return (
        <main className="app-main risks-page">
            <AppTopbar
                title="Risks"
                description="Track risks created from ISO 27001 assessment gaps."
            />

            {status === "loading" && <AppLoadingState title="Loading risks" />}

            {status === "error" && (
                <AppErrorState title="Could not load risks" message={message} />
            )}

            {status === "ready" && (!assessment || !dashboard) && (
                <AppEmptyState
                    title="No assessment"
                    message="Create an assessment before reviewing risk gaps."
                />
            )}

            {status === "ready" && dashboard && !risks.length && (
                <AppEmptyState
                    title="No open risks"
                    message="Risks appear when assessment answers identify control gaps."
                />
            )}

            {status === "ready" && dashboard && risks.length > 0 && (
                <>
                    <section className="app-page-grid">
                        <article className="app-card risk-card high-risk">
                            <strong>{dashboard.riskCounts.High}</strong>
                            <span>High risks</span>
                        </article>
                        <article className="app-card risk-card medium-risk">
                            <strong>{dashboard.riskCounts.Medium}</strong>
                            <span>Medium risks</span>
                        </article>
                        <article className="app-card risk-card low-risk">
                            <strong>{dashboard.riskCounts.Low}</strong>
                            <span>Low risks</span>
                        </article>
                    </section>
                    <section className="app-card app-table-card">
                        <div className="app-card-header">
                            <h2>Risk register</h2>
                        </div>
                        <table className="app-table">
                            <thead>
                                <tr>
                                    <th>Risk</th>
                                    <th>Owner</th>
                                    <th>Severity</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {risks.map((risk) => (
                                    <tr key={risk.id}>
                                        <td>{risk.title}</td>
                                        <td>{risk.owner}</td>
                                        <td>
                                            <span
                                                className={`app-pill ${getPriorityPillClass(
                                                    risk.severity
                                                )}`}
                                            >
                                                {risk.severity}
                                            </span>
                                        </td>
                                        <td>{risk.status}</td>
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
