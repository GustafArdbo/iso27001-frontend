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
import { answerLabels, type EvaluationAnswer } from "@/lib/iso27001Evaluation";
import {
    buildEvaluationDashboard,
    getStatusPillClass,
    loadStoredEvaluation,
    saveStoredEvaluation,
    type EvaluationDashboardData,
} from "@/lib/iso27001EvaluationDashboard";
import type { StoredEvaluation } from "@/lib/iso27001Evaluation";

type PageStatus = "loading" | "ready" | "error";

function getErrorMessage(error: unknown) {
    return error instanceof Error ? error.message : "Could not load controls.";
}

export default function ControlsPage() {
    const [status, setStatus] = useState<PageStatus>("loading");
    const [message, setMessage] = useState("");
    const [assessment, setAssessment] = useState<AssessmentResponse | null>(null);
    const [evaluation, setEvaluation] = useState<StoredEvaluation | null>(null);

    useEffect(() => {
        let active = true;

        async function loadControls() {
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

        loadControls();

        return () => {
            active = false;
        };
    }, []);

    const dashboard = useMemo<EvaluationDashboardData | null>(
        () => (evaluation ? buildEvaluationDashboard(evaluation) : null),
        [evaluation]
    );

    function updateAnswer(questionId: string, answer: EvaluationAnswer | "") {
        if (!assessment || !evaluation) return;

        const nextEvaluation = {
            ...evaluation,
            answers: {
                ...evaluation.answers,
                [questionId]: answer,
            },
        };

        setEvaluation(nextEvaluation);
        saveStoredEvaluation(assessment.id, nextEvaluation);
    }

    return (
        <main className="app-main controls-page">
            <AppTopbar
                title="Controls"
                description="Manage ISO 27001 controls from the assessment answers."
            />

            {status === "loading" && <AppLoadingState title="Loading controls" />}

            {status === "error" && (
                <AppErrorState title="Could not load controls" message={message} />
            )}

            {status === "ready" && (!assessment || !dashboard) && (
                <AppEmptyState
                    title="No assessment"
                    message="Create an assessment before reviewing controls."
                />
            )}

            {status === "ready" && dashboard && (
                <>
                    <section className="app-page-grid">
                        <article className="app-card">
                            <h2>Implemented</h2>
                            <strong className="control-number">
                                {dashboard.controls.implemented}
                            </strong>
                            <p>Questions answered as ready or not applicable.</p>
                        </article>
                        <article className="app-card">
                            <h2>In progress</h2>
                            <strong className="control-number">
                                {dashboard.controls.inProgress}
                            </strong>
                            <p>Questions answered as partially implemented.</p>
                        </article>
                        <article className="app-card">
                            <h2>Not started</h2>
                            <strong className="control-number">
                                {dashboard.controls.notStarted}
                            </strong>
                            <p>Questions without a ready implementation answer.</p>
                        </article>
                    </section>

                    <section className="app-card app-table-card">
                        <div className="app-card-header">
                            <h2>Control questions</h2>
                        </div>
                        <table className="app-table">
                            <thead>
                                <tr>
                                    <th>Control</th>
                                    <th>Section</th>
                                    <th>Mapping</th>
                                    <th>Answer</th>
                                    <th>Status</th>
                                    <th>Progress</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dashboard.questions.map((control) => (
                                    <tr key={control.id}>
                                        <td>
                                            <strong>{control.id}</strong>
                                            <p className="app-muted-text">{control.question}</p>
                                        </td>
                                        <td>{control.section}</td>
                                        <td>{control.mapping}</td>
                                        <td>
                                            <select
                                                className="dashboard-inline-select"
                                                value={control.answer}
                                                onChange={(event) =>
                                                    updateAnswer(
                                                        control.id,
                                                        event.target.value as EvaluationAnswer | ""
                                                    )
                                                }
                                            >
                                                <option value="">Unanswered</option>
                                                {(Object.keys(answerLabels) as EvaluationAnswer[]).map(
                                                    (answer) => (
                                                        <option value={answer} key={answer}>
                                                            {answerLabels[answer]}
                                                        </option>
                                                    )
                                                )}
                                            </select>
                                        </td>
                                        <td>
                                            <span
                                                className={`app-pill ${getStatusPillClass(
                                                    control.controlStatus
                                                )}`}
                                            >
                                                {control.controlStatus}
                                            </span>
                                        </td>
                                        <td>{control.progress}%</td>
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
