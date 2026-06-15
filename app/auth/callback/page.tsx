"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import MarketingHeader from "@/components/MarketingHeader";
import { getCurrentAuthUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/client";

export default function AuthCallbackPage() {
    const router = useRouter();
    const [message, setMessage] = useState("Signing you in...");

    useEffect(() => {
        let isMounted = true;

        async function finishSignIn() {
            try {
                const supabase = createClient();
                const searchParams = new URLSearchParams(window.location.search);
                const code = searchParams.get("code");

                if (code) {
                    const { error } = await supabase.auth.exchangeCodeForSession(code);

                    if (error) {
                        throw new Error(error.message);
                    }
                }

                await getCurrentAuthUser();

                if (isMounted) {
                    router.replace("/dashboard");
                }
            } catch (error) {
                console.error(error);

                if (isMounted) {
                    setMessage(
                        error instanceof Error
                            ? error.message
                            : "Could not complete sign in."
                    );
                }
            }
        }

        finishSignIn();

        return () => {
            isMounted = false;
        };
    }, [router]);

    return (
        <main className="landing-page">
            <MarketingHeader activePage="login" />
            <section className="landing-container subpage">
                <section className="login-card">
                    <div className="login-copy">
                        <div className="compliance-pill">ComplyPilot account</div>
                        <h1>Log in to your workspace.</h1>
                        <p>{message}</p>
                    </div>
                </section>
            </section>
        </main>
    );
}
