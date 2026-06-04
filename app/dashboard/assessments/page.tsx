import AppTopbar from "@/components/AppTopbar";

export default function AssessmentsPage() {
    return (
        <main className="app-main assessments-page">
            <AppTopbar
                title="Assessments"
                description="Run readiness reviews, answer questions, and track gaps."
            />

            <section className="app-page-grid two">
                <article className="app-card assessment-highlight">
                    <h2>Initial ISO 27001 readiness review</h2>
                    <p>42 of 54 questions completed.</p>

                    <div className="assessment-progress">
                        <span style={{ width: "78%" }}></span>
                    </div>
                </article>

                <article className="app-card">
                    <h2>Gap score</h2>
                    <strong className="assessment-score">78%</strong>
                    <p>Your current readiness score based on completed answers.</p>
                </article>
            </section>

            <section className="app-card app-table-card">
                <div className="app-card-header">
                    <h2>Recent assessments</h2>
                    <span className="app-action">New assessment</span>
                </div>

                <table className="app-table">
                    <thead>
                    <tr>
                        <th>Name</th>
                        <th>Framework</th>
                        <th>Status</th>
                        <th>Progress</th>
                    </tr>
                    </thead>

                    <tbody>
                    <tr>
                        <td>Initial readiness review</td>
                        <td>ISO 27001</td>
                        <td>
                            <span className="app-pill warning">In progress</span>
                        </td>
                        <td>78%</td>
                    </tr>

                    <tr>
                        <td>Access control review</td>
                        <td>ISO 27001</td>
                        <td>
                            <span className="app-pill good">Completed</span>
                        </td>
                        <td>100%</td>
                    </tr>
                    </tbody>
                </table>
            </section>
        </main>
    );
}
