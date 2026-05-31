import MarketingHeader from "@/components/MarketingHeader";

export default function Page() {
  return (
    <main className="landing-page">
      <MarketingHeader activePage="about" />
      <section className="landing-container subpage">
        <section className="subpage-hero"><div className="compliance-pill">About ComplyPilot</div><h1>Practical ISO 27001 preparation for growing businesses.</h1><p>ComplyPilot helps businesses prepare for ISO 27001 readiness reviews, gap analyses, and future certification work through clear structure, practical templates, and security-focused guidance.</p></section>
        <section className="subpage-grid">
          <article className="subpage-card"><h2>What we do</h2><p>We support ISO 27001 readiness work, gap assessments, control documentation, and evidence preparation.</p></article>
          <article className="subpage-card"><h2>How we work</h2><p>We combine practical security knowledge with a structured delivery approach, so teams know what to improve and what to prepare next.</p></article>
          <article className="subpage-card"><h2>Who we help</h2><p>We help small and growing businesses build confidence around information security, compliance workflows, and audit readiness.</p></article>
        </section>
      </section>
    </main>
  );
}
