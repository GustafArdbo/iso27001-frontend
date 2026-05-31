"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
    { href: "/dashboard", icon: "⌘", label: "Overview" },
    { href: "/dashboard/controls", icon: "☷", label: "Controls" },
    { href: "/dashboard/assessments", icon: "☑", label: "Assessments" },
    { href: "/dashboard/evidence", icon: "▣", label: "Evidence" },
    { href: "/dashboard/risks", icon: "♧", label: "Risks" },
    { href: "/dashboard/tasks", icon: "☰", label: "Tasks" },
    { href: "/dashboard/reports", icon: "▤", label: "Reports" },
    { href: "/dashboard/settings", icon: "⚙", label: "Settings" },
];

export default function AppSidebar() {
    const pathname = usePathname() ?? "";

    return (
        <aside className="app-sidebar">
            <Link
                href="/dashboard"
                className="app-logo"
                aria-label="ComplyPilot dashboard"
            >
                <img
                    src="/assets/complypilot-logo-blue.png"
                    alt="ComplyPilot logo"
                />
            </Link>

            <nav className="app-nav" aria-label="Dashboard navigation">
                {navItems.map((item) => {
                    const isActive =
                        item.href === "/dashboard"
                            ? pathname === "/dashboard"
                            : pathname.startsWith(item.href);

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`app-nav-item${isActive ? " active" : ""}`}
                        >
                            <span>{item.icon}</span>
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            <div className="app-sidebar-footer">
                <Link href="/" className="app-back-link">
                    Back to website
                </Link>
            </div>
        </aside>
    );
}