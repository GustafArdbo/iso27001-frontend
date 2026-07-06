"use client";

import Link from "next/link";
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
    loadStoredEvaluation,
    type EvaluationDashboardData,
    type TaskPriority,
} from "@/lib/iso27001EvaluationDashboard";

type PageStatus = "loading" | "ready" | "error";

function getErrorMessage(error: unknown) {
    return error instanceof Error ? error.message : "Could not load dashboard data.";
}

function priorityClass(priority: TaskPriority) {
    if (priority === "High") return "high-tag";
    if (priority === "Medium") return "medium-tag";
    return "low-tag";
}

function formatDueDate(value: string) {
    return new Intl.DateTimeFormat("en", {
        month: "short",
        day: "numeric",
        year: "numeric",
    }).format(new Date(value));
}

export default function DashboardPage() {
    const [status, setStatus] = useState<PageStatus>("loading");
    const [message, setMessage] = useState("");
    const [assessments, setAssessments] = useState<AssessmentResponse[]>([]);
    const [dashboard, setDashboard] = useState<EvaluationDashboardData | null>(null);

    useEffect(() => {
        let active = true;

        async function loadDashboard() {
            try {
                setStatus("loading");
                setMessage("");

                const assessmentData = await getCurrentOrganizationAssessments();
                const latestAssessmentId = assessmentData[0]?.id ?? "";
                const evaluation = loadStoredEvaluation(latestAssessmentId);

                if (!active) return;

                setAssessments(assessmentData);
                setDashboard(
                    latestAssessmentId ? buildEvaluationDashboard(evaluation) : null
                );
                setStatus("ready");
            } catch (error) {
                if (!active) return;

                console.error(error);
                setMessage(getErrorMessage(error));
                setStatus("error");
            }
        }

        loadDashboard();

        return () => {
            active = false;
        };
    }, []);

    const recentTasks = useMemo(
        () => dashboard?.tasks.slice(0, 3) ?? [],
        [dashboard]
    );
    const topSections = useMemo(
        () =>
            dashboard?.sectionProgress
                .filter((section) => section.total > 0)
                .sort((left, right) => right.progress - left.progress)
                .slice(0, 6) ?? [],
        [dashboard]
    );

    if (status === "loading") {
        return (
            <main className="app-main">
                <AppTopbar
                    title="Dashboard"
                    description="Welcome back! Here is your compliance overview."
                />
                <AppLoadingState title="Loading dashboard" />
            </main>
        );
    }

    if (status === "error") {
        return (
            <main className="app-main">
                <AppTopbar
                    title="Dashboard"
                    description="Welcome back! Here is your compliance overview."
                />
                <AppErrorState title="Could not load dashboard" message={message} />
            </main>
        );
    }

    if (!assessments.length || !dashboard) {
        return (
            <main className="app-main">
                <AppTopbar
                    title="Dashboard"
                    description="Welcome back! Here is your compliance overview."
                />
                <AppEmptyState
                    title="No assessment data"
                    message="Create an assessment and answer the ISO 27001 form to populate the dashboard."
                />
            </main>
        );
    }

    const score = Math.max(0, Math.min(dashboard.score.percentage, 100));
    const scoreLabel = dashboard.score.readinessLevel;

    return (
        <main className="app-main">
            <AppTopbar
                title="Dashboard"
                description="Welcome back! Here is your compliance overview."
            />

            <section className="app-kpi-grid">
                <article className="app-card compliance-card">
                    <div className="app-card-header">
                        <h2>Overall compliance</h2>
                        <span className="status-pill good">{scoreLabel}</span>
                    </div>

                    <div
                        className="big-ring"
                        style={{
                            background: `conic-gradient(var(--color-accent) 0 ${score}%, #e7e7e7 ${score}% 100%)`,
                        }}
                    >
                        <div className="big-ring-inner">
                            <strong>{score}%</strong>
                            <span>{scoreLabel}</span>
                        </div>
                    </div>
                </article>

                <article className="app-card">
                    <div className="app-card-header">
                        <h2>Controls status</h2>
                    </div>

                    <div className="app-status-list">
                        <div className="app-status-row">
                            <span className="status-dot done">OK</span>
                            <span>Implemented</span>
                            <strong>{dashboard.controls.implemented}</strong>
                        </div>
                        <div className="app-status-row">
                            <span className="status-dot progress"></span>
                            <span>In progress</span>
                            <strong>{dashboard.controls.inProgress}</strong>
                        </div>
                        <div className="app-status-row">
                            <span className="status-dot empty"></span>
                            <span>Not started</span>
                            <strong>{dashboard.controls.notStarted}</strong>
                        </div>
                    </div>

                    <div className="app-total-row">
                        <span>Total controls</span>
                        <strong>{dashboard.controls.total}</strong>
                    </div>
                </article>

                <article className="app-card">
                    <div className="app-card-header">
                        <h2>Open risks</h2>
                    </div>
                    <div className="risk-list">
                        <div className="risk-row">
                            <strong>{dashboard.riskCounts.High}</strong>
                            <span className="high">High</span>
                        </div>
                        <div className="risk-row">
                            <strong>{dashboard.riskCounts.Medium}</strong>
                            <span className="medium">Medium</span>
                        </div>
                        <div className="risk-row">
                            <strong>{dashboard.riskCounts.Low}</strong>
                            <span className="low">Low</span>
                        </div>
                    </div>
                    <Link href="/dashboard/risks" className="dash-link">
                        View risk register -&gt;
                    </Link>
                </article>
            </section>

            <section className="app-content-grid">
                <article className="app-card app-wide-card">
                    <div className="app-card-header">
                        <h2>Top control domains</h2>
                        <Link href="/dashboard/controls" className="dash-link">
                            View all controls -&gt;
                        </Link>
                    </div>

                    <div className="control-domain-list">
                        {topSections.map((section) => (
                            <div className="app-bar-row" key={section.id}>
                                <span>{section.title}</span>
                                <div>
                                    <i style={{ width: `${section.progress}%` }}></i>
                                </div>
                                <strong>{section.progress}%</strong>
                            </div>
                        ))}
                    </div>
                </article>

                <article className="app-card">
                    <div className="app-card-header">
                        <h2>Recent tasks</h2>
                        <Link href="/dashboard/tasks" className="dash-link">
                            View all -&gt;
                        </Link>
                    </div>

                    {recentTasks.length ? (
                        <div className="app-task-list">
                            {recentTasks.map((task) => (
                                <div className="task-row" key={task.id}>
                                    <span className="task-empty"></span>
                                    <div>
                                        <strong>{task.title}</strong>
                                        <p>Due {formatDueDate(task.dueDate)}</p>
                                    </div>
                                    <em className={`tag ${priorityClass(task.priority)}`}>
                                        {task.priority}
                                    </em>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="app-muted-text">
                            No remediation tasks. Add assessment answers to generate work.
                        </p>
                    )}
                </article>
            </section>

            <section className="app-content-grid secondary-grid">
                <article className="app-card">
                    <div className="app-card-header">
                        <h2>Assessment progress</h2>
                    </div>
                    <div className="assessment-list">
                        <div>
                            <strong>{assessments[0]?.name}</strong>
                            <p>
                                {dashboard.score.answeredCount} of{" "}
                                {dashboard.score.totalQuestions} questions answered
                            </p>
                        </div>
                        <div className="mini-progress">
                            <span
                                style={{
                                    width: `${dashboard.score.totalQuestions ? Math.round((dashboard.score.answeredCount / dashboard.score.totalQuestions) * 100) : 0}%`,
                                }}
                            ></span>
                        </div>
                    </div>
                    <Link
                        href="/dashboard/assessments"
                        className="landing-button primary app-small-button"
                    >
                        Continue assessment
                    </Link>
                </article>

                <article className="app-card">
                    <div className="app-card-header">
                        <h2>Evidence health</h2>
                    </div>
                    <div className="evidence-stats">
                        <div>
                            <strong>{dashboard.evidenceCounts.Uploaded}</strong>
                            <span>Uploaded</span>
                        </div>
                        <div>
                            <strong>{dashboard.evidenceCounts.Missing}</strong>
                            <span>Missing</span>
                        </div>
                        <div>
                            <strong>{dashboard.evidenceCounts.Expiring}</strong>
                            <span>Expiring</span>
                        </div>
                    </div>
                </article>
            </section>
        </main>
    );
}
