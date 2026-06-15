import { getControls } from "./controls";
import { getLatestAssessmentSummary } from "./assessments";

export type DashboardSummary = {
    overallCompliance: number;
    controls: {
        implemented: number;
        inProgress: number;
        notStarted: number;
        total: number;
    };
    risks: {
        high: number;
        medium: number;
        low: number;
    };
    evidence: {
        uploaded: number;
        missing: number;
        expiring: number;
    };
};

export async function getDashboardSummary(token?: string): Promise<DashboardSummary> {
    const [controls, assessmentSummary] = await Promise.all([
        getControls(undefined, token),
        getLatestAssessmentSummary(token).catch(() => null),
    ]);

    const answerCounts = assessmentSummary?.answerCounts;
    const implemented = answerCounts?.YES ?? 0;
    const inProgress = answerCounts?.PARTIAL ?? 0;
    const notApplicable = answerCounts?.NOT_APPLICABLE ?? 0;
    const rejected = answerCounts?.NO ?? 0;
    const total = assessmentSummary?.totalControls ?? controls.length;
    const answeredTotal = implemented + inProgress + notApplicable + rejected;
    const notStarted =
        assessmentSummary?.unansweredControls ?? Math.max(total - answeredTotal, 0);

    return {
        overallCompliance: Math.round(assessmentSummary?.scorePercentage ?? 0),
        controls: {
            implemented,
            inProgress,
            notStarted,
            total,
        },
        risks: {
            high: rejected,
            medium: inProgress,
            low: notApplicable,
        },
        evidence: {
            uploaded: implemented,
            missing: rejected + notStarted,
            expiring: inProgress,
        },
    };
}
