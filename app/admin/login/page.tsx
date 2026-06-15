"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithPassword } from "@/lib/auth";

export default function AdminLoginPage() {
    const router = useRouter();
    const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
    const [message, setMessage] = useState("");

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);

        try {
            setStatus("loading");
            setMessage("");

            await signInWithPassword({
                email: String(formData.get("email") ?? ""),
                password: String(formData.get("password") ?? ""),
            });

            router.push("/admin/onboarding");
        } catch (error) {
            console.error(error);
            setStatus("error");
            setMessage(
                error instanceof Error
                    ? error.message
                    : "Could not log in. Check Supabase credentials and backend API access."
            );
        }
    }

    return (
        <main className="admin-page admin-login-page">
            <section className="admin-shell admin-login-shell">
                <header className="admin-login-header">
                    <Link href="/" className="admin-logo" aria-label="ComplyPilot home">
                        <Image
                            src="/assets/complypilot-logo.png"
                            alt="ComplyPilot logo"
                            width={338}
                            height={103}
                            priority
                        />
                    </Link>

                    <Link href="/" className="admin-back-link">
                        Back to website
                    </Link>
                </header>

                <section className="admin-login-card">
                    <div className="admin-login-copy">
                        <p className="admin-eyebrow">Platform admin</p>
                        <h1>Review onboarding requests.</h1>
                        <p>
                            Sign in with a platform admin account to approve customer
                            applications, create owner access, and resend invitation links.
                        </p>
                    </div>

                    <form className="admin-login-form" onSubmit={handleSubmit}>
                        <label>
                            Email
                            <input
                                type="email"
                                name="email"
                                placeholder="admin@complypilot.se"
                                autoComplete="email"
                                required
                            />
                        </label>

                        <label>
                            Password
                            <input
                                type="password"
                                name="password"
                                placeholder="Enter your password"
                                autoComplete="current-password"
                                required
                            />
                        </label>

                        <button type="submit" disabled={status === "loading"}>
                            {status === "loading" ? "Logging in..." : "Log in"}
                        </button>

                        {message && (
                            <p className="admin-feedback" role="status">
                                {message}
                            </p>
                        )}
                    </form>
                </section>
            </section>
        </main>
    );
}
