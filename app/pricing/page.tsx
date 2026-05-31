import Link from "next/link";
import MarketingHeader from "@/components/MarketingHeader";

export default function PricingPage() {
  return (
    <main className="landing-page">
      <MarketingHeader activePage="pricing" />
      <section className="landing-container subpage">
        <section className="subpage-hero"><div className="compliance-pill">Pricing</div><h1>Simple pricing for growing teams.</h1><p>Start with the support you need today and expand as your ISO 27001 readiness program grows.</p></section>
        <section className="pricing-grid">
          <article className="pricing-card"><h2>Starter</h2><p>For small teams preparing their first ISO 27001 readiness review.</p><strong>Contact us</strong><Link href="/contact" className="landing-button secondary">Ask for pricing</Link></article>
          <article className="pricing-card featured"><h2>Growth</h2><p>For organizations managing controls, evidence, risk, and assessment workflows.</p><strong>Most popular</strong><Link href="/form" className="landing-button primary">Book a demo</Link></article>
          <article className="pricing-card"><h2>Advisory</h2><p>For teams that need hands-on support, templates, and expert guidance.</p><strong>Custom</strong><Link href="/contact" className="landing-button secondary">Contact sales</Link></article>
        </section>
      </section>
    </main>
  );
}
