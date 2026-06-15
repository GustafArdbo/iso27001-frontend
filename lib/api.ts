import { createClient } from "@/lib/supabase/client";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "");

if (!API_BASE_URL) {
    throw new Error("Missing NEXT_PUBLIC_API_BASE_URL");
}

type ApiOptions = {
    method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    body?: unknown;
    query?: Record<string, string | number | boolean | null | undefined>;
    token?: string;
    auth?: boolean;
};

export async function apiRequest<T>(
    path: string,
    options: ApiOptions = {}
): Promise<T> {
    const { method = "GET", body, query, token, auth = true } = options;

    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    const searchParams = new URLSearchParams();

    if (query) {
        Object.entries(query).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== "") {
                searchParams.set(key, String(value));
            }
        });
    }

    const queryString = searchParams.toString();
    const requestPath = queryString
        ? `${normalizedPath}?${queryString}`
        : normalizedPath;

    let accessToken = token;

    if (auth && !accessToken) {
        const supabase = createClient();

        const {
            data: { session },
        } = await supabase.auth.getSession();

        accessToken = session?.access_token;
    }

    const response = await fetch(`${API_BASE_URL}${requestPath}`, {
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

    const text = await response.text();

    if (!text) {
        return undefined as T;
    }

    return JSON.parse(text) as T;
}
