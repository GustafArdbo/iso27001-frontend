import AppSidebar from "@/components/AppSidebar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="app-body">
      <AppSidebar />
      {children}
    </div>
  );
}
