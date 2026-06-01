import { apiRequest } from "./api";

export type EvidenceItem = {
    id: string;
    title: string;
    controlCode: string;
    status: "Uploaded" | "Missing" | "Expiring";
    owner: string;
    updatedAt: string;
};

export function getEvidence(token?: string) {
    return apiRequest<EvidenceItem[]>("/evidence", {
        method: "GET",
        token,
    });
}

export function getEvidenceItem(id: string, token?: string) {
    return apiRequest<EvidenceItem>(`/evidence/${id}`, {
        method: "GET",
        token,
    });
}