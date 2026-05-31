import AppTopbar from "@/components/AppTopbar";

export default function ReportsPage() {
  return (
    <main className="app-main reports-page">
      <AppTopbar title="Reports" description="Create readiness summaries, control reports, and evidence exports." />
      <section className="app-page-grid">
        <article className="app-card report-card"><h2>Readiness report</h2><p>Export a high-level readiness summary for leadership.</p><a href="#" className="app-action">Generate →</a></article>
        <article className="app-card report-card"><h2>Control report</h2><p>Review implementation status across all ISO 27001 controls.</p><a href="#" className="app-action">Generate →</a></article>
        <article className="app-card report-card"><h2>Evidence export</h2><p>Prepare evidence packages for audit or internal review.</p><a href="#" className="app-action">Generate →</a></article>
      </section>
    </main>
  );
}
