import { apiRequest } from "@/lib/api";
import { getCurrentOrganizationId } from "@/lib/auth";
import {
    createOrganizationApplication,
    type OrganizationApplicationPayload,
    type SubmittedOrganizationApplicationResponse,
} from "@/lib/organizationApplications";
import type { ControlDomain } from "@/lib/controls";

export type AssessmentStatus = "DRAFT" | "IN_PROGRESS" | "COMPLETED";

export type AnswerStatus = "YES" | "PARTIAL" | "NO" | "NOT_APPLICABLE";

export type AssessmentResponse = {
    id: string;
    organizationId: string;
    name: string;
    status: AssessmentStatus;
    createdAt: string;
};

export type CreateAssessmentPayload = {
    organizationId: string;
    name: string;
};

export type AssessmentQuestionResponse = {
    controlId: string;
    domain: ControlDomain;
    title: string;
    question: string;
    sortOrder: number;
    answered: boolean;
    answerId: string | null;
    answer: AnswerStatus | null;
    comment: string | null;
    answeredAt: string | null;
};

export type SubmitAnswerPayload = {
    controlId: string;
    answer: AnswerStatus;
    comment?: string;
};

export type AssessmentAnswerResponse = {
    id: string;
    assessmentId: string;
    controlId: string;
    answer: AnswerStatus;
    comment: string | null;
    createdAt: string;
};

export type AssessmentSummaryResponse = {
    id: string;
    organizationId: string;
    name: string;
    status: AssessmentStatus;
    totalControls: number;
    answeredControls: number;
    unansweredControls: number;
    completionPercentage: number;
    totalAnswers: number;
    applicableAnswers: number;
    score: number;
    scorePercentage: number;
    gapPercentage: number;
    answerCounts: Record<AnswerStatus, number>;
};

export type CreateDemoRequestPayload = OrganizationApplicationPayload;

export type DemoRequestResponse = SubmittedOrganizationApplicationResponse;

export function createAssessment(payload: CreateAssessmentPayload, token?: string) {
    return apiRequest<AssessmentResponse>("/assessments", {
        method: "POST",
        body: payload,
        token,
    });
}

export async function createAssessmentForCurrentOrganization(
    name: string,
    token?: string
) {
    const organizationId = await getCurrentOrganizationId(token);

    return createAssessment({ organizationId, name }, token);
}

export function getOrganizationAssessments(
    organizationId: string,
    token?: string
) {
    return apiRequest<AssessmentResponse[]>(
        `/organizations/${organizationId}/assessments`,
        {
            method: "GET",
            token,
        }
    );
}

export async function getCurrentOrganizationAssessments(token?: string) {
    const organizationId = await getCurrentOrganizationId(token);

    return getOrganizationAssessments(organizationId, token);
}

export async function getLatestAssessment(token?: string) {
    const assessments = await getCurrentOrganizationAssessments(token);

    return assessments[0] ?? null;
}

export function getAssessment(id: string, token?: string) {
    return apiRequest<AssessmentResponse>(`/assessments/${id}`, {
        method: "GET",
        token,
    });
}

export function getAssessmentQuestions(id: string, token?: string) {
    return apiRequest<AssessmentQuestionResponse[]>(
        `/assessments/${id}/questions`,
        {
            method: "GET",
            token,
        }
    );
}

export function submitAssessmentAnswer(
    id: string,
    payload: SubmitAnswerPayload,
    token?: string
) {
    return apiRequest<AssessmentAnswerResponse>(`/assessments/${id}/answers`, {
        method: "POST",
        body: payload,
        token,
    });
}

export function getAssessmentSummary(id: string, token?: string) {
    return apiRequest<AssessmentSummaryResponse>(`/assessments/${id}/summary`, {
        method: "GET",
        token,
    });
}

export async function getLatestAssessmentSummary(token?: string) {
    const assessment = await getLatestAssessment(token);

    if (!assessment) {
        return null;
    }

    return getAssessmentSummary(assessment.id, token);
}

export async function createDemoRequest(
    payload: CreateDemoRequestPayload
): Promise<DemoRequestResponse> {
    return createOrganizationApplication(payload);
}
