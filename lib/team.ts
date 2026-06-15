import { apiRequest } from "./api";
import { getCurrentOrganizationId, type MembershipRole } from "./auth";

export type TeamRole = MembershipRole;

export type MembershipResponse = {
    id: string;
    organizationId: string;
    userProfileId: string;
    email: string;
    supabaseUserId: string | null;
    role: MembershipRole;
    createdAt: string;
};

export type TeamMember = MembershipResponse & {
    name?: string;
    status: "ACTIVE";
};

export type InvitationStatus = "PENDING" | "ACCEPTED" | "REVOKED" | "EXPIRED";

export type InvitationResponse = {
    id: string;
    organizationId: string;
    email: string;
    role: MembershipRole;
    status: InvitationStatus;
    expiresAt: string;
    acceptedAt: string | null;
    revokedAt: string | null;
    invitedByMembershipId: string;
    acceptedByMembershipId: string | null;
    revokedByMembershipId: string | null;
    createdAt: string;
};

export type Invitation = InvitationResponse;

export type CreateMembershipPayload = {
    email: string;
    role: MembershipRole;
    supabaseUserId?: string;
};

export type CreateInvitationPayload = {
    email: string;
    name?: string;
    role: Exclude<MembershipRole, "OWNER">;
};

export type CreateInvitationResponse = {
    invitation: InvitationResponse;
    acceptanceToken: string;
};

export type AcceptInvitationResponse = {
    invitation: InvitationResponse;
    membership: MembershipResponse;
};

async function resolveOrganizationId(organizationId?: string, token?: string) {
    return organizationId ?? getCurrentOrganizationId(token);
}

export async function createMembership(
    payload: CreateMembershipPayload,
    organizationId?: string,
    token?: string
) {
    const resolvedOrganizationId = await resolveOrganizationId(organizationId, token);

    return apiRequest<MembershipResponse>(
        `/organizations/${resolvedOrganizationId}/memberships`,
        {
            method: "POST",
            body: payload,
            token,
        }
    );
}

export async function getMemberships(organizationId?: string, token?: string) {
    const resolvedOrganizationId = await resolveOrganizationId(organizationId, token);

    return apiRequest<MembershipResponse[]>(
        `/organizations/${resolvedOrganizationId}/memberships`,
        {
            method: "GET",
            token,
        }
    );
}

export function getMembership(id: string, token?: string) {
    return apiRequest<MembershipResponse>(`/memberships/${id}`, {
        method: "GET",
        token,
    });
}

export async function getTeamMembers(organizationId?: string, token?: string) {
    const memberships = await getMemberships(organizationId, token);

    return memberships.map((membership): TeamMember => ({
        ...membership,
        status: "ACTIVE",
    }));
}

export async function getInvitations(organizationId?: string, token?: string) {
    const resolvedOrganizationId = await resolveOrganizationId(organizationId, token);

    return apiRequest<InvitationResponse[]>(
        `/organizations/${resolvedOrganizationId}/invitations`,
        {
            method: "GET",
            token,
        }
    );
}

export async function createInvitation(
    payload: CreateInvitationPayload,
    organizationId?: string,
    token?: string
) {
    const resolvedOrganizationId = await resolveOrganizationId(organizationId, token);
    const { email, role } = payload;

    return apiRequest<CreateInvitationResponse>(
        `/organizations/${resolvedOrganizationId}/invitations`,
        {
            method: "POST",
            body: { email, role },
            token,
        }
    );
}

export function acceptInvitation(tokenValue: string, token?: string) {
    return apiRequest<AcceptInvitationResponse>("/invitations/accept", {
        method: "POST",
        body: { token: tokenValue },
        token,
    });
}

export async function revokeInvitation(
    invitationId: string,
    organizationId?: string,
    token?: string
) {
    const resolvedOrganizationId = await resolveOrganizationId(organizationId, token);

    return apiRequest<void>(
        `/organizations/${resolvedOrganizationId}/invitations/${invitationId}`,
        {
            method: "DELETE",
            token,
        }
    );
}
