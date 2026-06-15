import { apiRequest } from "./api";

export type RequestedMaterial = "standard-forms" | "checklist" | "gap-analysis";

export type CompanySize = "1-10" | "11-50" | "51-200" | "201-500" | "500+";

export type ApplicationStatus = "SUBMITTED" | "APPROVED" | "REJECTED";

export type OwnerInvitationStatus = "NOT_SENT" | "SENT" | "FAILED" | "ACCEPTED";

export type OrganizationApplicationPayload = {
    company: string;
    name: string;
    email: string;
    country: string;
    phone?: string;
    size: CompanySize | string;
    message?: string;
    materials: string[];
};

export type SubmittedOrganizationApplicationResponse = {
    id: string;
    status: "SUBMITTED";
    createdAt: string;
};

export type OrganizationApplicationResponse = {
    id: string;
    company: string;
    ownerName: string;
    ownerEmail: string;
    country: string;
    phone: string | null;
    size: CompanySize | string;
    message: string | null;
    materials: RequestedMaterial[];
    applicationStatus: ApplicationStatus;
    invitationStatus: OwnerInvitationStatus;
    organizationId: string | null;
    ownerProfileId: string | null;
    approvedBySupabaseUserId: string | null;
    approvedAt: string | null;
    rejectedBySupabaseUserId: string | null;
    rejectedAt: string | null;
    rejectionReason: string | null;
    invitationSentAt: string | null;
    invitationAcceptedAt: string | null;
    invitationFailureReason: string | null;
    createdAt: string;
};

export type RejectOrganizationApplicationPayload = {
    reason: string;
};

export function createOrganizationApplication(
    payload: OrganizationApplicationPayload
) {
    return apiRequest<SubmittedOrganizationApplicationResponse>(
        "/organization-applications",
        {
            method: "POST",
            body: payload,
            auth: false,
        }
    );
}

export function listOrganizationApplications(token?: string) {
    return apiRequest<OrganizationApplicationResponse[]>(
        "/admin/organization-applications",
        {
            method: "GET",
            token,
        }
    );
}

export function getOrganizationApplication(id: string, token?: string) {
    return apiRequest<OrganizationApplicationResponse>(
        `/admin/organization-applications/${id}`,
        {
            method: "GET",
            token,
        }
    );
}

export function approveOrganizationApplication(id: string, token?: string) {
    return apiRequest<OrganizationApplicationResponse>(
        `/admin/organization-applications/${id}/approve`,
        {
            method: "POST",
            token,
        }
    );
}

export function rejectOrganizationApplication(
    id: string,
    payload: RejectOrganizationApplicationPayload,
    token?: string
) {
    return apiRequest<OrganizationApplicationResponse>(
        `/admin/organization-applications/${id}/reject`,
        {
            method: "POST",
            body: payload,
            token,
        }
    );
}

export function resendOwnerInvitation(id: string, token?: string) {
    return apiRequest<OrganizationApplicationResponse>(
        `/admin/organization-applications/${id}/resend-owner-invitation`,
        {
            method: "POST",
            token,
        }
    );
}
