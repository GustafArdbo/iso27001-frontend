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

type Status = "idle" | "loading" | "success" | "error";

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
      } catch (loadError) {
        console.error(loadError);
        setEmail(user?.email ?? "");
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

        <section className="app-page-grid">
          <article className="app-card">
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

          <article className="app-card">
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
      </main>
  );
}