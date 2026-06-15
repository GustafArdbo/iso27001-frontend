import { createBrowserClient } from "@supabase/ssr";

const correctSupabaseUrl = "https://felytxvupxtwyaxdukhp.supabase.co";
const knownInvalidSupabaseUrls = new Set([
    "https://felytxvuptxwyaxdukhp.supabase.co",
]);

export function getSupabaseUrl() {
    const configuredUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");

    if (!configuredUrl || knownInvalidSupabaseUrls.has(configuredUrl)) {
        return correctSupabaseUrl;
    }

    return configuredUrl;
}

function getSupabasePublishableKey() {
    const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

    if (!publishableKey) {
        throw new Error("Missing NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY");
    }

    return publishableKey;
}

export function createClient() {
    return createBrowserClient(
        getSupabaseUrl(),
        getSupabasePublishableKey()
    );
}
