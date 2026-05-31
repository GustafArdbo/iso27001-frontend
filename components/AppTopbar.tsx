import Link from "next/link";

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
  return (
    <header className="app-topbar">
      <div>
        <p className="app-eyebrow">ISO 27001 workspace</p>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>

      <div className="app-topbar-actions">
        <select aria-label="Framework">
          {frameworkOptions.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>

        <Link href="/" className="app-logout">
          Log out
        </Link>
      </div>
    </header>
  );
}
