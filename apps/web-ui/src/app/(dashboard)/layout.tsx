import { BottomNav, Breadcrumbs } from '@job-tracker/ui-components';
import FloatingActionButton from 'packages/ui-components/src/lib/common/floating-action-button';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="pb-14">
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold">Job Tracker</h1>
        </div>
      </header>
      <nav className="pl-3 bg-accent-content">
        <Breadcrumbs />
      </nav>
      <main className="container mx-auto p-4 grow">{children}</main>
      <BottomNav />
      <FloatingActionButton />
    </div>
  );
}
