"use client";

import { useEffect, useMemo, useState } from "react";
import AppTopbar from "@/components/AppTopbar";
import {
    AppEmptyState,
    AppErrorState,
    AppLoadingState,
} from "@/components/AppDataState";
import { getControls, type ControlResponse } from "@/lib/controls";
import {
    getAssessmentQuestions,
    getLatestAssessment,
    type AssessmentQuestionResponse,
} from "@/lib/assessments";

type PageStatus = "loading" | "ready" | "error";

type ControlRow = ControlResponse & {
    answer: AssessmentQuestionResponse["answer"] | null;
    status: "Implemented" | "In progress" | "Not started";
    progress: number;
};

const domainLabels: Record<string, string> = {
    ORGANIZATIONAL: "Organizational",
    PEOPLE: "People",
    PHYSICAL: "Physical",
    TECHNOLOGICAL: "Technological",
};

function getErrorMessage(error: unknown) {
    return error instanceof Error ? error.message : "Could not load controls.";
}

function toControlStatus(answer: AssessmentQuestionResponse["answer"] | null) {
    if (answer === "YES" || answer === "NOT_APPLICABLE") {
        return "Implemented" as const;
    }

    if (answer === "PARTIAL") {
        return "In progress" as const;
    }

    return "Not started" as const;
}

function statusPill(status: ControlRow["status"]) {
    if (status === "Implemented") return "good";
    if (status === "In progress") return "warning";
    return "neutral";
}

export default function ControlsPage() {
    const [status, setStatus] = useState<PageStatus>("loading");
    const [message, setMessage] = useState("");
    const [controls, setControls] = useState<ControlResponse[]>([]);
    const [questions, setQuestions] = useState<AssessmentQuestionResponse[]>([]);

    useEffect(() => {
        let active = true;

        async function loadControls() {
            try {
                setStatus("loading");
                setMessage("");

                const [controlData, latestAssessment] = await Promise.all([
                    getControls(),
                    getLatestAssessment(),
                ]);
                const questionData = latestAssessment
                    ? await getAssessmentQuestions(latestAssessment.id)
                    : [];

                if (!active) return;

                setControls(controlData);
                setQuestions(questionData);
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

    const rows = useMemo<ControlRow[]>(() => {
        const questionByControlId = new Map(
            questions.map((question) => [question.controlId, question])
        );

        return controls.map((control) => {
            const question = questionByControlId.get(control.id);
            const controlStatus = toControlStatus(question?.answer ?? null);

            return {
                ...control,
                answer: question?.answer ?? null,
                status: controlStatus,
                progress:
                    controlStatus === "Implemented"
                        ? 100
                        : controlStatus === "In progress"
                          ? 50
                          : 0,
            };
        });
    }, [controls, questions]);

    const counts = useMemo(
        () =>
            rows.reduce(
                (accumulator, row) => {
                    accumulator[row.status] += 1;
                    return accumulator;
                },
                {
                    Implemented: 0,
                    "In progress": 0,
                    "Not started": 0,
                }
            ),
        [rows]
    );

    return (
        <main className="app-main controls-page">
            <AppTopbar
                title="Controls"
                description="Manage ISO 27001 controls, ownership, status, and implementation progress."
            />

            {status === "loading" && <AppLoadingState title="Loading controls" />}

            {status === "error" && (
                <AppErrorState title="Could not load controls" message={message} />
            )}

            {status === "ready" && !rows.length && (
                <AppEmptyState title="No controls" message="No controls were returned by the API." />
            )}

            {status === "ready" && rows.length > 0 && (
                <>
                    <section className="app-page-grid">
                        <article className="app-card">
                            <h2>Implemented</h2>
                            <strong className="control-number">{counts.Implemented}</strong>
                            <p>Controls answered as ready or not applicable.</p>
                        </article>
                        <article className="app-card">
                            <h2>In progress</h2>
                            <strong className="control-number">
                                {counts["In progress"]}
                            </strong>
                            <p>Controls with partial implementation answers.</p>
                        </article>
                        <article className="app-card">
                            <h2>Not started</h2>
                            <strong className="control-number">
                                {counts["Not started"]}
                            </strong>
                            <p>Controls without a readiness answer yet.</p>
                        </article>
                    </section>

                    <section className="app-card app-table-card">
                        <div className="app-card-header">
                            <h2>Control library</h2>
                        </div>
                        <table className="app-table">
                            <thead>
                                <tr>
                                    <th>Control</th>
                                    <th>Domain</th>
                                    <th>Status</th>
                                    <th>Progress</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((control) => (
                                    <tr key={control.id}>
                                        <td>{control.title}</td>
                                        <td>{domainLabels[control.domain] ?? control.domain}</td>
                                        <td>
                                            <span className={`app-pill ${statusPill(control.status)}`}>
                                                {control.status}
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
