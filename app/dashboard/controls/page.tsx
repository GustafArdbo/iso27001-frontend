import AppTopbar from "@/components/AppTopbar";

export default function ControlsPage() {
  return (
    <main className="app-main controls-page">
      <AppTopbar title="Controls" description="Manage ISO 27001 controls, ownership, status, and implementation progress." />

      <section className="app-page-grid">
        <article className="app-card"><h2>Implemented</h2><strong className="control-number">93</strong><p>Controls with evidence and owner assigned.</p></article>
        <article className="app-card"><h2>In progress</h2><strong className="control-number">24</strong><p>Controls currently being prepared.</p></article>
        <article className="app-card"><h2>Not started</h2><strong className="control-number">12</strong><p>Controls that still need planning.</p></article>
      </section>

      <section className="app-card app-table-card">
        <div className="app-card-header"><h2>Control library</h2><a href="#" className="app-action">Add control</a></div>
        <table className="app-table"><thead><tr><th>Control</th><th>Domain</th><th>Owner</th><th>Status</th><th>Progress</th></tr></thead><tbody>
          <tr><td>A.5 Information security policies</td><td>Governance</td><td>Security Lead</td><td><span className="app-pill good">Implemented</span></td><td>90%</td></tr>
          <tr><td>A.8 Asset management</td><td>Assets</td><td>IT Manager</td><td><span className="app-pill warning">In progress</span></td><td>80%</td></tr>
          <tr><td>A.9 Access control</td><td>Access</td><td>Operations</td><td><span className="app-pill warning">In progress</span></td><td>70%</td></tr>
        </tbody></table>
      </section>
    </main>
  );
}
