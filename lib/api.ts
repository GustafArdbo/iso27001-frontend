const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

type ApiOptions = {
    method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    body?: unknown;
    token?: string;
};

export async function apiRequest<T>(
    path: string,
    options: ApiOptions = {}
): Promise<T> {
    const { method = "GET", body, token } = options;

    const response = await fetch(`${API_BASE_URL}${path}`, {
        method,
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        ...(body ? { body: JSON.stringify(body) } : {}),
    });

    if (!response.ok) {
        const errorText = await response.text();

        throw new Error(
            `API request failed: ${response.status} ${response.statusText} - ${errorText}`
        );
    }

    return response.json();
}