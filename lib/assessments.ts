import { apiRequest } from "./api";

export type Assessment = {
    id: string;
    title: string;
    status: "Not started" | "In progress" | "Completed";
    completedQuestions: number;
    totalQuestions: number;
    score?: number;
};

export function getAssessments(token?: string) {
    return apiRequest<Assessment[]>("/assessments", {
        method: "GET",
        token,
    });
}

export function getAssessment(id: string, token?: string) {
    return apiRequest<Assessment>(`/assessments/${id}`, {
        method: "GET",
        token,
    });
}