import MarketingHeader from "@/components/MarketingHeader";

export default function Page() {
  return (
    <main className="landing-page">
      <MarketingHeader activePage="platform" />
      <section className="landing-container subpage">
        <section className="subpage-hero"><div className="compliance-pill">Platform</div><h1>
            One workspace for
            <br />
            ISO 27001 readiness.
        </h1><p>ComplyPilot helps your team manage controls, evidence, risks, tasks, and progress in one structured compliance platform.</p></section>
        <section className="subpage-grid">
          <article className="subpage-card"><h2>Control management</h2><p>Track ISO 27001 control status, ownership, evidence, and implementation progress.</p></article>
          <article className="subpage-card"><h2>Evidence collection</h2><p>Organize documents, policies, screenshots, and records in a clear audit-ready structure.</p></article>
          <article className="subpage-card"><h2>Risk visibility</h2><p>Connect risks, tasks, and controls so your team knows what needs attention first.</p></article>
        </section>
      </section>
    </main>
  );
}
