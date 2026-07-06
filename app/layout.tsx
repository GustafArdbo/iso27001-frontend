import type { Metadata } from "next";

import "./globals.css";

import "../styles/base/globals.css";

import "../styles/marketing/header-logo.css";
import "../styles/marketing/hero.css";
import "../styles/marketing/dashboard-preview.css";
import "../styles/marketing/about-trusted.css";
import "../styles/marketing/subpages.css";
import "../styles/marketing/form-footer.css";
import "../styles/marketing/responsive.css";

import "../styles/dashboard/layout.css";
import "../styles/dashboard/overview.css";
import "../styles/dashboard/controls.css";
import "../styles/dashboard/assessments.css";
import "../styles/dashboard/evidence.css";
import "../styles/dashboard/risks.css";
import "../styles/dashboard/tasks.css";
import "../styles/dashboard/reports.css";
import "../styles/dashboard/settings.css";

import "../styles/admin/onboarding.css";

export const metadata: Metadata = {
    title: "ComplyPilot",
    description: "ISO 27001 readiness and compliance platform",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body>{children}</body>
        </html>
    );
}
