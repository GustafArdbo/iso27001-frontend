"use client";

import { useEffect, useMemo, useState } from "react";
import AppTopbar from "@/components/AppTopbar";
import {
    AppEmptyState,
    AppErrorState,
    AppLoadingState,
} from "@/components/AppDataState";
import { getRisks, type Risk } from "@/lib/risks";

type PageStatus = "loading" | "ready" | "error";

function getErrorMessage(error: unknown) {
    return error instanceof Error ? error.message : "Could not load risks.";
}

function severityPill(severity: Risk["severity"]) {
    if (severity === "High") return "error";
    if (severity === "Medium") return "warning";
    return "good";
}

export default function RisksPage() {
    const [status, setStatus] = useState<PageStatus>("loading");
    const [message, setMessage] = useState("");
    const [risks, setRisks] = useState<Risk[]>([]);

    useEffect(() => {
        let active = true;

        async function loadRisks() {
            try {
                setStatus("loading");
                setMessage("");
                const riskData = await getRisks();

                if (!active) return;

                setRisks(riskData);
                setStatus("ready");
            } catch (error) {
                if (!active) return;

                console.error(error);
                setMessage(getErrorMessage(error));
                setStatus("error");
            }
        }

        loadRisks();

        return () => {
            active = false;
        };
    }, []);

    const counts = useMemo(
        () =>
            risks.reduce(
                (accumulator, risk) => {
                    accumulator[risk.severity] += 1;
                    return accumulator;
                },
                { High: 0, Medium: 0, Low: 0 }
            ),
        [risks]
    );

    return (
        <main className="app-main risks-page">
            <AppTopbar
                title="Risks"
                description="Track open risks, impact, likelihood, owners, and treatment status."
            />

            {status === "loading" && <AppLoadingState title="Loading risks" />}

            {status === "error" && (
                <AppErrorState title="Could not load risks" message={message} />
            )}

            {status === "ready" && !risks.length && (
                <AppEmptyState
                    title="No open risks"
                    message="Risks appear when assessment answers identify control gaps."
                />
            )}

            {status === "ready" && risks.length > 0 && (
                <>
                    <section className="app-page-grid">
                        <article className="app-card risk-card high-risk">
                            <strong>{counts.High}</strong>
                            <span>High risks</span>
                        </article>
                        <article className="app-card risk-card medium-risk">
                            <strong>{counts.Medium}</strong>
                            <span>Medium risks</span>
                        </article>
                        <article className="app-card risk-card low-risk">
                            <strong>{counts.Low}</strong>
                            <span>Low risks</span>
                        </article>
                    </section>
                    <section className="app-card app-table-card">
                        <div className="app-card-header">
                            <h2>Risk register</h2>
                        </div>
                        <table className="app-table">
                            <thead>
                                <tr>
                                    <th>Risk</th>
                                    <th>Owner</th>
                                    <th>Severity</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {risks.map((risk) => (
                                    <tr key={risk.id}>
                                        <td>{risk.title}</td>
                                        <td>{risk.owner}</td>
                                        <td>
                                            <span className={`app-pill ${severityPill(risk.severity)}`}>
                                                {risk.severity}
                                            </span>
                                        </td>
                                        <td>{risk.status}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </section>
                </>
            )}
        </main>
    );
}
