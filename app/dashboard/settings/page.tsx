import AppTopbar from "@/components/AppTopbar";
import InviteMemberForm from "@/components/InviteMemberForm";

export default function SettingsPage() {
  return (
      <main className="app-main settings-page">
        <AppTopbar
            title="Settings"
            description="Manage workspace preferences, organization details, and account settings."
        />

        <section className="app-page-grid two">
          <article className="app-card settings-form-card">
            <h2>Organization</h2>

            <form className="settings-form">
              <label>
                Organization name
                <input type="text" defaultValue="ComplyPilot Demo" />
              </label>

              <label>
                Framework
                <select defaultValue="ISO 27001">
                  <option>ISO 27001</option>
                </select>
              </label>

              <button type="button">Save changes</button>
            </form>
          </article>

          <article className="app-card settings-form-card">
            <h2>Account</h2>

            <form className="settings-form">
              <label>
                Name
                <input type="text" defaultValue="Jane Doe" />
              </label>

              <label>
                Email
                <input type="email" defaultValue="jane@company.com" />
              </label>

              <button type="button">Update account</button>
            </form>
          </article>
        </section>

        <section className="app-card app-table-card">
          <div className="app-card-header">
            <div>
              <h2>Team access</h2>
              <p>
                Invite colleagues to this workspace and assign their access role.
              </p>
            </div>
          </div>

          <InviteMemberForm />
        </section>
      </main>
  );
}