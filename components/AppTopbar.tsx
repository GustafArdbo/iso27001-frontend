"use client";

import { useRouter } from "next/navigation";
import { logout } from "@/lib/auth";
import OrganizationName from "@/components/OrganizationName";

type AppTopbarProps = {
  title: string;
  description: string;
  frameworkOptions?: string[];
};

export default function AppTopbar({
  title,
  description,
  frameworkOptions = ["ISO 27001"],
}: AppTopbarProps) {
  const router = useRouter();

  async function handleLogout() {
    await logout();
    router.push("/");
  }

  return (
    <header className="app-topbar">
      <div>
        <p className="app-eyebrow"><OrganizationName /></p>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>

      <div className="app-topbar-actions">
        <select aria-label="Framework">
          {frameworkOptions.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>

        <button type="button" className="app-logout" onClick={handleLogout}>
          Log out
        </button>
      </div>
    </header>
  );
}
