"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import MarketingHeader from "@/components/MarketingHeader";
import { signInWithPassword } from "@/lib/auth";

export default function LoginPage() {
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

      router.push("/dashboard");
    } catch (error) {
      console.error(error);
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Could not log in.");
    }
  }

  return (
    <main className="landing-page">
      <MarketingHeader activePage="login" />
      <section className="landing-container subpage">
        <section className="login-card">
          <div className="login-copy"><div className="compliance-pill">ComplyPilot account</div><h1>Log in to your workspace.</h1><p>Access your ISO 27001 readiness dashboard, evidence tasks, control status, and assessment progress.</p></div>
          <form className="login-form" onSubmit={handleSubmit}>
            <label>Email<input type="email" name="email" placeholder="you@company.com" /></label>
            <label>Password<input type="password" name="password" placeholder="Enter your password" /></label>
            <button type="submit" disabled={status === "loading"}>{status === "loading" ? "Logging in..." : "Log in"}</button>
            {message && <p className="login-helper">{message}</p>}
            <p className="login-helper">Donâ€™t have an account yet? <Link href="/form">Book a demo</Link></p>
          </form>
        </section>
      </section>
    </main>
  );
}
