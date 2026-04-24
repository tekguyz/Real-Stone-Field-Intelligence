import { ThemeForcer } from '../../shared/ui/ThemeForcer';
import { AdminSidebar } from '../../features/admin-nav/AdminSidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1 overflow-hidden bg-background">
      <ThemeForcer theme="light" />
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto p-6 md:p-10">
        {children}
      </main>
    </div>
  );
}
