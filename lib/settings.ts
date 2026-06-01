import { apiRequest } from "./api";

export type WorkspaceSettings = {
    workspaceName: string;
    framework: string;
    notificationEmail: string;
};

export function getSettings(token?: string) {
    return apiRequest<WorkspaceSettings>("/settings", {
        method: "GET",
        token,
    });
}

export function updateSettings(payload: WorkspaceSettings, token?: string) {
    return apiRequest<WorkspaceSettings>("/settings", {
        method: "PUT",
        body: payload,
        token,
    });
}