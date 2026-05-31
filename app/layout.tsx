import type { Metadata } from "next";

import "./globals.css";

import "../css/01-base.css";
import "../css/02-header-logo.css";
import "../css/03-hero.css";
import "../css/04-dashboard.css";
import "../css/05-about-trusted.css";
import "../css/06-subpages.css";
import "../css/07-form-footer.css";
import "../css/08-responsive.css";

import "../css/app/00-app-layout.css";
import "../css/app/01-overview.css";
import "../css/app/02-controls.css";
import "../css/app/03-assessments.css";
import "../css/app/04-evidence.css";
import "../css/app/05-risks.css";
import "../css/app/06-tasks.css";
import "../css/app/07-reports.css";
import "../css/app/08-settings.css";

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
