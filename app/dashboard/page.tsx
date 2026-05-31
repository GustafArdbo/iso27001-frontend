import Link from "next/link";
import AppTopbar from "@/components/AppTopbar";

export default function DashboardPage() {
  return (
    <main className="app-main">
      <AppTopbar
        title="Dashboard"
        description="Welcome back! Here’s your compliance overview."
        frameworkOptions={["All frameworks", "ISO 27001", "SOC 2", "GDPR"]}
      />

      <section className="app-kpi-grid">
        <article className="app-card compliance-card">
          <div className="app-card-header">
            <h2>Overall compliance</h2>
            <span className="status-pill good">Good</span>
          </div>

          <div className="big-ring">
            <div className="big-ring-inner">
              <strong>78%</strong>
              <span>Good</span>
            </div>
          </div>

          <p className="positive">↑ +8% vs last month</p>
        </article>

        <article className="app-card">
          <div className="app-card-header">
            <h2>Controls status</h2>
          </div>

          <div className="app-status-list">
            <div className="app-status-row"><span className="status-dot done">✓</span><span>Implemented</span><strong>93</strong></div>
            <div className="app-status-row"><span className="status-dot progress"></span><span>In progress</span><strong>24</strong></div>
            <div className="app-status-row"><span className="status-dot empty"></span><span>Not started</span><strong>12</strong></div>
          </div>

          <div className="app-total-row"><span>Total controls</span><strong>129</strong></div>
        </article>

        <article className="app-card">
          <div className="app-card-header"><h2>Open risks</h2></div>
          <div className="risk-list">
            <div className="risk-row"><strong>7</strong><span className="high">High</span></div>
            <div className="risk-row"><strong>12</strong><span className="medium">Medium</span></div>
            <div className="risk-row"><strong>5</strong><span className="low">Low</span></div>
          </div>
          <Link href="/dashboard/risks" className="dash-link">View risk register →</Link>
        </article>
      </section>

      <section className="app-content-grid">
        <article className="app-card app-wide-card">
          <div className="app-card-header">
            <h2>Top control domains</h2>
            <Link href="/dashboard/controls" className="dash-link">View all controls →</Link>
          </div>

          <div className="control-domain-list">
            <div className="app-bar-row"><span>A.5 Information security policies</span><div><i style={{ width: "90%" }}></i></div><strong>90%</strong></div>
            <div className="app-bar-row"><span>A.6 Organization of information security</span><div><i style={{ width: "75%" }}></i></div><strong>75%</strong></div>
            <div className="app-bar-row"><span>A.8 Asset management</span><div><i style={{ width: "80%" }}></i></div><strong>80%</strong></div>
            <div className="app-bar-row"><span>A.9 Access control</span><div><i style={{ width: "70%" }}></i></div><strong>70%</strong></div>
            <div className="app-bar-row"><span>A.12 Operations security</span><div><i style={{ width: "65%" }}></i></div><strong>65%</strong></div>
          </div>
        </article>

        <article className="app-card">
          <div className="app-card-header">
            <h2>Recent tasks</h2>
            <Link href="/dashboard/tasks" className="dash-link">View all →</Link>
          </div>

          <div className="app-task-list">
            <div className="task-row"><span className="task-check">✓</span><div><strong>Upload evidence for A.8.1</strong><p>Due tomorrow</p></div><em className="tag high-tag">High</em></div>
            <div className="task-row"><span className="task-check">✓</span><div><strong>Complete risk assessment</strong><p>Due in 3 days</p></div><em className="tag medium-tag">Medium</em></div>
            <div className="task-row"><span className="task-empty"></span><div><strong>Review access control policy</strong><p>Due in 7 days</p></div><em className="tag low-tag">Low</em></div>
          </div>
        </article>
      </section>

      <section className="app-content-grid secondary-grid">
        <article className="app-card">
          <div className="app-card-header"><h2>Assessment progress</h2></div>
          <div className="assessment-list">
            <div><strong>Initial ISO 27001 readiness review</strong><p>42 of 54 questions completed</p></div>
            <div className="mini-progress"><span style={{ width: "78%" }}></span></div>
          </div>
          <Link href="/dashboard/assessments" className="landing-button primary app-small-button">Continue assessment</Link>
        </article>

        <article className="app-card">
          <div className="app-card-header"><h2>Evidence health</h2></div>
          <div className="evidence-stats">
            <div><strong>84</strong><span>Uploaded</span></div>
            <div><strong>18</strong><span>Missing</span></div>
            <div><strong>9</strong><span>Expiring</span></div>
          </div>
        </article>
      </section>
    </main>
  );
}
