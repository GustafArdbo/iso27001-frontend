import {
    allEvaluationQuestions,
    answerLabels,
    calculateEvaluationScore,
    evaluationSections,
    type EvaluationAnswer,
    type EvaluationQuestion,
    type StoredEvaluation,
} from "@/lib/iso27001Evaluation";

export type ControlStatus = "Implemented" | "In progress" | "Not started";
export type EvidenceStatus = "Uploaded" | "Missing" | "Expiring";
export type RiskSeverity = "High" | "Medium" | "Low";
export type TaskPriority = "High" | "Medium" | "Low";
export type TaskStatus = "Open" | "In progress" | "Done";

export type EvaluationQuestionState = EvaluationQuestion & {
    answer: EvaluationAnswer | "";
    answerLabel: string;
    comment: string;
    controlStatus: ControlStatus;
    progress: number;
};

export type EvaluationEvidenceRow = {
    id: string;
    title: string;
    controlCode: string;
    owner: string;
    status: EvidenceStatus;
    updatedAt: string;
    comment: string;
};

export type EvaluationRiskRow = {
    id: string;
    title: string;
    owner: string;
    severity: RiskSeverity;
    status: "Open" | "Treatment planned";
};

export type EvaluationTaskRow = {
    id: string;
    questionId: string;
    title: string;
    dueDate: string;
    priority: TaskPriority;
    status: TaskStatus;
};

export type EvaluationSectionProgress = {
    id: string;
    title: string;
    group: string;
    answered: number;
    total: number;
    progress: number;
};

export type EvaluationDashboardData = {
    score: ReturnType<typeof calculateEvaluationScore>;
    questions: EvaluationQuestionState[];
    controls: {
        implemented: number;
        inProgress: number;
        notStarted: number;
        total: number;
    };
    evidence: EvaluationEvidenceRow[];
    evidenceCounts: Record<EvidenceStatus, number>;
    risks: EvaluationRiskRow[];
    riskCounts: Record<RiskSeverity, number>;
    tasks: EvaluationTaskRow[];
    sectionProgress: EvaluationSectionProgress[];
};

export const emptyStoredEvaluation: StoredEvaluation = {
    profile: {},
    answers: {},
    comments: {},
    report: {},
};

export function getEvaluationStorageKey(assessmentId: string) {
    return `complypilot:iso27001-evaluation:${assessmentId}`;
}

export function loadStoredEvaluation(assessmentId: string): StoredEvaluation {
    if (!assessmentId || typeof window === "undefined") {
        return emptyStoredEvaluation;
    }

    const stored = window.localStorage.getItem(getEvaluationStorageKey(assessmentId));

    if (!stored) {
        return emptyStoredEvaluation;
    }

    try {
        return {
            ...emptyStoredEvaluation,
            ...JSON.parse(stored),
        };
    } catch {
        return emptyStoredEvaluation;
    }
}

export function saveStoredEvaluation(
    assessmentId: string,
    evaluation: StoredEvaluation
) {
    if (!assessmentId || typeof window === "undefined") return;

    window.localStorage.setItem(
        getEvaluationStorageKey(assessmentId),
        JSON.stringify(evaluation)
    );
}

export function getControlStatus(answer: EvaluationAnswer | ""): ControlStatus {
    if (answer === "YES" || answer === "NOT_APPLICABLE") {
        return "Implemented";
    }

    if (answer === "PARTIAL") {
        return "In progress";
    }

    return "Not started";
}

export function getQuestionProgress(answer: EvaluationAnswer | "") {
    if (answer === "YES" || answer === "NOT_APPLICABLE") return 100;
    if (answer === "PARTIAL") return 50;
    return 0;
}

export function getStatusPillClass(status: ControlStatus) {
    if (status === "Implemented") return "good";
    if (status === "In progress") return "warning";
    return "neutral";
}

export function getPriorityPillClass(priority: TaskPriority | RiskSeverity) {
    if (priority === "High") return "error";
    if (priority === "Medium") return "warning";
    return "good";
}

export function getEvidencePillClass(status: EvidenceStatus) {
    if (status === "Uploaded") return "good";
    if (status === "Expiring") return "warning";
    return "error";
}

export function taskStatusToAnswer(status: TaskStatus): EvaluationAnswer {
    if (status === "Done") return "YES";
    if (status === "In progress") return "PARTIAL";
    return "NO";
}

function getEvidenceStatus(question: EvaluationQuestionState): EvidenceStatus {
    if (question.answer === "YES" || question.answer === "NOT_APPLICABLE") {
        return question.comment.trim() ? "Uploaded" : "Missing";
    }

    if (question.answer === "PARTIAL") {
        return "Expiring";
    }

    return "Missing";
}

