import * as React from "react";

import { DashboardTabs } from "@/components/dashboard-tabs";
import { Skeleton } from "@/components/ui/skeleton";

export default function FriendsLoading() {
  return (
    <>
      <DashboardTabs activeTab="Friends" />
      <main className="container h-full space-y-10">
        <div className="space-y-5">
          <div className="flex flex-col items-end justify-between gap-4 md:flex-row-reverse md:items-center">
            <Skeleton className="h-9 w-24 sm:h-10 sm:w-28" />
            <Skeleton className="h-10 w-full md:max-w-lg" />
          </div>
          <div className="flex items-center gap-1">
            <Skeleton className="h-9 w-16 sm:h-10 sm:w-20" />
            <Skeleton className="h-9 w-16 sm:h-10 sm:w-20" />
            <Skeleton className="h-9 w-16 sm:h-10 sm:w-20" />
          </div>
        </div>
        <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          <Skeleton className="h-[72px]" />
          <Skeleton className="h-[72px]" />
          <Skeleton className="h-[72px]" />
        </ul>
      </main>
    </>
  );
}
