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
    getPriorityPillClass,
    loadStoredEvaluation,
    saveStoredEvaluation,
    taskStatusToAnswer,
    type EvaluationDashboardData,
    type EvaluationTaskRow,
    type TaskStatus,
} from "@/lib/iso27001EvaluationDashboard";

type PageStatus = "loading" | "ready" | "error";

function getErrorMessage(error: unknown) {
    return error instanceof Error ? error.message : "Could not load tasks.";
}

function formatDueDate(value: string) {
    return new Intl.DateTimeFormat("en", {
        month: "short",
        day: "numeric",
        year: "numeric",
    }).format(new Date(value));
}

export default function TasksPage() {
    const [status, setStatus] = useState<PageStatus>("loading");
    const [message, setMessage] = useState("");
    const [assessment, setAssessment] = useState<AssessmentResponse | null>(null);
    const [evaluation, setEvaluation] = useState<StoredEvaluation | null>(null);

    useEffect(() => {
        let active = true;

        async function loadTasks() {
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

        loadTasks();

        return () => {
            active = false;
        };
    }, []);

    const dashboard = useMemo<EvaluationDashboardData | null>(
        () => (evaluation ? buildEvaluationDashboard(evaluation) : null),
        [evaluation]
    );
    const tasks = dashboard?.tasks ?? [];

    function handleStatusChange(task: EvaluationTaskRow, nextStatus: TaskStatus) {
        if (!assessment || !evaluation) return;

        const nextEvaluation = {
            ...evaluation,
            answers: {
                ...evaluation.answers,
                [task.questionId]: taskStatusToAnswer(nextStatus),
            },
        };

        setEvaluation(nextEvaluation);
        saveStoredEvaluation(assessment.id, nextEvaluation);
    }

    return (
        <main className="app-main tasks-page">
            <AppTopbar
                title="Tasks"
                description="Manage remediation work generated from assessment answers."
            />

            {status === "loading" && <AppLoadingState title="Loading tasks" />}

            {status === "error" && (
                <AppErrorState title="Could not load tasks" message={message} />
            )}

            {status === "ready" && (!assessment || !dashboard) && (
                <AppEmptyState
                    title="No assessment"
                    message="Create an assessment before reviewing remediation tasks."
                />
            )}

            {status === "ready" && dashboard && !tasks.length && (
                <AppEmptyState
                    title="No tasks"
                    message="Tasks appear when assessment answers identify gaps or partial implementation."
                />
            )}

            {status === "ready" && tasks.length > 0 && (
                <section className="app-card">
                    <div className="app-card-header">
                        <h2>Task list</h2>
                    </div>
                    <div className="task-list-full">
                        {tasks.map((task) => (
                            <article key={task.id}>
                                <span
                                    className={
                                        task.status === "Done" ? "task-check" : "task-empty"
                                    }
                                >
                                    {task.status === "Done" ? "OK" : ""}
                                </span>
                                <div>
                                    <strong>{task.title}</strong>
                                    <p>Due {formatDueDate(task.dueDate)}</p>
                                </div>
                                <em
                                    className={`app-pill ${getPriorityPillClass(
                                        task.priority
                                    )}`}
                                >
                                    {task.priority}
                                </em>
                                <select
                                    aria-label={`Status for ${task.title}`}
                                    value={task.status}
                                    onChange={(event) =>
                                        handleStatusChange(
                                            task,
                                            event.target.value as TaskStatus
                                        )
                                    }
                                >
                                    <option>Open</option>
                                    <option>In progress</option>
                                    <option>Done</option>
                                </select>
                            </article>
                        ))}
                    </div>
                </section>
            )}
        </main>
    );
}
