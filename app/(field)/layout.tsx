import { ThemeForcer } from '../../shared/ui/ThemeForcer';
import { BottomNav } from '../../shared/ui/BottomNav';

export default function FieldLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1 overflow-hidden bg-background justify-center">
      <div className="w-full max-w-md bg-background border-x border-border/10 flex flex-col relative h-[calc(100vh-2.5rem)]">
        <main className="flex-1 overflow-y-auto pb-24">
          {children}
        </main>
        <BottomNav />
      </div>
    </div>
  );
}