function getRiskSeverity(question: EvaluationQuestionState): RiskSeverity {
    if (question.answer === "NO" || question.answer === "DONT_KNOW") {
        if (question.weight === 3) return "High";
        if (question.weight === 2) return "Medium";
        return "Low";
    }

    return question.weight === 3 ? "Medium" : "Low";
}

function getTaskPriority(question: EvaluationQuestionState): TaskPriority {
    if (question.weight === 3) return "High";
    if (question.weight === 2) return "Medium";
    return "Low";
}

function getDueDate(priority: TaskPriority) {
    const date = new Date();
    const days = priority === "High" ? 7 : priority === "Medium" ? 14 : 30;
    date.setDate(date.getDate() + days);
    return date.toISOString();
}

function buildQuestionStates(
    evaluation: StoredEvaluation
): EvaluationQuestionState[] {
    return allEvaluationQuestions.map((question) => {
        const answer = evaluation.answers[question.id] ?? "";

        return {
            ...question,
            answer,
            answerLabel: answer ? answerLabels[answer] : "Unanswered",
            comment: evaluation.comments[question.id] ?? "",
            controlStatus: getControlStatus(answer),
            progress: getQuestionProgress(answer),
        };
    });
}

export function buildEvaluationDashboard(
    evaluation: StoredEvaluation
): EvaluationDashboardData {
    const questions = buildQuestionStates(evaluation);
    const score = calculateEvaluationScore(evaluation.answers);

    const controls = questions.reduce(
        (accumulator, question) => {
            if (question.controlStatus === "Implemented") {
                accumulator.implemented += 1;
            } else if (question.controlStatus === "In progress") {
                accumulator.inProgress += 1;
            } else {
                accumulator.notStarted += 1;
            }

            return accumulator;
        },
        {
            implemented: 0,
            inProgress: 0,
            notStarted: 0,
            total: questions.length,
        }
    );

    const evidence = questions.map((question) => ({
        id: `evidence-${question.id}`,
        title: question.evidence,
        controlCode: question.id,
        owner: question.section,
        status: getEvidenceStatus(question),
        updatedAt: new Date().toISOString(),
        comment: question.comment,
    }));

    const evidenceCounts = evidence.reduce(
        (accumulator, item) => {
            accumulator[item.status] += 1;
            return accumulator;
        },
        { Uploaded: 0, Missing: 0, Expiring: 0 }
    );

    const risks = questions
        .filter(
            (question) =>
                question.answer === "NO" ||
                question.answer === "DONT_KNOW" ||
                question.answer === "PARTIAL"
        )
        .map((question) => ({
            id: `risk-${question.id}`,
            title: question.question,
            owner: question.section,
            severity: getRiskSeverity(question),
            status:
                question.answer === "PARTIAL"
                    ? ("Treatment planned" as const)
                    : ("Open" as const),
        }));

    const riskCounts = risks.reduce(
        (accumulator, risk) => {
            accumulator[risk.severity] += 1;
            return accumulator;
        },
        { High: 0, Medium: 0, Low: 0 }
    );

    const tasks = questions
        .filter(
            (question) =>
                question.answer === "NO" ||
                question.answer === "DONT_KNOW" ||
                question.answer === "PARTIAL" ||
                (!question.answer && question.weight === 3)
        )
        .map((question) => {
            const priority = getTaskPriority(question);
            const status: TaskStatus =
                question.answer === "PARTIAL" ? "In progress" : "Open";
            const title =
                question.answer === "PARTIAL"
                    ? `Complete implementation: ${question.question}`
                    : !question.answer
                      ? `Assess critical control: ${question.question}`
                      : `Close gap: ${question.question}`;

            return {
                id: `task-${question.id}`,
                questionId: question.id,
                title,
                dueDate: getDueDate(priority),
                priority,
                status,
            };
        });

    const sectionProgress = evaluationSections.map((section) => {
        const sectionQuestions = questions.filter(
            (question) => question.section === section.title
        );
        const answered = sectionQuestions.filter((question) => question.answer).length;
        const total = sectionQuestions.length;

        return {
            id: section.id,
            title: section.title,
            group: section.group,
            answered,
            total,
            progress: total ? Math.round((answered / total) * 100) : 0,
        };
    });

    return {
        score,
        questions,
        controls,
        evidence,
        evidenceCounts,
        risks,
        riskCounts,
        tasks,
        sectionProgress,
    };
}
