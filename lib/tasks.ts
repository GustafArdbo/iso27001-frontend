import {
    getAssessmentQuestions,
    getLatestAssessment,
    submitAssessmentAnswer,
    type AssessmentQuestionResponse,
} from "./assessments";

export type Task = {
    id: string;
    title: string;
    dueDate: string;
    priority: "High" | "Medium" | "Low";
    status: "Open" | "In progress" | "Done";
};

function addDays(days: number) {
    const date = new Date();
    date.setDate(date.getDate() + days);

    return date.toISOString();
}

function toTask(assessmentId: string, question: AssessmentQuestionResponse): Task {
    const isDone = question.answer === "YES" || question.answer === "NOT_APPLICABLE";
    const isInProgress = question.answer === "PARTIAL";

    return {
        id: `${assessmentId}:${question.controlId}`,
        title: question.title,
        dueDate: addDays(isDone ? 14 : isInProgress ? 7 : 3),
        priority: question.answer === "NO" ? "High" : isInProgress ? "Medium" : "Low",
        status: isDone ? "Done" : isInProgress ? "In progress" : "Open",
    };
}

export async function getTasks(token?: string) {
    const assessment = await getLatestAssessment(token);

    if (!assessment) {
        return [];
    }

    const questions = await getAssessmentQuestions(assessment.id, token);

    return questions.map((question) => toTask(assessment.id, question));
}

export async function updateTaskStatus(
    id: string,
    status: Task["status"],
    token?: string
) {
    const [assessmentId, controlId] = id.split(":");

    if (!assessmentId || !controlId) {
        throw new Error(`Invalid assessment task id: ${id}`);
    }

    await submitAssessmentAnswer(
        assessmentId,
        {
            controlId,
            answer:
                status === "Done"
                    ? "YES"
                    : status === "In progress"
                      ? "PARTIAL"
                      : "NO",
        },
        token
    );

    const tasks = await getTasks(token);
    const task = tasks.find((taskItem) => taskItem.id === id);

    if (!task) {
        throw new Error(`Task not found: ${id}`);
    }

    return task;
}
