import { apiRequest } from "./api";
import { createClient } from "./supabase/client";

export type MembershipRole = "OWNER" | "ADMIN" | "AUDITOR" | "MEMBER" | "VIEWER";

export type UserProfileResponse = {
    id: string;
    supabaseUserId: string;
    email: string;
    createdAt: string;
};

export type AuthMembershipResponse = {
    membershipId: string;
    organizationId: string;
    userProfileId: string;
    email: string;
    role: MembershipRole;
};

export type AuthUserResponse = {
    subject: string;
    email: string;
    providerRole: string;
    sessionId: string | null;
    jwtId: string | null;
    expiresAt: string | null;
    platformAdmin: boolean;
    profile: UserProfileResponse | null;
    memberships: AuthMembershipResponse[];
};

export type RevocationResponse = {
    type: "TOKEN" | "SESSION";
    subject: string;
    jwtId: string | null;
    sessionId: string | null;
    expiresAt: string | null;
};

export type LoginPayload = {
    email: string;
    password: string;
};

export type LoginResponse = {
    accessToken: string;
    user: {
        id: string;
        email: string;
        name?: string;
    };
    authUser: AuthUserResponse;
};

export type SupabaseLoginResponse = {
    accessToken: string;
    user: {
        id: string;
        email: string;
        name?: string;
    };
};

type RevocationPayload = {
    reason?: string;
};

const rolePriority: MembershipRole[] = [
    "OWNER",
    "ADMIN",
    "AUDITOR",
    "MEMBER",
    "VIEWER",
];

export function getCurrentAuthUser(token?: string) {
    return apiRequest<AuthUserResponse>("/auth/me", {
        method: "GET",
        token,
    });
}

export async function signInWithPassword(
    payload: LoginPayload
): Promise<SupabaseLoginResponse> {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithPassword(payload);

    if (error) {
        throw new Error(error.message);
    }

    const accessToken = data.session?.access_token;

    if (!accessToken || !data.user) {
        throw new Error("No Supabase session was returned.");
    }

    return {
        accessToken,
        user: {
            id: data.user.id,
            email: data.user.email ?? payload.email,
        },
    };
}

export async function login(payload: LoginPayload): Promise<LoginResponse> {
    const session = await signInWithPassword(payload);
    const authUser = await getCurrentAuthUser(session.accessToken);

    return {
        accessToken: session.accessToken,
        authUser,
        user: session.user,
    };
}

export function revokeCurrentToken(
    payload: RevocationPayload = {},
    token?: string
) {
    return apiRequest<RevocationResponse>("/auth/revocations/current-token", {
        method: "POST",
        body: payload,
        token,
    });
}

export function revokeCurrentSession(
    payload: RevocationPayload = {},
    token?: string
) {
    return apiRequest<RevocationResponse>("/auth/revocations/current-session", {
        method: "POST",
        body: payload,
        token,
    });
}

export async function logout(token?: string) {
    try {
        await revokeCurrentSession({ reason: "user requested sign out" }, token);
    } catch {
        try {
            await revokeCurrentToken({ reason: "user requested sign out" }, token);
        } catch {
            // Supabase sign-out below is still required if backend revocation fails.
        }
    } finally {
        const supabase = createClient();
        await supabase.auth.signOut();
    }
}

export function getPrimaryMembership(authUser: AuthUserResponse) {
    return [...authUser.memberships].sort(
        (left, right) =>
            rolePriority.indexOf(left.role) - rolePriority.indexOf(right.role)
    )[0];
}

export async function getCurrentOrganizationId(token?: string) {
    const authUser = await getCurrentAuthUser(token);
    const membership = getPrimaryMembership(authUser);

    if (!membership) {
        throw new Error("No organization membership was found for this user.");
    }

    return membership.organizationId;
}
