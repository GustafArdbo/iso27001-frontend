import { apiRequest } from "./api";

export type ControlDomain =
    | "ORGANIZATIONAL"
    | "PEOPLE"
    | "PHYSICAL"
    | "TECHNOLOGICAL";

export type ControlResponse = {
    id: string;
    domain: ControlDomain;
    title: string;
    question: string;
    sortOrder: number;
};

export type Control = ControlResponse;

function isControlDomain(value: string | undefined): value is ControlDomain {
    return (
        value === "ORGANIZATIONAL" ||
        value === "PEOPLE" ||
        value === "PHYSICAL" ||
        value === "TECHNOLOGICAL"
    );
}

export function getControls(token?: string): Promise<ControlResponse[]>;
export function getControls(
    domain?: ControlDomain,
    token?: string
): Promise<ControlResponse[]>;
export function getControls(domainOrToken?: ControlDomain | string, token?: string) {
    const domain = isControlDomain(domainOrToken) ? domainOrToken : undefined;
    const accessToken = domain ? token : domainOrToken ?? token;

    return apiRequest<ControlResponse[]>("/controls", {
        method: "GET",
        query: { domain },
        token: accessToken,
    });
}

export function getControl(id: string, token?: string) {
    return apiRequest<ControlResponse>(`/controls/${encodeURIComponent(id)}`, {
        method: "GET",
        token,
    });
}
