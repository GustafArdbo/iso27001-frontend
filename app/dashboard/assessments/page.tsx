"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import AppTopbar from "@/components/AppTopbar";
import {
    AppEmptyState,
    AppErrorState,
    AppLoadingState,
} from "@/components/AppDataState";
import {
    createAssessmentForCurrentOrganization,
    getCurrentOrganizationAssessments,
    type AssessmentResponse,
} from "@/lib/assessments";
import {
    answerLabels,
    calculateEvaluationScore,
    companyProfileFields,
    evaluationSections,
    type EvaluationAnswer,
    type ProfileField,
    type StoredEvaluation,
} from "@/lib/iso27001Evaluation";
import {
    emptyStoredEvaluation,
    loadStoredEvaluation,
    saveStoredEvaluation,
} from "@/lib/iso27001EvaluationDashboard";

type PageStatus = "loading" | "ready" | "error";
type SaveStatus = "idle" | "saving" | "success" | "error";
type EvaluationCategory =
    | "company_profile"
    | "context_scope"
    | "leadership"
    | "risk_management"
    | "support"
    | "operation"
    | "performance"
    | "improvement"
    | "organizational_controls"
    | "people_controls"
    | "physical_controls"
    | "technological_controls";

type CategoryDefinition = {
    id: EvaluationCategory;
    label: string;
    chapter: string;
    sectionId?: string;
};

const categories: CategoryDefinition[] = [
    { id: "company_profile", label: "Company profile", chapter: "PART A" },
    { id: "context_scope", label: "Context & scope", chapter: "PART B", sectionId: "context-scope" },
    { id: "leadership", label: "Leadership", chapter: "PART C", sectionId: "leadership-governance" },
    { id: "risk_management", label: "Risk management", chapter: "PART D", sectionId: "risk-planning" },
    { id: "support", label: "Support", chapter: "PART E", sectionId: "support-documentation" },
    { id: "operation", label: "Operation", chapter: "PART F", sectionId: "operation" },
    {
        id: "performance",
        label: "Performance",
        chapter: "PART G",
        sectionId: "performance-evaluation",
    },
    { id: "improvement", label: "Improvement", chapter: "PART H", sectionId: "improvement" },
    {
        id: "organizational_controls",
        label: "Organizational controls",
        chapter: "PART I",
        sectionId: "organizational-controls",
    },
    { id: "people_controls", label: "People controls", chapter: "PART J", sectionId: "people-controls" },
    {
        id: "physical_controls",
        label: "Physical controls",
        chapter: "PART K",
        sectionId: "physical-controls",
    },
    {
        id: "technological_controls",
        label: "Technological controls",
        chapter: "PART L",
        sectionId: "technological-controls",
    },
];

const answerDescriptions: Record<EvaluationAnswer, string> = {
    YES: "Exists, is documented, and is used",
    PARTIAL: "Partly exists, but lacks documentation, ownership, or regularity",
    NO: "Missing",
    DONT_KNOW: "Unclear and should be investigated",
    NOT_APPLICABLE: "Excluded from score and should be justified",
};

function getErrorMessage(error: unknown) {
    return error instanceof Error ? error.message : "Could not load assessments.";
}

function statusPill(status: AssessmentResponse["status"]) {
    if (status === "COMPLETED") return "good";
    if (status === "IN_PROGRESS") return "warning";
    return "neutral";
}

function formatDate(value: string) {
    return new Intl.DateTimeFormat("en", {
        month: "short",
        day: "numeric",
        year: "numeric",
    }).format(new Date(value));
}

