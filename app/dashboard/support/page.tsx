"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import AppTopbar from "@/components/AppTopbar";
import { useDashboardContext } from "@/components/DashboardContext";

const supportEmail = "hello@complypilot.com";

export default function SupportPage() {
    const { user, organizationName, organizationId } = useDashboardContext();
    const [category, setCategory] = useState("Workspace access");
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");

    const mailtoHref = useMemo(() => {
        const email = user?.email ?? "";
        const body = [
            message,
            "",
            "---",
            `Category: ${category}`,
            `Workspace: ${organizationName ?? "Unknown"}`,
            `Organization ID: ${organizationId || "Unknown"}`,
            `Contact email: ${email || "Not available"}`,
        ].join("\n");

        const params = new URLSearchParams({
            subject: subject.trim() || `ComplyPilot support: ${category}`,
            body,
        });

        return `mailto:${supportEmail}?${params.toString()}`;
    }, [category, message, organizationId, organizationName, subject, user?.email]);

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        window.location.href = mailtoHref;
    }

    return (
        <main className="app-main support-page">
            <AppTopbar
                title="Support"
                description="Contact ComplyPilot support for help with your workspace, access, or ISO 27001 setup."
            />

            <section className="app-card support-contact-card">
                <div className="app-card-header">
                    <div>
                        <h2>Contact support</h2>
                        <p>
                            Describe your issue and we will prepare an email to the
                            support team.
                        </p>
                    </div>
                </div>

                <form className="support-form" onSubmit={handleSubmit}>
                    <label>
                        Support category
                        <select
                            value={category}
                            onChange={(event) => setCategory(event.target.value)}
                        >
                            <option>Workspace access</option>
                            <option>ISO 27001 assessment</option>
                            <option>Reports</option>
                            <option>Billing</option>
                            <option>Technical issue</option>
                            <option>Other</option>
                        </select>
                    </label>

                    <label>
                        Subject
                        <input
                            type="text"
                            value={subject}
                            placeholder="Short summary of the issue"
                            onChange={(event) => setSubject(event.target.value)}
                        />
                    </label>

                    <label>
                        Message
                        <textarea
                            value={message}
                            placeholder="Tell us what happened and what you need help with."
                            onChange={(event) => setMessage(event.target.value)}
                            required
                        />
                    </label>

                    <div className="support-actions">
                        <button type="submit">Open email</button>
                        <Link href="/dashboard/settings">Back to settings</Link>
                    </div>
                </form>
            </section>
        </main>
    );
}
