"use client";

import { FormEvent, useState } from "react";
import { createInvitation, type TeamRole } from "@/lib/team";

type Status = "idle" | "loading" | "success" | "error";

export default function InviteMemberForm() {
    const [status, setStatus] = useState<Status>("idle");
    const [message, setMessage] = useState("");

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const form = event.currentTarget;
        const formData = new FormData(form);

        const payload = {
            email: String(formData.get("email") ?? ""),
            name: String(formData.get("name") ?? ""),
            role: String(formData.get("role") ?? "MEMBER") as Exclude<
                TeamRole,
                "OWNER"
            >,
        };

        try {
            setStatus("loading");
            setMessage("");

            await createInvitation(payload);

            setStatus("success");
            setMessage("Invitation sent successfully.");
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
            <div className="row">
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
                    Name
                    <input type="text" name="name" placeholder="Jane Doe" />
                </label>
            </div>

            <label>
                Role
                <select name="role" defaultValue="MEMBER">
                    <option value="ADMIN">Admin</option>
                    <option value="MEMBER">Member</option>
                    <option value="VIEWER">Viewer</option>
                </select>
            </label>

            <div className="actions">
                <button type="submit" disabled={status === "loading"}>
                    {status === "loading" ? "Sending..." : "Send invitation"}
                </button>
            </div>

            {message && (
                <p className={`feedback ${status === "error" ? "error" : ""}`}>
                    {message}
                </p>
            )}
        </form>
    );
}