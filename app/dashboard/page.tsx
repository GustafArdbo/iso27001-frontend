"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import AppTopbar from "@/components/AppTopbar";
import {
    AppEmptyState,
    AppErrorState,
    AppLoadingState,
} from "@/components/AppDataState";
import { getDashboardSummary, type DashboardSummary } from "@/lib/dashboard";
import { getTasks, type Task } from "@/lib/tasks";
import {
    getAssessmentQuestions,
    getLatestAssessment,
    getLatestAssessmentSummary,
    type AssessmentQuestionResponse,
    type AssessmentSummaryResponse,
} from "@/lib/assessments";

type DashboardData = {
    summary: DashboardSummary;
    tasks: Task[];
    assessmentSummary: AssessmentSummaryResponse | null;
    questions: AssessmentQuestionResponse[];
};

type PageStatus = "loading" | "ready" | "error";

const domainLabels: Record<string, string> = {
    ORGANIZATIONAL: "Organizational controls",
    PEOPLE: "People controls",
    PHYSICAL: "Physical controls",
    TECHNOLOGICAL: "Technological controls",
};

function getErrorMessage(error: unknown) {
    return error instanceof Error ? error.message : "Could not load dashboard data.";
}

function priorityClass(priority: Task["priority"]) {
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

function complianceLabel(score: number) {
    if (score >= 80) return "Good";
    if (score >= 50) return "In progress";
    return "Needs work";
}

export default function DashboardPage() {
    const [status, setStatus] = useState<PageStatus>("loading");
    const [message, setMessage] = useState("");
    const [data, setData] = useState<DashboardData | null>(null);

    useEffect(() => {
        let active = true;

        async function loadDashboard() {
            try {
                setStatus("loading");
                setMessage("");

                const [summary, tasks, assessmentSummary, latestAssessment] =
                    await Promise.all([
                        getDashboardSummary(),
                        getTasks(),
                        getLatestAssessmentSummary(),
                        getLatestAssessment(),
                    ]);

                const questions = latestAssessment
                    ? await getAssessmentQuestions(latestAssessment.id)
                    : [];

                if (!active) return;

                setData({ summary, tasks, assessmentSummary, questions });
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

    const domainProgress = useMemo(() => {
        if (!data?.questions.length) return [];

        const grouped = data.questions.reduce<
            Record<string, { total: number; ready: number }>
        >((accumulator, question) => {
            const current = accumulator[question.domain] ?? { total: 0, ready: 0 };
            current.total += 1;

            if (question.answer === "YES" || question.answer === "NOT_APPLICABLE") {
                current.ready += 1;
            }

            accumulator[question.domain] = current;
            return accumulator;
        }, {});

        return Object.entries(grouped)
            .map(([domain, value]) => ({
                domain,
                label: domainLabels[domain] ?? domain,
                progress: value.total ? Math.round((value.ready / value.total) * 100) : 0,
            }))
            .sort((left, right) => right.progress - left.progress);
    }, [data]);

    if (status === "loading") {
        return (
            <main className="app-main">
                <AppTopbar
                    title="Dashboard"
                    description="Welcome back! Here is your compliance overview."
                    frameworkOptions={["All frameworks", "ISO 27001"]}
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
                    frameworkOptions={["All frameworks", "ISO 27001"]}
                />
                <AppErrorState title="Could not load dashboard" message={message} />
            </main>
        );
    }

    if (!data) {
        return (
            <main className="app-main">
                <AppTopbar
                    title="Dashboard"
                    description="Welcome back! Here is your compliance overview."
                    frameworkOptions={["All frameworks", "ISO 27001"]}
                />
                <AppEmptyState title="No dashboard data" />
            </main>
        );
    }

    const { summary, tasks, assessmentSummary } = data;
    const score = Math.max(0, Math.min(summary.overallCompliance, 100));
    const scoreLabel = complianceLabel(score);
    const recentTasks = tasks.slice(0, 3);

    return (
        <main className="app-main">
            <AppTopbar
                title="Dashboard"
                description="Welcome back! Here is your compliance overview."
                frameworkOptions={["All frameworks", "ISO 27001"]}
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
                            <span className="status-dot done">✓</span>
                            <span>Implemented</span>
                            <strong>{summary.controls.implemented}</strong>
                        </div>
                        <div className="app-status-row">
                            <span className="status-dot progress"></span>
                            <span>In progress</span>
                            <strong>{summary.controls.inProgress}</strong>
                        </div>
                        <div className="app-status-row">
                            <span className="status-dot empty"></span>
                            <span>Not started</span>
                            <strong>{summary.controls.notStarted}</strong>
                        </div>
                    </div>

                    <div className="app-total-row">
                        <span>Total controls</span>
                        <strong>{summary.controls.total}</strong>
                    </div>
                </article>

                <article className="app-card">
                    <div className="app-card-header">
                        <h2>Open risks</h2>
                    </div>
                    <div className="risk-list">
                        <div className="risk-row">
                            <strong>{summary.risks.high}</strong>
                            <span className="high">High</span>
                        </div>
                        <div className="risk-row">
                            <strong>{summary.risks.medium}</strong>
                            <span className="medium">Medium</span>
                        </div>
                        <div className="risk-row">
                            <strong>{summary.risks.low}</strong>
                            <span className="low">Low</span>
                        </div>
                    </div>
                    <Link href="/dashboard/risks" className="dash-link">
                        View risk register →
                    </Link>
                </article>
            </section>

            <section className="app-content-grid">
                <article className="app-card app-wide-card">
                    <div className="app-card-header">
                        <h2>Top control domains</h2>
                        <Link href="/dashboard/controls" className="dash-link">
                            View all controls →
                        </Link>
                    </div>

                    {domainProgress.length ? (
                        <div className="control-domain-list">
                            {domainProgress.map((domain) => (
                                <div className="app-bar-row" key={domain.domain}>
                                    <span>{domain.label}</span>
                                    <div>
                                        <i style={{ width: `${domain.progress}%` }}></i>
                                    </div>
                                    <strong>{domain.progress}%</strong>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="app-muted-text">
                            Domain progress appears after an assessment has questions.
                        </p>
                    )}
                </article>

                <article className="app-card">
                    <div className="app-card-header">
                        <h2>Recent tasks</h2>
                        <Link href="/dashboard/tasks" className="dash-link">
                            View all →
                        </Link>
                    </div>

                    {recentTasks.length ? (
                        <div className="app-task-list">
                            {recentTasks.map((task) => (
                                <div className="task-row" key={task.id}>
                                    <span className={task.status === "Done" ? "task-check" : "task-empty"}>
                                        {task.status === "Done" ? "✓" : ""}
                                    </span>
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
                        <p className="app-muted-text">No tasks are available.</p>
                    )}
                </article>
            </section>

            <section className="app-content-grid secondary-grid">
                <article className="app-card">
                    <div className="app-card-header">
                        <h2>Assessment progress</h2>
                    </div>
                    {assessmentSummary ? (
                        <>
                            <div className="assessment-list">
                                <div>
                                    <strong>{assessmentSummary.name}</strong>
                                    <p>
                                        {assessmentSummary.answeredControls} of{" "}
                                        {assessmentSummary.totalControls} controls answered
                                    </p>
                                </div>
                                <div className="mini-progress">
                                    <span
                                        style={{
                                            width: `${assessmentSummary.completionPercentage}%`,
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
                        </>
                    ) : (
                        <p className="app-muted-text">No assessment is available yet.</p>
                    )}
                </article>

                <article className="app-card">
                    <div className="app-card-header">
                        <h2>Evidence health</h2>
                    </div>
                    <div className="evidence-stats">
                        <div>
                            <strong>{summary.evidence.uploaded}</strong>
                            <span>Uploaded</span>
                        </div>
                        <div>
                            <strong>{summary.evidence.missing}</strong>
                            <span>Missing</span>
                        </div>
                        <div>
                            <strong>{summary.evidence.expiring}</strong>
                            <span>Expiring</span>
                        </div>
                    </div>
                </article>
            </section>
        </main>
    );
}
