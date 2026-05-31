import Link from "next/link";
import MarketingHeader from "@/components/MarketingHeader";

export default function LoginPage() {
  return (
    <main className="landing-page">
      <MarketingHeader activePage="login" />
      <section className="landing-container subpage">
        <section className="login-card">
          <div className="login-copy"><div className="compliance-pill">ComplyPilot account</div><h1>Log in to your workspace.</h1><p>Access your ISO 27001 readiness dashboard, evidence tasks, control status, and assessment progress.</p></div>
          <form className="login-form" action="/dashboard">
            <label>Email<input type="email" name="email" placeholder="you@company.com" /></label>
            <label>Password<input type="password" name="password" placeholder="Enter your password" /></label>
            <button type="submit">Log in</button>
            <p className="login-helper">Don’t have an account yet? <Link href="/form">Book a demo</Link></p>
          </form>
        </section>
      </section>
    </main>
  );
}
