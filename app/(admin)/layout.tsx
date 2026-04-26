import { ThemeForcer } from "../../shared/ui/ThemeForcer";
import { AdminSidebar } from "../../features/admin-nav/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-1 overflow-hidden print:overflow-visible bg-background print:bg-white min-h-screen">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto p-6 md:p-10 print:p-0 print:overflow-visible">
        {children}
      </main>
    </div>
  );
}
