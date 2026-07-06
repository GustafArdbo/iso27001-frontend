"use client";

import { useEffect, useState } from "react";
import AppTopbar from "@/components/AppTopbar";
import {
    AppEmptyState,
    AppErrorState,
    AppLoadingState,
} from "@/components/AppDataState";
import { getTasks, updateTaskStatus, type Task } from "@/lib/tasks";

type PageStatus = "loading" | "ready" | "error";

function getErrorMessage(error: unknown) {
    return error instanceof Error ? error.message : "Could not load tasks.";
}

function priorityPill(priority: Task["priority"]) {
    if (priority === "High") return "error";
    if (priority === "Medium") return "warning";
    return "good";
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
    const [tasks, setTasks] = useState<Task[]>([]);
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    async function loadTasks() {
        try {
            setStatus("loading");
            setMessage("");
            setTasks(await getTasks());
            setStatus("ready");
        } catch (error) {
            console.error(error);
            setMessage(getErrorMessage(error));
            setStatus("error");
        }
    }

    useEffect(() => {
        const timeoutId = window.setTimeout(() => {
            void loadTasks();
        }, 0);

        return () => window.clearTimeout(timeoutId);
    }, []);

    async function handleStatusChange(task: Task, nextStatus: Task["status"]) {
        try {
            setUpdatingId(task.id);
            const updatedTask = await updateTaskStatus(task.id, nextStatus);

            setTasks((currentTasks) =>
                currentTasks.map((currentTask) =>
                    currentTask.id === task.id ? updatedTask : currentTask
                )
            );
        } catch (error) {
            console.error(error);
            setMessage(getErrorMessage(error));
            setStatus("error");
        } finally {
            setUpdatingId(null);
        }
    }

    return (
        <main className="app-main tasks-page">
            <AppTopbar
                title="Tasks"
                description="Manage assigned actions, due dates, priorities, and remediation work."
            />

            {status === "loading" && <AppLoadingState title="Loading tasks" />}

            {status === "error" && (
                <AppErrorState title="Could not load tasks" message={message} />
            )}

            {status === "ready" && !tasks.length && (
                <AppEmptyState
                    title="No tasks"
                    message="Tasks appear after an assessment has controls to review."
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
                                    {task.status === "Done" ? "✓" : ""}
                                </span>
                                <div>
                                    <strong>{task.title}</strong>
                                    <p>Due {formatDueDate(task.dueDate)}</p>
                                </div>
                                <em className={`app-pill ${priorityPill(task.priority)}`}>
                                    {task.priority}
                                </em>
                                <select
                                    aria-label={`Status for ${task.title}`}
                                    value={task.status}
                                    disabled={updatingId === task.id}
                                    onChange={(event) =>
                                        handleStatusChange(
                                            task,
                                            event.target.value as Task["status"]
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
