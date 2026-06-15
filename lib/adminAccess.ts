const fallbackPlatformAdminUserIds = [
    "2280e40b-6e29-45ba-a4de-ee761767eb84",
    "2ce6b331-b5f6-4738-ba40-c99243a3e05d",
];

function parseConfiguredAdminUserIds() {
    return (
        process.env.NEXT_PUBLIC_PLATFORM_ADMIN_USER_IDS?.split(",")
            .map((id) => id.trim().toLowerCase())
            .filter(Boolean) ?? []
    );
}

export function getPlatformAdminUserIds() {
    return Array.from(
        new Set([
            ...fallbackPlatformAdminUserIds,
            ...parseConfiguredAdminUserIds(),
        ])
    );
}

export function isPlatformAdminUserId(userId: string | undefined) {
    if (!userId) {
        return false;
    }

    return getPlatformAdminUserIds().includes(userId.toLowerCase());
}

export function getAdminApiAccessMessage() {
    return `Backend must also include these Supabase user IDs in PLATFORM_ADMIN_USER_IDS: ${getPlatformAdminUserIds().join(", ")}`;
}
