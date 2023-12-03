import { DashboardTabs } from "@/components/dashboard-tabs";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <>
      <DashboardTabs activeTab="Dashboard" />
      <main className="container h-full">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Skeleton className="min-h-[256px] rounded-lg shadow-sm lg:col-span-2" />
          <Skeleton className="min-h-[256px] rounded-lg shadow-sm lg:row-span-2" />
          <Skeleton className="min-h-[256px] rounded-lg shadow-sm lg:col-span-2" />
        </div>
      </main>
    </>
  );
}
