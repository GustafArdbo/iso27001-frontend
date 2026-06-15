import {
    getAssessmentQuestions,
    getLatestAssessment,
    type AssessmentQuestionResponse,
} from "./assessments";

export type Risk = {
    id: string;
    title: string;
    severity: "High" | "Medium" | "Low";
    owner: string;
    status: "Open" | "In progress" | "Mitigated";
};

function toRisk(question: AssessmentQuestionResponse): Risk | null {
    if (question.answer === "YES" || question.answer === "NOT_APPLICABLE") {
        return null;
    }

    const severity = question.answer === "NO" ? "High" : "Medium";
    const status = question.answered ? "In progress" : "Open";

    return {
        id: question.controlId,
        title: question.title,
        severity,
        owner: "Unassigned",
        status,
    };
}

export async function getRisks(token?: string) {
    const assessment = await getLatestAssessment(token);

    if (!assessment) {
        return [];
    }

    const questions = await getAssessmentQuestions(assessment.id, token);

    return questions
        .map(toRisk)
        .filter((risk): risk is Risk => risk !== null);
}

export async function getRisk(id: string, token?: string) {
    const risks = await getRisks(token);
    const risk = risks.find(
        (riskItem) => riskItem.id.toLowerCase() === id.toLowerCase()
    );

    if (!risk) {
        throw new Error(`Risk not found: ${id}`);
    }

    return risk;
}
