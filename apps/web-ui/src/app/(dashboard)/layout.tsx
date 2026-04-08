import { BottomNav, Breadcrumbs, FloatingActionButton, Header } from '@job-tracker/ui-components';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="pb-14 flex flex-col min-h-screen">
      <Header title="Job Tracker" iconSrc="/favicon-32x32.png" />
      <nav className="pl-3 bg-accent-content">
        <Breadcrumbs />
      </nav>
      <main className="container mx-auto p-4 grow">{children}</main>
      <BottomNav />
      <FloatingActionButton />
    </div>
  );
}
