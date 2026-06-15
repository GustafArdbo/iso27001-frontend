"use client";

import { useRouter } from "next/navigation";
import { logout } from "@/lib/auth";
import OrganizationName from "@/components/OrganizationName";

type AppTopbarProps = {
  title: string;
  description: string;
};

export default function AppTopbar({ title, description }: AppTopbarProps) {
  const router = useRouter();

  async function handleLogout() {
    await logout();
    router.push("/");
  }

  return (
      <header className="app-topbar">
        <div>
          <p className="app-eyebrow">
            <OrganizationName />
          </p>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>

        <div className="app-topbar-actions">
          <button type="button" className="app-logout" onClick={handleLogout}>
            Log out
          </button>
        </div>
      </header>
  );
}