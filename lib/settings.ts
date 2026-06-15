import { getCurrentAuthUser } from "./auth";
import { getCurrentOrganization } from "./organizations";

export type WorkspaceSettings = {
    workspaceName: string;
    framework: string;
    notificationEmail: string;
};

export async function getSettings(token?: string): Promise<WorkspaceSettings> {
    const [authUser, organization] = await Promise.all([
        getCurrentAuthUser(token),
        getCurrentOrganization(token),
    ]);

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
