import { ThemeForcer } from "../../shared/ui/ThemeForcer";
import { AdminSidebar } from "../../features/admin-nav/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex w-full h-[100dvh] overflow-hidden bg-background print:bg-white relative">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto p-6 md:p-10 print:p-0 print:overflow-visible h-[100dvh]">
        {children}
      </main>
    </div>
  );
}
