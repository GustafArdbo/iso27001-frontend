import AppTopbar from "@/components/AppTopbar";

export default function RisksPage() {
  return (
    <main className="app-main risks-page">
      <AppTopbar title="Risks" description="Track open risks, impact, likelihood, owners, and treatment status." />
      <section className="app-page-grid">
        <article className="app-card risk-card high-risk"><strong>7</strong><span>High risks</span></article>
        <article className="app-card risk-card medium-risk"><strong>12</strong><span>Medium risks</span></article>
        <article className="app-card risk-card low-risk"><strong>5</strong><span>Low risks</span></article>
      </section>
      <section className="app-card app-table-card">
        <div className="app-card-header"><h2>Risk register</h2><a href="#" className="app-action">Add risk</a></div>
        <table className="app-table"><thead><tr><th>Risk</th><th>Owner</th><th>Severity</th><th>Treatment</th></tr></thead><tbody>
          <tr><td>Weak access review process</td><td>Operations</td><td><span className="app-pill error">High</span></td><td>Mitigate</td></tr>
          <tr><td>Incomplete asset ownership</td><td>IT Manager</td><td><span className="app-pill warning">Medium</span></td><td>Reduce</td></tr>
        </tbody></table>
      </section>
    </main>
  );
}
