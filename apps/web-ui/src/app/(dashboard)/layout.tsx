import { BottomNav, Breadcrumbs, FloatingActionButton, SyncIndicator } from '@job-tracker/ui-components';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="pb-14 flex flex-col min-h-screen">
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Job Tracker</h1>
          <SyncIndicator />
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
