"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
    approveOrganizationApplication,
    listOrganizationApplications,
    rejectOrganizationApplication,
    resendOwnerInvitation,
    type ApplicationStatus,
    type OrganizationApplicationResponse,
    type OwnerInvitationStatus,
    type RequestedMaterial,
} from "@/lib/organizationApplications";
import { logout } from "@/lib/auth";
import { createClient } from "@/lib/supabase/client";

type PageStatus = "loading" | "ready" | "error" | "unauthorized";

const materialLabels: Record<RequestedMaterial, string> = {
    "standard-forms": "Readiness intake",
    checklist: "Preparation checklist",
    "gap-analysis": "Gap analysis",
};

const applicationPillClass: Record<ApplicationStatus, string> = {
    SUBMITTED: "warning",
    APPROVED: "good",
    REJECTED: "error",
};

const invitationPillClass: Record<OwnerInvitationStatus, string> = {
    NOT_SENT: "neutral",
    SENT: "info",
    FAILED: "error",
    ACCEPTED: "good",
};

function formatDate(value: string | null) {
    if (!value) {
        return "Not set";
    }

    return new Intl.DateTimeFormat("en", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(new Date(value));
}

export default function AdminOnboardingPage() {
    const router = useRouter();
    const [status, setStatus] = useState<PageStatus>("loading");
    const [applications, setApplications] = useState<
        OrganizationApplicationResponse[]
    >([]);
    const [adminEmail, setAdminEmail] = useState("");
    const [message, setMessage] = useState("");
    const [activeAction, setActiveAction] = useState("");
    const [rejectReasons, setRejectReasons] = useState<Record<string, string>>({});

    const counts = useMemo(
        () => ({
            submitted: applications.filter(
                (application) => application.applicationStatus === "SUBMITTED"
            ).length,
            approved: applications.filter(
                (application) => application.applicationStatus === "APPROVED"
            ).length,
            rejected: applications.filter(
                (application) => application.applicationStatus === "REJECTED"
            ).length,
        }),
        [applications]
    );

    const loadApplications = useCallback(async () => {
        try {
            setStatus("loading");
            setMessage("");

            const supabase = createClient();
            const {
                data: { session },
            } = await supabase.auth.getSession();

            if (!session) {
                setStatus("unauthorized");
                setMessage("No Supabase session was found. Please log in again.");
                return;
            }

            setAdminEmail(session.user.email ?? "Platform admin");
            setApplications(await listOrganizationApplications());
            setStatus("ready");
        } catch (error) {
            console.error(error);
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : "Could not load onboarding requests.";

            if (
                errorMessage.includes("No Supabase session") ||
                errorMessage.includes("API request failed: 401")
            ) {
                setStatus("unauthorized");
                setMessage(errorMessage);
                return;
            }

            setStatus("error");
            setMessage(errorMessage);
        }
    }, []);

    useEffect(() => {
        const timeoutId = window.setTimeout(() => {
            loadApplications();
        }, 0);

        return () => {
            window.clearTimeout(timeoutId);
        };
    }, [loadApplications]);

    function updateApplication(updated: OrganizationApplicationResponse) {
        setApplications((current) =>
            current.map((application) =>
                application.id === updated.id ? updated : application
            )
        );
    }

    async function handleApprove(id: string) {
        try {
            setActiveAction(`${id}:approve`);
            setMessage("");

            updateApplication(await approveOrganizationApplication(id));
            setMessage("Application approved. Owner invitation has been triggered.");
        } catch (error) {
            console.error(error);
            setMessage(
                error instanceof Error ? error.message : "Could not approve application."
            );
        } finally {
            setActiveAction("");
        }
    }

    async function handleReject(id: string) {
        const reason = rejectReasons[id]?.trim();

        if (!reason) {
            setMessage("Add a rejection reason before rejecting the application.");
            return;
        }

        try {
            setActiveAction(`${id}:reject`);
            setMessage("");

            updateApplication(
                await rejectOrganizationApplication(id, {
                    reason,
                })
            );
            setMessage("Application rejected.");
        } catch (error) {
            console.error(error);
            setMessage(
                error instanceof Error ? error.message : "Could not reject application."
            );
        } finally {
            setActiveAction("");
        }
    }

    async function handleResendInvitation(id: string) {
        try {
            setActiveAction(`${id}:resend`);
            setMessage("");

            updateApplication(await resendOwnerInvitation(id));
            setMessage("Owner invitation resent.");
        } catch (error) {
            console.error(error);
            setMessage(
                error instanceof Error ? error.message : "Could not resend invitation."
            );
        } finally {
            setActiveAction("");
        }
    }

    async function handleLogout() {
        await logout();
        router.push("/admin/login");
    }

    return (
        <main className="admin-page">
            <section className="admin-shell">
                <header className="admin-topbar">
                    <Link href="/" className="admin-logo" aria-label="ComplyPilot home">
                        <Image
                            src="/assets/complypilot-logo.png"
                            alt="ComplyPilot logo"
                            width={338}
                            height={103}
                            priority
                        />
                    </Link>

                    <div className="admin-topbar-actions">
                        <span>{adminEmail || "Platform admin"}</span>
                        <button type="button" onClick={handleLogout}>
                            Log out
                        </button>
                    </div>
                </header>

                <section className="admin-hero">
                    <div>
                        <p className="admin-eyebrow">Onboarding flow</p>
                        <h1>Customer application review.</h1>
                        <p>
                            Review submitted applications, approve owner access, reject
                            requests that are not ready, and resend owner invitations.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="admin-secondary-button"
                        onClick={loadApplications}
                        disabled={status === "loading"}
                    >
                        {status === "loading" ? "Refreshing..." : "Refresh"}
                    </button>
                </section>

                <nav className="admin-tabs" aria-label="Admin sections">
                    <Link href="/admin/onboarding" className="active">
                        Onboarding requests
                    </Link>
                    <Link href="/admin/support">Support tickets</Link>
                </nav>

                <section className="admin-stats" aria-label="Application summary">
                    <article>
                        <span>Submitted</span>
                        <strong>{counts.submitted}</strong>
                    </article>
                    <article>
                        <span>Approved</span>
                        <strong>{counts.approved}</strong>
                    </article>
                    <article>
                        <span>Rejected</span>
                        <strong>{counts.rejected}</strong>
                    </article>
                </section>

                {message && (
                    <p className="admin-status-message" role="status">
                        {message}
                    </p>
                )}

                {status === "unauthorized" && (
                    <section className="admin-empty-state">
                        <h2>Platform admin access required</h2>
                        <p>
                            Use an account listed in PLATFORM_ADMIN_USER_IDS to review
                            organization applications.
                        </p>
                        <Link href="/admin/login" className="admin-primary-link">
                            Back to admin login
                        </Link>
                    </section>
                )}

                {status === "error" && (
                    <section className="admin-empty-state">
                        <h2>Could not load applications</h2>
                        <p>{message}</p>
                        <button type="button" onClick={loadApplications}>
                            Try again
                        </button>
                    </section>
                )}

                {status === "loading" && (
                    <section className="admin-empty-state">
                        <h2>Loading applications</h2>
                        <p>Checking your admin session and fetching onboarding requests.</p>
                    </section>
                )}

                {status === "ready" && applications.length === 0 && (
                    <section className="admin-empty-state">
                        <h2>No applications yet</h2>
                        <p>New requests from the public form will appear here.</p>
                    </section>
                )}

                {status === "ready" && applications.length > 0 && (
                    <section className="admin-application-list">
                        {applications.map((application) => {
                            const canApprove =
                                application.applicationStatus !== "REJECTED";
                            const canReject =
                                application.applicationStatus !== "APPROVED";
                            const canResend =
                                application.applicationStatus === "APPROVED" &&
                                application.invitationStatus !== "ACCEPTED";

                            return (
                                <article
                                    className="admin-application-card"
                                    key={application.id}
                                >
                                    <div className="admin-application-main">
                                        <div>
                                            <p className="admin-card-kicker">
                                                {formatDate(application.createdAt)}
                                            </p>
                                            <h2>{application.company}</h2>
                                            <p>
                                                {application.ownerName} -{" "}
                                                <a href={`mailto:${application.ownerEmail}`}>
                                                    {application.ownerEmail}
                                                </a>
                                            </p>
                                        </div>

                                        <div className="admin-pill-row">
                                            <span
                                                className={`admin-pill ${applicationPillClass[application.applicationStatus]}`}
                                            >
                                                {application.applicationStatus}
                                            </span>
                                            <span
                                                className={`admin-pill ${invitationPillClass[application.invitationStatus]}`}
                                            >
                                                {application.invitationStatus}
                                            </span>
                                        </div>
                                    </div>

                                    <dl className="admin-application-details">
                                        <div>
                                            <dt>Country</dt>
                                            <dd>{application.country}</dd>
                                        </div>
                                        <div>
                                            <dt>Phone</dt>
                                            <dd>{application.phone || "Not provided"}</dd>
                                        </div>
                                        <div>
                                            <dt>Size</dt>
                                            <dd>{application.size}</dd>
                                        </div>
                                        <div>
                                            <dt>Approved at</dt>
                                            <dd>{formatDate(application.approvedAt)}</dd>
                                        </div>
                                    </dl>

                                    <div className="admin-materials">
                                        {application.materials.map((material) => (
                                            <span key={material}>
                                                {materialLabels[material] ?? material}
                                            </span>
                                        ))}
                                    </div>

                                    {application.message && (
                                        <p className="admin-application-note">
                                            {application.message}
                                        </p>
                                    )}

                                    {application.invitationFailureReason && (
                                        <p className="admin-application-warning">
                                            {application.invitationFailureReason}
                                        </p>
                                    )}

                                    {canReject && (
                                        <label className="admin-reject-reason">
                                            Rejection reason
                                            <textarea
                                                value={rejectReasons[application.id] ?? ""}
                                                onChange={(event) =>
                                                    setRejectReasons((current) => ({
                                                        ...current,
                                                        [application.id]: event.target.value,
                                                    }))
                                                }
                                                placeholder="Reason shown in the admin record"
                                                maxLength={2000}
                                            />
                                        </label>
                                    )}

                                    <div className="admin-card-actions">
                                        <button
                                            type="button"
                                            onClick={() => handleApprove(application.id)}
                                            disabled={
                                                !canApprove ||
                                                activeAction === `${application.id}:approve`
                                            }
                                        >
                                            {activeAction === `${application.id}:approve`
                                                ? "Approving..."
                                                : "Approve"}
                                        </button>

                                        <button
                                            type="button"
                                            className="admin-danger-button"
                                            onClick={() => handleReject(application.id)}
                                            disabled={
                                                !canReject ||
                                                activeAction === `${application.id}:reject`
                                            }
                                        >
                                            {activeAction === `${application.id}:reject`
                                                ? "Rejecting..."
                                                : "Reject"}
                                        </button>

                                        <button
                                            type="button"
                                            className="admin-secondary-button"
                                            onClick={() =>
                                                handleResendInvitation(application.id)
                                            }
                                            disabled={
                                                !canResend ||
                                                activeAction === `${application.id}:resend`
                                            }
                                        >
                                            {activeAction === `${application.id}:resend`
                                                ? "Sending..."
                                                : "Resend invite"}
                                        </button>
                                    </div>
                                </article>
                            );
                        })}
                    </section>
                )}
            </section>
        </main>
    );
}