function renderProfileInput(
    field: ProfileField,
    value: string | string[] | undefined,
    onChange: (value: string | string[]) => void
) {
    const textValue = typeof value === "string" ? value : "";
    const selectedValues = Array.isArray(value) ? value : [];

    if (field.type === "textarea") {
        return (
            <textarea
                value={textValue}
                onChange={(event) => onChange(event.target.value)}
            />
        );
    }

    if (field.type === "select") {
        return (
            <select value={textValue} onChange={(event) => onChange(event.target.value)}>
                <option value="">Select</option>
                {field.options?.map((option) => (
                    <option key={option}>{option}</option>
                ))}
            </select>
        );
    }

    if (
        field.type === "yes-no" ||
        field.type === "yes-no-partial" ||
        field.type === "yes-no-dont-know"
    ) {
        const options =
            field.type === "yes-no"
                ? ["Yes", "No"]
                : field.type === "yes-no-partial"
                  ? ["Yes", "No", "Partially"]
                  : ["Yes", "No", "Don't know"];

        return (
            <select value={textValue} onChange={(event) => onChange(event.target.value)}>
                <option value="">Select</option>
                {options.map((option) => (
                    <option key={option}>{option}</option>
                ))}
            </select>
        );
    }

    if (field.type === "multiselect") {
        return (
            <div className="assessment-checkbox-grid">
                {field.options?.map((option) => (
                    <label key={option}>
                        <input
                            type="checkbox"
                            checked={selectedValues.includes(option)}
                            onChange={(event) => {
                                onChange(
                                    event.target.checked
                                        ? [...selectedValues, option]
                                        : selectedValues.filter((item) => item !== option)
                                );
                            }}
                        />
                        <span>{option}</span>
                    </label>
                ))}
            </div>
        );
    }

    if (field.type === "file") {
        const notePrefix = "__note__:";
        const note = selectedValues
            .find((item) => item.startsWith(notePrefix))
            ?.replace(notePrefix, "") ?? "";
        const fileNames = selectedValues.filter(
            (item) => !item.startsWith(notePrefix)
        );
        const updateFiles = (nextFileNames: string[], nextNote = note) => {
            onChange([
                ...nextFileNames,
                ...(nextNote.trim() ? [`${notePrefix}${nextNote}`] : []),
            ]);
        };

        return (
            <div
                className="assessment-file-dropzone"
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => {
                    event.preventDefault();
                    updateFiles([
                        ...fileNames,
                        ...Array.from(event.dataTransfer.files).map((file) => file.name),
                    ]);
                }}
            >
                <input
                    id={`file-${field.id}`}
                    type="file"
                    multiple
                    onChange={(event) => {
                        updateFiles([
                            ...fileNames,
                            ...Array.from(event.target.files ?? []).map(
                                (file) => file.name
                            ),
                        ]);
                        event.target.value = "";
                    }}
                />

                <label
                    className="assessment-file-choose"
                    htmlFor={`file-${field.id}`}
                >
                    Choose Files
                </label>

                <textarea
                    value={note}
                    placeholder="Write notes about existing policies, risk registers, asset lists, or security documentation."
                    onChange={(event) => updateFiles(fileNames, event.target.value)}
                />

                {fileNames.length > 0 && (
                    <ul className="assessment-file-list">
                        {fileNames.map((fileName) => (
                            <li key={fileName}>
                                <span>{fileName}</span>
                                <button
                                    type="button"
                                    onClick={() =>
                                        updateFiles(
                                            fileNames.filter((item) => item !== fileName)
                                        )
                                    }
                                >
                                    Remove
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        );
    }

    return (
        <input
            type={field.type === "email" || field.type === "date" ? field.type : "text"}
            value={textValue}
            onChange={(event) => onChange(event.target.value)}
        />
    );
}

export default function AssessmentsPage() {
    const [status, setStatus] = useState<PageStatus>("loading");
    const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
    const [message, setMessage] = useState("");
    const [saveMessage, setSaveMessage] = useState("");
    const [assessments, setAssessments] = useState<AssessmentResponse[]>([]);
    const [selectedAssessmentId, setSelectedAssessmentId] = useState("");
    const [evaluation, setEvaluation] =
        useState<StoredEvaluation>(emptyStoredEvaluation);
    const [creating, setCreating] = useState(false);
    const [activeCategory, setActiveCategory] =
        useState<EvaluationCategory>("company_profile");

    async function loadAssessments(preferredAssessmentId?: string) {
        try {
            setStatus("loading");
            setMessage("");

            const assessmentData = await getCurrentOrganizationAssessments();
            const nextAssessmentId =
                preferredAssessmentId ||
                selectedAssessmentId ||
                assessmentData[0]?.id ||
                "";

            setAssessments(assessmentData);
            setSelectedAssessmentId(nextAssessmentId);
            setEvaluation(loadStoredEvaluation(nextAssessmentId));
            setStatus("ready");
        } catch (error) {
            console.error(error);
            setMessage(getErrorMessage(error));
            setStatus("error");
        }
    }

    useEffect(() => {
        const timeoutId = window.setTimeout(() => {
            void loadAssessments();
        }, 0);

        return () => window.clearTimeout(timeoutId);
        // Initial load only. Subsequent refreshes are triggered by form actions.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function handleAssessmentChange(assessmentId: string) {
        setSelectedAssessmentId(assessmentId);
        setEvaluation(loadStoredEvaluation(assessmentId));
        setSaveMessage("");
        setSaveStatus("idle");
    }

    async function handleCreate(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const form = event.currentTarget;
        const formData = new FormData(form);
        const name = String(formData.get("name") ?? "").trim();

        if (!name) return;

        try {
            setCreating(true);
            setMessage("");
            const assessment = await createAssessmentForCurrentOrganization(name);
            form.reset();
            await loadAssessments(assessment.id);
        } catch (error) {
            console.error(error);
            setMessage(getErrorMessage(error));
            setStatus("error");
        } finally {
            setCreating(false);
        }
    }

    function updateEvaluation(nextEvaluation: StoredEvaluation) {
        setEvaluation(nextEvaluation);
        setSaveStatus("idle");
        setSaveMessage("");
    }

    function updateProfileValue(fieldId: string, value: string | string[]) {
        updateEvaluation({
            ...evaluation,
            profile: {
                ...evaluation.profile,
                [fieldId]: value,
            },
        });
    }

    function updateAnswer(questionId: string, answer: EvaluationAnswer) {
        updateEvaluation({
            ...evaluation,
            answers: {
                ...evaluation.answers,
                [questionId]: answer,
            },
        });
    }

    function updateComment(questionId: string, comment: string) {
        updateEvaluation({
            ...evaluation,
            comments: {
                ...evaluation.comments,
                [questionId]: comment,
            },
        });
    }

    function handleSaveEvaluation(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!selectedAssessmentId) return;

        try {
            setSaveStatus("saving");
            saveStoredEvaluation(selectedAssessmentId, evaluation);
            setSaveStatus("success");
            setSaveMessage("Evaluation saved. The compliance score has been updated.");
        } catch (error) {
            console.error(error);
            setSaveStatus("error");
            setSaveMessage(getErrorMessage(error));
        }
    }

    const selectedAssessment = assessments.find(
        (assessment) => assessment.id === selectedAssessmentId
    );
    const score = useMemo(
        () => calculateEvaluationScore(evaluation.answers),
        [evaluation.answers]
    );
    const activeCategoryIndex = categories.findIndex(
        (category) => category.id === activeCategory
    );
    const currentCategory = categories[activeCategoryIndex] ?? categories[0];
    const activeSection = currentCategory.sectionId
        ? evaluationSections.find((section) => section.id === currentCategory.sectionId)
        : null;
    const categoryProgress = useMemo(() => {
        return categories.reduce<Record<EvaluationCategory, { answered: number; total: number }>>(
            (accumulator, category) => {
                if (category.id === "company_profile") {
                    const answered = companyProfileFields.filter((field) => {
                        const value = evaluation.profile[field.id];

                        return Array.isArray(value) ? value.length > 0 : Boolean(value);
                    }).length;

                    accumulator[category.id] = {
                        answered,
                        total: companyProfileFields.length,
                    };
                    return accumulator;
                }

                const section = evaluationSections.find(
                    (sectionItem) => sectionItem.id === category.sectionId
                );
                const questions = section?.questions ?? [];

                accumulator[category.id] = {
                    answered: questions.filter((question) => evaluation.answers[question.id])
                        .length,
                    total: questions.length,
                };

                return accumulator;
            },
            {} as Record<EvaluationCategory, { answered: number; total: number }>
        );
    }, [evaluation.answers, evaluation.profile]);

    function goToPreviousCategory() {
        setActiveCategory(categories[Math.max(activeCategoryIndex - 1, 0)].id);
    }

    function goToNextCategory() {
        setActiveCategory(
            categories[Math.min(activeCategoryIndex + 1, categories.length - 1)].id
        );
    }

    return (
        <main className="app-main assessments-page">
            <AppTopbar
                title="Assessments"
                description="Run readiness reviews, answer questions, and track gaps."
            />

            {status === "loading" && <AppLoadingState title="Loading assessments" />}

            {status === "error" && (
                <AppErrorState title="Could not load assessments" message={message} />
            )}

            {status === "ready" && (
                <>
                    <section className="app-page-grid two">
                        <article className="app-card assessment-highlight">
                            <h2>
                                {selectedAssessment
                                    ? selectedAssessment.name
                                    : "Assessment progress"}
                            </h2>
                            <p>
                                {score.answeredCount} of {score.totalQuestions} scored
                                questions answered.
                            </p>
                            <div className="assessment-progress">
                                <span
                                    style={{
                                        width: `${
                                            (score.answeredCount / score.totalQuestions) * 100
                                        }%`,
                                    }}
                                ></span>
                            </div>
                            <p className="app-muted-text">
                                {score.readinessLevel}: {score.interpretation}
                            </p>
                        </article>

                        <article className="app-card">
                            <h2>Compliance score</h2>
                            <strong className="assessment-score">
                                {score.percentage}%
                            </strong>
                            <p>
                                Weighted score based on answered applicable ISO 27001
                                questions.
                            </p>
                        </article>
                    </section>

                    {assessments.length > 0 && (
                        <section className="app-card app-table-card assessment-form-card">
                            <div className="app-card-header">
                                <div>
                                    <h2>ISO 27001 compliance evaluation</h2>
                                    <p className="app-muted-text">
                                        Complete one category at a time. Your progress and score
                                        update as answers are added.
                                    </p>
                                </div>
                            </div>

                            <label className="assessment-select-label">
                                Assessment
                                <select
                                    value={selectedAssessmentId}
                                    onChange={(event) =>
                                        handleAssessmentChange(event.target.value)
                                    }
                                >
                                    {assessments.map((assessment) => (
                                        <option key={assessment.id} value={assessment.id}>
                                            {assessment.name}
                                        </option>
                                    ))}
                                </select>
                            </label>

                            <form
                                className="assessment-question-form"
                                onSubmit={handleSaveEvaluation}
                            >
                                <nav
                                    className="assessment-category-nav"
                                    aria-label="Assessment categories"
                                >
                                    {categories.map((category) => {
                                        const progress = categoryProgress[category.id];
                                        const isActive = category.id === activeCategory;

                                        return (
                                            <button
                                                type="button"
                                                key={category.id}
                                                className={isActive ? "active" : ""}
                                                onClick={() => setActiveCategory(category.id)}
                                            >
                                                <span>{category.chapter}</span>
                                                <strong>{category.label}</strong>
                                                <small>
                                                    {progress?.answered ?? 0}/{progress?.total ?? 0}
                                                </small>
                                            </button>
                                        );
                                    })}
                                </nav>

                                <section className="assessment-section">
                                    {currentCategory.id === "company_profile" ? (
                                        <>
                                            <div className="assessment-section-header">
                                                <span>Category {activeCategoryIndex + 1} of {categories.length}</span>
                                                <h3>Company profile</h3>
                                                <p>
                                                    These fields are not scored. They provide context for
                                                    scope, recommendations, and reporting.
                                                </p>
                                            </div>

                                            <div className="assessment-profile-grid">
                                                {companyProfileFields.map((field) => (
                                                    <label
                                                        className="assessment-field-label"
                                                        key={field.id}
                                                    >
                                                        <span>
                                                            {field.id}. {field.label}
                                                        </span>
                                                        {renderProfileInput(
                                                            field,
                                                            evaluation.profile[field.id],
                                                            (value) =>
                                                                updateProfileValue(field.id, value)
                                                        )}
                                                    </label>
                                                ))}
                                            </div>
                                        </>
                                    ) : activeSection ? (
                                        <>
                                        <div className="assessment-section-header">
                                            <span>
                                                Category {activeCategoryIndex + 1} of{" "}
                                                {categories.length} · {activeSection.group}
                                            </span>
                                            <h3>{activeSection.title}</h3>
                                        </div>

                                        {activeSection.questions.map((question) => (
                                            <article
                                                className="assessment-question-card"
                                                key={question.id}
                                            >
                                                <div className="assessment-question-copy">
                                                    <span>
                                                        {question.id} · Weight {question.weight} ·{" "}
                                                        {question.mapping}
                                                    </span>
                                                    <h3>{question.question}</h3>
                                                    <p>Example evidence: {question.evidence}</p>
                                                </div>

                                                <div className="assessment-answer-guide">
                                                    {(Object.keys(answerLabels) as EvaluationAnswer[]).map(
                                                        (answer) => (
                                                            <div key={answer}>
                                                                <strong>{answerLabels[answer]}</strong>
                                                                <span>{answerDescriptions[answer]}</span>
                                                            </div>
                                                        )
                                                    )}
                                                </div>

                                                <div className="assessment-answer-grid">
                                                    {(
                                                        Object.keys(answerLabels) as EvaluationAnswer[]
                                                    ).map((answer) => (
                                                        <label key={answer}>
                                                            <input
                                                                type="radio"
                                                                name={`answer-${question.id}`}
                                                                value={answer}
                                                                checked={
                                                                    evaluation.answers[question.id] ===
                                                                    answer
                                                                }
                                                                onChange={() =>
                                                                    updateAnswer(question.id, answer)
                                                                }
                                                            />
                                                            <span>{answerLabels[answer]}</span>
                                                        </label>
                                                    ))}
                                                </div>

                                                <label className="assessment-comment-label">
                                                    Comment or evidence notes
                                                    <textarea
                                                        value={evaluation.comments[question.id] ?? ""}
                                                        placeholder="Add context, evidence notes, or remediation details"
                                                        onChange={(event) =>
                                                            updateComment(
                                                                question.id,
                                                                event.target.value
                                                            )
                                                        }
                                                    />
                                                </label>
                                            </article>
                                        ))}
                                        </>
                                    ) : null}
                                </section>

                                <div className="assessment-form-actions">
                                    <button
                                        type="button"
                                        className="assessment-secondary-button"
                                        onClick={goToPreviousCategory}
                                        disabled={activeCategoryIndex === 0}
                                    >
                                        Previous
                                    </button>
                                    <button
                                        type="button"
                                        className="assessment-secondary-button"
                                        onClick={goToNextCategory}
                                        disabled={activeCategoryIndex === categories.length - 1}
                                    >
                                        Next
                                    </button>
                                    <button type="submit" disabled={saveStatus === "saving"}>
                                        {saveStatus === "saving"
                                            ? "Saving..."
                                            : "Save evaluation"}
                                    </button>

                                    {saveMessage && (
                                        <p
                                            className={`assessment-save-message ${
                                                saveStatus === "error" ? "error" : ""
                                            }`}
                                        >
                                            {saveMessage}
                                        </p>
                                    )}
                                </div>
                            </form>
                        </section>
                    )}

                    <section className="app-card app-table-card">
                        <div className="app-card-header">
                            <div>
                                <h2>New assessment</h2>
                                <p className="app-muted-text">
                                    Create an assessment for the current organization.
                                </p>
                            </div>
                        </div>
                        <form className="settings-form" onSubmit={handleCreate}>
                            <label>
                                Assessment name
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Enter assessment name"
                                    required
                                />
                            </label>
                            <button type="submit" disabled={creating}>
                                {creating ? "Creating..." : "Create assessment"}
                            </button>
                        </form>
                    </section>

                    {!assessments.length ? (
                        <AppEmptyState
                            title="No assessments"
                            message="Create an assessment to start the ISO 27001 evaluation."
                        />
                    ) : (
                        <section className="app-card app-table-card">
                            <div className="app-card-header">
                                <h2>Assessments</h2>
                            </div>

                            <table className="app-table">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Status</th>
                                        <th>Created</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {assessments.map((assessment) => (
                                        <tr key={assessment.id}>
                                            <td>{assessment.name}</td>
                                            <td>
                                                <span
                                                    className={`app-pill ${statusPill(
                                                        assessment.status
                                                    )}`}
                                                >
                                                    {assessment.status.replace("_", " ")}
                                                </span>
                                            </td>
                                            <td>{formatDate(assessment.createdAt)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </section>
                    )}
                </>
            )}
        </main>
    );
}
