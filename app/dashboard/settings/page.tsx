import AppTopbar from "@/components/AppTopbar";

export default function SettingsPage() {
  return (
    <main className="app-main settings-page">
      <AppTopbar title="Settings" description="Manage workspace preferences, organization details, and account settings." />
      <section className="app-page-grid two">
        <article className="app-card settings-form-card">
          <h2>Organization</h2>
          <form className="settings-form">
            <label>Organization name<input type="text" defaultValue="ComplyPilot Demo" /></label>
            <label>Framework<select defaultValue="ISO 27001"><option>ISO 27001</option></select></label>
            <button type="button">Save changes</button>
          </form>
        </article>
        <article className="app-card settings-form-card">
          <h2>Account</h2>
          <form className="settings-form">
            <label>Name<input type="text" defaultValue="Jane Doe" /></label>
            <label>Email<input type="email" defaultValue="jane@company.com" /></label>
            <button type="button">Update account</button>
          </form>
        </article>
      </section>
    </main>
  );
}
