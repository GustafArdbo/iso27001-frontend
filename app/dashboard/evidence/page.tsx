import AppTopbar from "@/components/AppTopbar";

export default function EvidencePage() {
  return (
    <main className="app-main evidence-page">
      <AppTopbar title="Evidence" description="Collect, review, and organize audit evidence for your controls." />
      <section className="app-page-grid">
        <article className="app-card evidence-stat"><strong>84</strong><span>Uploaded</span></article>
        <article className="app-card evidence-stat"><strong>18</strong><span>Missing</span></article>
        <article className="app-card evidence-stat"><strong>9</strong><span>Expiring soon</span></article>
      </section>
      <section className="app-card app-table-card">
        <div className="app-card-header"><h2>Evidence library</h2><a href="#" className="app-action">Upload evidence</a></div>
        <table className="app-table"><thead><tr><th>Evidence</th><th>Control</th><th>Owner</th><th>Status</th></tr></thead><tbody>
          <tr><td>Access control policy</td><td>A.9 Access control</td><td>Operations</td><td><span className="app-pill good">Approved</span></td></tr>
          <tr><td>Asset inventory export</td><td>A.8 Asset management</td><td>IT Manager</td><td><span className="app-pill warning">Review</span></td></tr>
        </tbody></table>
      </section>
    </main>
  );
}
