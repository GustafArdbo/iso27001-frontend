"use client";

import { FormEvent, useState } from "react";
import { createInvitation, type TeamRole } from "@/lib/team";

type Status = "idle" | "loading" | "success" | "error";

type InviteMemberFormProps = {
    organizationId: string;
};

export default function InviteMemberForm({
                                             organizationId,
                                         }: InviteMemberFormProps) {
    const [status, setStatus] = useState<Status>("idle");
    const [message, setMessage] = useState("");
    const [acceptanceToken, setAcceptanceToken] = useState("");

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const form = event.currentTarget;
        const formData = new FormData(form);

        const payload = {
            email: String(formData.get("email") ?? "").trim(),
            role: String(formData.get("role") ?? "MEMBER") as Exclude<
                TeamRole,
                "OWNER"
            >,
        };

        if (!organizationId) {
            setStatus("error");
            setMessage("No organization is loaded yet.");
            return;
        }

        try {
            setStatus("loading");
            setMessage("");
            setAcceptanceToken("");

            const response = await createInvitation(organizationId, payload);

            setStatus("success");
            setMessage("Invitation created successfully.");
            setAcceptanceToken(response.acceptanceToken ?? "");

            form.reset();
        } catch (error) {
            console.error(error);
            setStatus("error");
            setMessage(
                error instanceof Error ? error.message : "Could not send invitation."
            );
        }
    }

    return (
        <form className="team-invite-form" onSubmit={handleSubmit}>
            <label>
                Email
                <input
                    type="email"
                    name="email"
                    placeholder="colleague@company.com"
                    required
                />
            </label>

            <label>
                Role
                <select name="role" defaultValue="MEMBER">
                    <option value="ADMIN">Admin</option>
                    <option value="AUDITOR">Auditor</option>
                    <option value="MEMBER">Member</option>
                    <option value="VIEWER">Viewer</option>
                </select>
            </label>

            <div className="actions">
                <button
                    type="submit"
                    disabled={status === "loading" || !organizationId}
                >
                    {status === "loading" ? "Sending..." : "Send invitation"}
                </button>
            </div>

            {message && (
                <p className={`feedback ${status === "error" ? "error" : ""}`}>
                    {message}
                </p>
            )}

            {acceptanceToken && (
                <p className="feedback">
                    Invitation token: <strong>{acceptanceToken}</strong>
                </p>
            )}
        </form>
    );
}