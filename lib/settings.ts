import { apiRequest } from "./api";
import { getCurrentAuthUser, getCurrentOrganizationId } from "./auth";

export type WorkspaceSettings = {
    workspaceName: string;
    framework: string;
    notificationEmail: string;
};

export async function getSettings(token?: string): Promise<WorkspaceSettings> {
    const [authUser, organizationId] = await Promise.all([
        getCurrentAuthUser(token),
        getCurrentOrganizationId(token),
    ]);
    const organization = await apiRequest<{ name: string }>(
        `/organizations/${organizationId}`,
        {
            method: "GET",
            token,
        }
    );

    return {
        workspaceName: organization.name,
        framework: "ISO 27001",
        notificationEmail: authUser.email,
    };
}

export async function updateSettings(payload: WorkspaceSettings, token?: string) {
    void token;

    return payload;
}
