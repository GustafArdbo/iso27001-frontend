import { createClient } from "@/lib/supabase/client";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "");

if (!API_BASE_URL) {
    throw new Error("Missing NEXT_PUBLIC_API_BASE_URL");
}

type ApiOptions = {
    method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    body?: unknown;
    token?: string;
    auth?: boolean;
};

export async function apiRequest<T>(
    path: string,
    options: ApiOptions = {}
): Promise<T> {
    const { method = "GET", body, token, auth = true } = options;

    const normalizedPath = path.startsWith("/") ? path : `/${path}`;

    let accessToken = token;

    if (auth && !accessToken) {
        const supabase = createClient();

        const {
            data: { session },
        } = await supabase.auth.getSession();

        accessToken = session?.access_token;
    }

    const response = await fetch(`${API_BASE_URL}${normalizedPath}`, {
        method,
        headers: {
            "Content-Type": "application/json",
            ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    });

    if (!response.ok) {
        const errorText = await response.text();

        throw new Error(
            `API request failed: ${response.status} ${response.statusText} - ${errorText}`
        );
    }

    if (response.status === 204) {
        return undefined as T;
    }

    return response.json() as Promise<T>;
}