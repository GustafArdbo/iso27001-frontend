import { apiRequest } from "./api";

export type TeamRole = "OWNER" | "ADMIN" | "AUDITOR" | "MEMBER" | "VIEWER";

export type TeamMember = {
    id: string;
    organizationId: string;
    userProfileId: string;
    email: string;
    supabaseUserId?: string;
    role: TeamRole;
    createdAt: string;
};

export type InvitationStatus = "PENDING" | "ACCEPTED" | "EXPIRED" | "REVOKED";

export type Invitation = {
    id: string;
    organizationId: string;
    email: string;
    role: Exclude<TeamRole, "OWNER">;
    status: InvitationStatus;
    expiresAt?: string;
    acceptedAt?: string;
    revokedAt?: string;
    createdAt: string;
};

export type CreateInvitationResponse = {
    invitation: Invitation;
    acceptanceToken?: string;
};

export type CreateInvitationPayload = {
    email: string;
    role: Exclude<TeamRole, "OWNER">;
};

export function getTeamMembers(organizationId: string) {
    return apiRequest<TeamMember[]>(
        `/organizations/${organizationId}/memberships`,
        {
            method: "GET",
        }
    );
}

export function getInvitations(organizationId: string) {
    return apiRequest<Invitation[]>(
        `/organizations/${organizationId}/invitations`,
        {
            method: "GET",
        }
    );
}

export function createInvitation(
    organizationId: string,
    payload: CreateInvitationPayload
) {
    return apiRequest<CreateInvitationResponse>(
        `/organizations/${organizationId}/invitations`,
        {
            method: "POST",
            body: payload,
        }
    );
}