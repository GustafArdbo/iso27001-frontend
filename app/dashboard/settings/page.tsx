"use client";

import { FormEvent, useEffect, useState } from "react";
import AppTopbar from "@/components/AppTopbar";
import InviteMemberForm from "@/components/InviteMemberForm";
import {
  AppErrorState,
  AppLoadingState,
} from "@/components/AppDataState";
import { useDashboardContext } from "@/components/DashboardContext";
import { createClient } from "@/lib/supabase/client";
import { createSupportTicket } from "@/lib/supportTickets";

type Status = "idle" | "loading" | "success" | "error";
type SupportStatus = "idle" | "success" | "error";

export default function SettingsPage() {
  const {
    user,
    organization,
    organizationId,
    organizationName,
    isLoading,
    error,
    refreshDashboardContext,
  } = useDashboardContext();

  const [accountStatus, setAccountStatus] = useState<Status>("idle");
  const [accountMessage, setAccountMessage] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [supportStatus, setSupportStatus] = useState<SupportStatus>("idle");
  const [supportMessage, setSupportMessage] = useState("");
  const [supportName, setSupportName] = useState("");
  const [supportEmail, setSupportEmail] = useState("");
  const [supportPhone, setSupportPhone] = useState("");
  const [supportIssue, setSupportIssue] = useState("");

  useEffect(() => {
    async function loadAccount() {
      try {
        const supabase = createClient();

        const {
          data: { user: supabaseUser },
        } = await supabase.auth.getUser();

        const metadataName =
            typeof supabaseUser?.user_metadata?.name === "string"
                ? supabaseUser.user_metadata.name
                : "";

        setName(metadataName);
        setEmail(supabaseUser?.email ?? user?.email ?? "");
        setSupportName(metadataName);
        setSupportEmail(supabaseUser?.email ?? user?.email ?? "");
      } catch (loadError) {
        console.error(loadError);
        setEmail(user?.email ?? "");
        setSupportEmail(user?.email ?? "");
      }
    }

    void loadAccount();
  }, [user]);

  async function handleAccountUpdate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setAccountStatus("loading");
      setAccountMessage("");

      const supabase = createClient();

      const trimmedName = name.trim();
      const trimmedEmail = email.trim();

      const { error: updateError } = await supabase.auth.updateUser({
        email: trimmedEmail,
        data: {
          name: trimmedName,
        },
      });

      if (updateError) {
        throw updateError;
      }

      setAccountStatus("success");
      setAccountMessage(
          "Account updated. If you changed your email, check your inbox to confirm it."
      );

      await refreshDashboardContext();
    } catch (updateError) {
      console.error(updateError);
      setAccountStatus("error");
      setAccountMessage(
          updateError instanceof Error
              ? updateError.message
              : "Could not update account."
      );
    }
  }

  function handleSupportSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      createSupportTicket({
        name: supportName.trim(),
        email: supportEmail.trim(),
        phone: supportPhone.trim(),
        message: supportIssue.trim(),
        organizationId,
        organizationName,
      });

      setSupportStatus("success");
      setSupportMessage("Support request sent to the admin team.");
      setSupportIssue("");
      setSupportPhone("");
      window.setTimeout(() => {
        setIsSupportOpen(false);
        setSupportStatus("idle");
        setSupportMessage("");
      }, 1200);
    } catch (supportError) {
      console.error(supportError);
      setSupportStatus("error");
      setSupportMessage(
          supportError instanceof Error
              ? supportError.message
              : "Could not send support request."
      );
    }
  }

  if (isLoading) {
    return (
        <main className="app-main settings-page">
          <AppTopbar
              title="Settings"
              description="Manage workspace preferences, organization details, and account settings."
          />
          <AppLoadingState title="Loading settings" />
        </main>
    );
  }

  if (error) {
    return (
        <main className="app-main settings-page">
          <AppTopbar
              title="Settings"
              description="Manage workspace preferences, organization details, and account settings."
          />
          <AppErrorState title="Could not load settings" message={error} />
        </main>
    );
  }

  return (
      <main className="app-main settings-page">
        <AppTopbar
            title="Settings"
            description="Manage workspace preferences, organization details, and account settings."
        />

        <section className="app-page-grid settings-card-grid">
          <article className="app-card settings-summary-card">
            <div className="app-card-header">
              <h2>Organization</h2>
            </div>

            <form className="settings-form">
              <label>
                Organization name
                <input
                    type="text"
                    value={organizationName ?? organization?.name ?? ""}
                    readOnly
                />
              </label>

              <label>
                Organization ID
                <input type="text" value={organizationId} readOnly />
              </label>
            </form>
          </article>

          <article className="app-card settings-summary-card">
            <div className="app-card-header">
              <h2>Account</h2>
            </div>

            <form className="settings-form" onSubmit={handleAccountUpdate}>
              <label>
                Name
                <input
                    type="text"
                    value={name}
                    placeholder="Your name"
                    onChange={(event) => setName(event.target.value)}
                />
              </label>

              <label>
                Email
                <input
                    type="email"
                    value={email}
                    placeholder="you@company.com"
                    onChange={(event) => setEmail(event.target.value)}
                    required
                />
              </label>

              <button type="submit" disabled={accountStatus === "loading"}>
                {accountStatus === "loading"
                    ? "Updating..."
                    : "Update account"}
              </button>

              {accountMessage && (
                  <p
                      className={`feedback ${
                          accountStatus === "error" ? "error" : ""
                      }`}
                  >
                    {accountMessage}
                  </p>
              )}
            </form>
          </article>

          <article className="app-card settings-summary-card support-card">
            <div className="app-card-header">
              <h2>Support</h2>
            </div>

            <div className="settings-support-content">
              <p>
                Need help with your workspace, access, or ISO 27001 setup?
              </p>

              <button
                  type="button"
                  className="settings-support-link"
                  onClick={() => setIsSupportOpen(true)}
              >
                Contact support
              </button>
            </div>
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

          <InviteMemberForm organizationId={organizationId} />
        </section>

        {isSupportOpen && (
            <div className="support-modal-backdrop" role="presentation">
              <section
                  className="support-modal app-card"
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="support-modal-title"
              >
                <div className="app-card-header">
                  <div>
                    <h2 id="support-modal-title">Contact support</h2>
                    <p>
                      Tell us who to contact and what you need help with. The
                      request will appear in the admin support queue.
                    </p>
                  </div>
                  <button
                      type="button"
                      className="support-modal-close"
                      aria-label="Close support form"
                      onClick={() => setIsSupportOpen(false)}
                  >
                    ×
                  </button>
                </div>

                <form className="support-modal-form" onSubmit={handleSupportSubmit}>
                  <div className="row">
                    <label>
                      Name
                      <input
                          type="text"
                          value={supportName}
                          placeholder="Your name"
                          onChange={(event) => setSupportName(event.target.value)}
                          required
                      />
                    </label>

                    <label>
                      Email
                      <input
                          type="email"
                          value={supportEmail}
                          placeholder="you@company.com"
                          onChange={(event) => setSupportEmail(event.target.value)}
                          required
                      />
                    </label>
                  </div>

                  <label>
                    Phone number
                    <input
                        type="tel"
                        value={supportPhone}
                        placeholder="+46 70 123 45 67"
                        onChange={(event) => setSupportPhone(event.target.value)}
                    />
                  </label>

                  <label>
                    Issue
                    <textarea
                        value={supportIssue}
                        placeholder="Describe what you need help with."
                        onChange={(event) => setSupportIssue(event.target.value)}
                        required
                    />
                  </label>

                  <div className="support-modal-actions">
                    <button type="submit">Send support request</button>
                    <button
                        type="button"
                        className="support-modal-secondary"
                        onClick={() => setIsSupportOpen(false)}
                    >
                      Cancel
                    </button>
                  </div>

                  {supportMessage && (
                      <p
                          className={`feedback ${
                              supportStatus === "error" ? "error" : ""
                          }`}
                      >
                        {supportMessage}
                      </p>
                  )}
                </form>
              </section>
            </div>
        )}
      </main>
  );
}
