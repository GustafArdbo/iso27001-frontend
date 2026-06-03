import Link from "next/link";
import MarketingHeader from "@/components/MarketingHeader";

export default function HomePage() {
  return (
      <main className="landing-page">
        <MarketingHeader />

        <section className="landing-container landing-hero">
          <div className="hero-left">
            <div className="compliance-pill">
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                    d="M12 3L20 6.5V11.5C20 16.5 16.6 20.4 12 21.5C7.4 20.4 4 16.5 4 11.5V6.5L12 3Z"
                    stroke="currentColor"
                    strokeWidth="2"
                />
                <path
                    d="M9 12L11.1 14.1L15.5 9.7"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
              </svg>
              ISO 27001 readiness &amp; compliance
            </div>

            <h1 className="hero-title">
              <span>Get audit-ready</span>
              <span>for ISO 27001</span>
            </h1>

            <p className="landing-copy">
              Simplify gap analysis, automate evidence collection, and streamline
              compliance workflows—so you can focus on what matters most.
            </p>

            <div className="landing-cta-row">
              <Link href="/form" className="landing-button primary">
                Get started free <span aria-hidden="true">→</span>
              </Link>

              <Link href="/platform" className="landing-button secondary">
                See how it works <span aria-hidden="true">→</span>
              </Link>
            </div>

            <div className="landing-feature-row">
              <div className="landing-feature">
                <div className="landing-feature-icon">🔒</div>
                <div>
                  <strong>Built for security</strong>
                  <p>Security by design. Your data stays private.</p>
                </div>
              </div>

              <div className="landing-feature">
                <div className="landing-feature-icon">👥</div>
                <div>
                  <strong>Expert guidance</strong>
                  <p>Step-by-step guidance from ISO 27001 experts.</p>
                </div>
              </div>

              <div className="landing-feature">
                <div className="landing-feature-icon">✓</div>
                <div>
                  <strong>Audit confidence</strong>
                  <p>Evidence you can trust. Audits you can pass.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="hero-right">
            <div className="dashboard-shell" aria-label="Dashboard preview">
              <aside className="dashboard-sidebar">
                <div className="dashboard-mark">✓</div>

                <div className="sidebar-item active">
                  <span>⌘</span>
                  Overview
                </div>

                <div className="sidebar-item">
                  <span>☷</span>
                  Controls
                </div>

                <div className="sidebar-item">
                  <span>☑</span>
                  Assessments
                </div>

                <div className="sidebar-item">
                  <span>▣</span>
                  Evidence
                </div>

                <div className="sidebar-item">
                  <span>♧</span>
                  Risks
                </div>

                <div className="sidebar-item">
                  <span>☰</span>
                  Tasks
                </div>

                <div className="sidebar-item">
                  <span>▤</span>
                  Reports
                </div>

                <div className="sidebar-item">
                  <span>⚙</span>
                  Settings
                </div>
              </aside>

              <section className="dashboard-main">
                <div className="dashboard-top">
                  <div>
                    <h2>Dashboard</h2>
                    <p>Welcome back! Here’s your compliance overview.</p>
                  </div>

                  <button type="button" className="framework-select" disabled>
                    All frameworks
                  </button>
                </div>

                <div className="dashboard-cards">
                  <article className="dash-card">
                    <h3>Overall compliance</h3>

                    <div className="ring">
                      <div className="ring-inner">
                        <strong>78%</strong>
                        <span>Good</span>
                      </div>
                    </div>

                    <p className="positive">↑ +8% vs last month</p>
                  </article>

                  <article className="dash-card">
                    <h3>Controls status</h3>

                    <div className="status-row">
                      <span className="status-dot done">✓</span>
                      <span>Implemented</span>
                      <strong>93</strong>
                    </div>

                    <div className="status-row">
                      <span className="status-dot progress"></span>
                      <span>In progress</span>
                      <strong>24</strong>
                    </div>

                    <div className="status-row">
                      <span className="status-dot empty"></span>
                      <span>Not started</span>
                      <strong>12</strong>
                    </div>

                    <div className="total-row">
                      <span>Total controls</span>
                      <strong>129</strong>
                    </div>
                  </article>

                  <article className="dash-card">
                    <h3>Open risks</h3>

                    <div className="risk-row">
                      <strong>7</strong>
                      <span className="high">High</span>
                    </div>

                    <div className="risk-row">
                      <strong>12</strong>
                      <span className="medium">Medium</span>
                    </div>

                    <div className="risk-row">
                      <strong>5</strong>
                      <span className="low">Low</span>
                    </div>

                    <span className="dash-link">View risk register →</span>
                  </article>
                </div>

                <div className="dashboard-bottom">
                  <article className="dash-card domains-card">
                    <h3>Top control domains</h3>

                    {[
                      ["A.5 Information security policies", "90%"],
                      ["A.6 Organization of information security", "75%"],
                      ["A.8 Asset management", "80%"],
                      ["A.9 Access control", "70%"],
                      ["A.12 Operations security", "65%"],
                    ].map(([name, width]) => (
                        <div className="bar-row" key={name}>
                          <span>{name}</span>
                          <div>
                            <i style={{ width }}></i>
                          </div>
                          <strong>{width}</strong>
                        </div>
                    ))}

                    <span className="dash-link">View all controls →</span>
                  </article>

                  <article className="dash-card tasks-card">
                    <h3>Recent tasks</h3>

                    <div className="task-row">
                      <span className="task-check">✓</span>
                      <div>
                        <strong>Upload evidence for A.8.1</strong>
                        <p>Due tomorrow</p>
                      </div>
                      <em className="tag high-tag">High</em>
                    </div>

                    <div className="task-row">
                      <span className="task-check">✓</span>
                      <div>
                        <strong>Complete risk assessment</strong>
                        <p>Due in 3 days</p>
                      </div>
                      <em className="tag medium-tag">Medium</em>
                    </div>

                    <div className="task-row">
                      <span className="task-empty"></span>
                      <div>
                        <strong>Review access control policy</strong>
                        <p>Due in 7 days</p>
                      </div>
                      <em className="tag low-tag">Low</em>
                    </div>

                    <span className="dash-link">View all tasks →</span>
                  </article>
                </div>
              </section>
            </div>
          </div>
        </section>

        <section className="landing-container trusted-strip">
          <p>Trusted by security-conscious companies worldwide</p>
          <div className="trusted-divider"></div>

          <div className="trusted-logos">
            <span className="logo-word">NORTHRIDGE</span>
            <span className="logo-word">Bluepeak</span>
            <span className="logo-word spaced">VERITY</span>
            <span className="logo-word">CLOUDWAY</span>
            <span className="logo-word">Fortis</span>
          </div>
        </section>
      </main>
  );
}