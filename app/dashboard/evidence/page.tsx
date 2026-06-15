"use client";

import { useEffect, useMemo, useState } from "react";
import AppTopbar from "@/components/AppTopbar";
import {
    AppEmptyState,
    AppErrorState,
    AppLoadingState,
} from "@/components/AppDataState";
import { getEvidence, type EvidenceItem } from "@/lib/evidence";

type PageStatus = "loading" | "ready" | "error";

function getErrorMessage(error: unknown) {
    return error instanceof Error ? error.message : "Could not load evidence.";
}

function evidencePill(status: EvidenceItem["status"]) {
    if (status === "Uploaded") return "good";
    if (status === "Expiring") return "warning";
    return "error";
}

function formatDate(value: string) {
    return new Intl.DateTimeFormat("en", {
        month: "short",
        day: "numeric",
        year: "numeric",
    }).format(new Date(value));
}

export default function EvidencePage() {
    const [status, setStatus] = useState<PageStatus>("loading");
    const [message, setMessage] = useState("");
    const [evidence, setEvidence] = useState<EvidenceItem[]>([]);

    useEffect(() => {
        let active = true;

        async function loadEvidence() {
            try {
                setStatus("loading");
                setMessage("");
                const evidenceData = await getEvidence();

                if (!active) return;

                setEvidence(evidenceData);
                setStatus("ready");
            } catch (error) {
                if (!active) return;

                console.error(error);
                setMessage(getErrorMessage(error));
                setStatus("error");
            }
        }

        loadEvidence();

        return () => {
            active = false;
        };
    }, []);

    const counts = useMemo(
        () =>
            evidence.reduce(
                (accumulator, item) => {
                    accumulator[item.status] += 1;
                    return accumulator;
                },
                { Uploaded: 0, Missing: 0, Expiring: 0 }
            ),
        [evidence]
    );

    return (
        <main className="app-main evidence-page">
            <AppTopbar
                title="Evidence"
                description="Collect, review, and organize audit evidence for your controls."
            />

            {status === "loading" && <AppLoadingState title="Loading evidence" />}

            {status === "error" && (
                <AppErrorState title="Could not load evidence" message={message} />
            )}

            {status === "ready" && !evidence.length && (
                <AppEmptyState
                    title="No evidence"
                    message="Evidence appears after an assessment has controls to review."
                />
            )}

            {status === "ready" && evidence.length > 0 && (
                <>
                    <section className="app-page-grid">
                        <article className="app-card evidence-stat">
                            <strong>{counts.Uploaded}</strong>
                            <span>Uploaded</span>
                        </article>
                        <article className="app-card evidence-stat">
                            <strong>{counts.Missing}</strong>
                            <span>Missing</span>
                        </article>
                        <article className="app-card evidence-stat">
                            <strong>{counts.Expiring}</strong>
                            <span>Expiring soon</span>
                        </article>
                    </section>
                    <section className="app-card app-table-card">
                        <div className="app-card-header">
                            <h2>Evidence library</h2>
                        </div>
                        <table className="app-table">
                            <thead>
                                <tr>
                                    <th>Evidence</th>
                                    <th>Control</th>
                                    <th>Owner</th>
                                    <th>Status</th>
                                    <th>Updated</th>
                                </tr>
                            </thead>
                            <tbody>
                                {evidence.map((item) => (
                                    <tr key={item.id}>
                                        <td>{item.title}</td>
                                        <td>{item.controlCode}</td>
                                        <td>{item.owner}</td>
                                        <td>
                                            <span className={`app-pill ${evidencePill(item.status)}`}>
                                                {item.status}
                                            </span>
                                        </td>
                                        <td>{formatDate(item.updatedAt)}</td>
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
