import Link from "next/link";

export default function DemoHeader() {
  return (
    <header className="site-header">
      <div className="container nav-row">
        <Link href="/" className="brand logo-brand" aria-label="ComplyPilot home">
          <img src="/assets/complypilot-logo-blue.png" alt="ComplyPilot logo" className="brand-logo-img" />
        </Link>
        <nav className="nav-links">
          <Link href="/" className="nav-link">Home</Link>
          <Link href="/form" className="nav-link active">Book a demo</Link>
        </nav>
      </div>
    </header>
  );
}
