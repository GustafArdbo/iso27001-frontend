"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { logout } from "@/lib/auth";
import { createClient } from "@/lib/supabase/client";
import {
    listSupportTickets,
    updateSupportTicketStatus,
    type SupportTicket,
} from "@/lib/supportTickets";

type PageStatus = "loading" | "ready" | "unauthorized";

function formatDate(value: string) {
    return new Intl.DateTimeFormat("en", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(new Date(value));
}

export default function AdminSupportPage() {
    const router = useRouter();
    const [status, setStatus] = useState<PageStatus>("loading");
    const [tickets, setTickets] = useState<SupportTicket[]>([]);
    const [adminEmail, setAdminEmail] = useState("");
    const [message, setMessage] = useState("");

    const counts = useMemo(
        () => ({
            open: tickets.filter((ticket) => ticket.status === "OPEN").length,
            closed: tickets.filter((ticket) => ticket.status === "CLOSED").length,
            total: tickets.length,
        }),
        [tickets]
    );

    function loadTickets() {
        setTickets(listSupportTickets());
    }

    useEffect(() => {
        const timeoutId = window.setTimeout(async () => {
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
            loadTickets();
            setStatus("ready");
        }, 0);

        return () => window.clearTimeout(timeoutId);
    }, []);

    async function handleLogout() {
        await logout();
        router.push("/admin/login");
    }

    function handleStatusToggle(ticket: SupportTicket) {
        updateSupportTicketStatus(
            ticket.id,
            ticket.status === "OPEN" ? "CLOSED" : "OPEN"
        );
        loadTickets();
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
                        <p className="admin-eyebrow">Support queue</p>
                        <h1>Support tickets.</h1>
                        <p>
                            Review support requests submitted from customer workspaces.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="admin-secondary-button"
                        onClick={loadTickets}
                    >
                        Refresh
                    </button>
                </section>

                <nav className="admin-tabs" aria-label="Admin sections">
                    <Link href="/admin/onboarding">Onboarding requests</Link>
                    <Link href="/admin/support" className="active">
                        Support tickets
                    </Link>
                </nav>

                <section className="admin-stats" aria-label="Support summary">
                    <article>
                        <span>Open</span>
                        <strong>{counts.open}</strong>
                    </article>
                    <article>
                        <span>Closed</span>
                        <strong>{counts.closed}</strong>
                    </article>
                    <article>
                        <span>Total</span>
                        <strong>{counts.total}</strong>
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
                        <p>{message}</p>
                        <Link href="/admin/login" className="admin-primary-link">
                            Back to admin login
                        </Link>
                    </section>
                )}

                {status === "loading" && (
                    <section className="admin-empty-state">
                        <h2>Loading support tickets</h2>
                        <p>Checking your admin session and fetching support requests.</p>
                    </section>
                )}

                {status === "ready" && tickets.length === 0 && (
                    <section className="admin-empty-state">
                        <h2>No support tickets yet</h2>
                        <p>Customer support requests will appear here.</p>
                    </section>
                )}

                {status === "ready" && tickets.length > 0 && (
                    <section className="admin-application-list">
                        {tickets.map((ticket) => (
                            <article className="admin-application-card" key={ticket.id}>
                                <div className="admin-application-main">
                                    <div>
                                        <p className="admin-card-kicker">
                                            {formatDate(ticket.createdAt)}
                                        </p>
                                        <h2>{ticket.name}</h2>
                                        <p>
                                            <a href={`mailto:${ticket.email}`}>
                                                {ticket.email}
                                            </a>
                                            {ticket.phone ? ` - ${ticket.phone}` : ""}
                                        </p>
                                    </div>

                                    <div className="admin-pill-row">
                                        <span
                                            className={`admin-pill ${
                                                ticket.status === "OPEN" ? "warning" : "good"
                                            }`}
                                        >
                                            {ticket.status}
                                        </span>
                                    </div>
                                </div>

                                <dl className="admin-application-details">
                                    <div>
                                        <dt>Workspace</dt>
                                        <dd>{ticket.organizationName || "Unknown"}</dd>
                                    </div>
                                    <div>
                                        <dt>Organization ID</dt>
                                        <dd>{ticket.organizationId || "Unknown"}</dd>
                                    </div>
                                    <div>
                                        <dt>Submitted</dt>
                                        <dd>{formatDate(ticket.createdAt)}</dd>
                                    </div>
                                    <div>
                                        <dt>Status</dt>
                                        <dd>{ticket.status}</dd>
                                    </div>
                                </dl>

                                <p className="admin-application-note">{ticket.message}</p>

                                <div className="admin-card-actions">
                                    <a
                                        className="admin-primary-link admin-inline-link"
                                        href={`mailto:${ticket.email}?subject=${encodeURIComponent(
                                            "Re: ComplyPilot support request"
                                        )}`}
                                    >
                                        Reply by email
                                    </a>
                                    <button
                                        type="button"
                                        className="admin-secondary-button"
                                        onClick={() => handleStatusToggle(ticket)}
                                    >
                                        Mark as{" "}
                                        {ticket.status === "OPEN" ? "closed" : "open"}
                                    </button>
                                </div>
                            </article>
                        ))}
                    </section>
                )}
            </section>
        </main>
    );
}
