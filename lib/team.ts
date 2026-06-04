import { apiRequest } from "./api";

export type TeamRole = "OWNER" | "ADMIN" | "MEMBER" | "VIEWER";

export type TeamMember = {
    id: string;
    email: string;
    name?: string;
    role: TeamRole;
    status: "ACTIVE" | "INVITED" | "DISABLED";
    createdAt: string;
};

export type Invitation = {
    id: string;
    email: string;
    role: Exclude<TeamRole, "OWNER">;
    status: "PENDING" | "ACCEPTED" | "EXPIRED" | "REVOKED";
    createdAt: string;
    expiresAt?: string;
};

export type CreateInvitationPayload = {
    email: string;
    name?: string;
    role: Exclude<TeamRole, "OWNER">;
};

export function getTeamMembers() {
    return apiRequest<TeamMember[]>("/organizations/current/members", {
        method: "GET",
    });
}

export function getInvitations() {
    return apiRequest<Invitation[]>("/organizations/current/invitations", {
        method: "GET",
    });
}

export function createInvitation(payload: CreateInvitationPayload) {
    return apiRequest<Invitation>("/organizations/current/invitations", {
        method: "POST",
        body: payload,
    });
}