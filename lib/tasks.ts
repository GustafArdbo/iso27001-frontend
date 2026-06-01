import { apiRequest } from "./api";

export type Task = {
    id: string;
    title: string;
    dueDate: string;
    priority: "High" | "Medium" | "Low";
    status: "Open" | "In progress" | "Done";
};

export function getTasks(token?: string) {
    return apiRequest<Task[]>("/tasks", {
        method: "GET",
        token,
    });
}

export function updateTaskStatus(
    id: string,
    status: Task["status"],
    token?: string
) {
    return apiRequest<Task>(`/tasks/${id}`, {
        method: "PATCH",
        body: { status },
        token,
    });
}