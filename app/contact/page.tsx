import Link from "next/link";
import MarketingHeader from "@/components/MarketingHeader";

export default function ContactPage() {
  return (
    <main className="landing-page">
      <MarketingHeader activePage="contact" />
      <section className="landing-container subpage">
        <section className="subpage-hero"><div className="compliance-pill">Contact</div><h1>Talk to us about ISO 27001 readiness.</h1><p>Tell us where you are in your ISO 27001 journey and we’ll help you identify the next practical step.</p></section>
        <section className="contact-layout">
          <article className="subpage-card"><h2>Contact details</h2><p>Email: hello@complypilot.com</p><p>Phone: +1 555 123 4567</p><p>Address: 12 Security Lane, Stockholm, Sweden</p></article>
          <article className="subpage-card"><h2>Start faster</h2><p>Want to begin with an ISO 27001 readiness request?</p><Link href="/form" className="landing-button primary">Book a demo</Link></article>
        </section>
      </section>
    </main>
  );
}
