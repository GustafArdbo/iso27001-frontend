import {
    getAssessmentQuestions,
    getLatestAssessment,
    type AssessmentQuestionResponse,
} from "./assessments";

export type EvidenceItem = {
    id: string;
    title: string;
    controlCode: string;
    status: "Uploaded" | "Missing" | "Expiring";
    owner: string;
    updatedAt: string;
};

function toEvidenceStatus(question: AssessmentQuestionResponse): EvidenceItem["status"] {
    if (!question.answered || question.answer === "NO") {
        return "Missing";
    }

    if (question.answer === "PARTIAL") {
        return "Expiring";
    }

    return "Uploaded";
}

function toEvidenceItem(
    question: AssessmentQuestionResponse,
    fallbackDate: string
): EvidenceItem {
    return {
        id: question.answerId ?? question.controlId,
        title: question.title,
        controlCode: question.controlId,
        status: toEvidenceStatus(question),
        owner: "Unassigned",
        updatedAt: question.answeredAt ?? fallbackDate,
    };
}

export async function getEvidence(token?: string) {
    const assessment = await getLatestAssessment(token);

    if (!assessment) {
        return [];
    }

    const questions = await getAssessmentQuestions(assessment.id, token);

    return questions.map((question) => toEvidenceItem(question, assessment.createdAt));
}

export async function getEvidenceItem(id: string, token?: string) {
    const evidence = await getEvidence(token);
    const item = evidence.find(
        (evidenceItem) =>
            evidenceItem.id === id || evidenceItem.controlCode.toLowerCase() === id.toLowerCase()
    );

    if (!item) {
        throw new Error(`Evidence item not found: ${id}`);
    }

    return item;
}
