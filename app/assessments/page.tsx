import MarketingHeader from "@/components/MarketingHeader";

export default function Page() {
  return (
    <main className="landing-page">
      <MarketingHeader activePage="assessments" />
      <section className="landing-container subpage">
        <section className="subpage-hero"><div className="compliance-pill">Assessments</div><h1>
            Run structured
            <br />
            ISO 27001 gap
            <br />
            assessments.
        </h1><p>Identify missing controls, prioritize risks, and create a practical roadmap toward ISO 27001 readiness.</p></section>
        <section className="subpage-grid">
          <article className="subpage-card"><h2>Gap analysis</h2><p>Compare your current security work against ISO 27001 expectations.</p></article>
          <article className="subpage-card"><h2>Readiness reviews</h2><p>Understand whether your documentation, controls, and evidence are ready for the next step.</p></article>
          <article className="subpage-card"><h2>Action plans</h2><p>Turn findings into clear tasks with owners, due dates, and priorities.</p></article>
        </section>
      </section>
    </main>
  );
}
