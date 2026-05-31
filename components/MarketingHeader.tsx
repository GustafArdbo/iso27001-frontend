import Link from "next/link";

type MarketingHeaderProps = {
  activePage?: "platform" | "assessments" | "pricing" | "contact" | "about" | "login";
};

const links = [
  { href: "/platform", label: "Platform", key: "platform" },
  { href: "/assessments", label: "Assessments", key: "assessments" },
  { href: "/pricing", label: "Pricing", key: "pricing" },
  { href: "/contact", label: "Contact", key: "contact" },
  { href: "/about", label: "About us", key: "about" },
] as const;

export default function MarketingHeader({ activePage }: MarketingHeaderProps) {
  return (
    <header className="landing-header">
      <div className="landing-container landing-nav">
        <Link href="/" className="landing-brand logo-brand" aria-label="ComplyPilot home">
          <img src="/assets/complypilot-logo.png" alt="ComplyPilot logo" className="brand-logo-img" />
        </Link>

        <nav className="landing-links" aria-label="Main navigation">
          {links.map((link) => (
            <Link key={link.key} href={link.href} className={activePage === link.key ? "active-page" : undefined}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="landing-actions">
          <Link href="/form" className="demo-button">Book a demo</Link>
          <Link href="/login" className={`login-button${activePage === "login" ? " active-login" : ""}`}>Log in</Link>
        </div>
      </div>
    </header>
  );
}
