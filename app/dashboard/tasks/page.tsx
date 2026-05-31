import AppTopbar from "@/components/AppTopbar";

export default function TasksPage() {
  return (
    <main className="app-main tasks-page">
      <AppTopbar title="Tasks" description="Manage assigned actions, due dates, priorities, and remediation work." />
      <section className="app-card">
        <div className="app-card-header"><h2>Task list</h2><a href="#" className="app-action">Create task</a></div>
        <div className="task-list-full">
          <article><span className="task-check">✓</span><div><strong>Upload evidence for A.8.1</strong><p>Due tomorrow</p></div><em className="app-pill error">High</em></article>
          <article><span className="task-check">✓</span><div><strong>Complete risk assessment</strong><p>Due in 3 days</p></div><em className="app-pill warning">Medium</em></article>
          <article><span className="task-empty"></span><div><strong>Review access control policy</strong><p>Due in 7 days</p></div><em className="app-pill good">Low</em></article>
        </div>
      </section>
    </main>
  );
}
