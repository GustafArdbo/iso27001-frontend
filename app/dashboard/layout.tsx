import AppSidebar from "@/components/AppSidebar";
import { DashboardProvider } from "@/components/DashboardContext";

export default function DashboardLayout({
                                          children,
                                        }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <DashboardProvider>
        <div className="app-body">
          <AppSidebar />
          {children}
        </div>
      </DashboardProvider>
  );
}
