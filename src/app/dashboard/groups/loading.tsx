import * as React from "react";

import { DashboardTabs } from "@/components/dashboard-tabs";
import { Skeleton } from "@/components/ui/skeleton";

export default function FriendsLoading() {
  return (
    <>
      <DashboardTabs activeTab="Groups" />
      <main className="container min-h-full space-y-10 pb-32">
        <div className="space-y-5">
          <div className="flex flex-col items-end justify-between gap-4 md:flex-row-reverse md:items-center">
            <Skeleton className="h-9 w-28 md:h-10 md:w-32" />
            <Skeleton className="h-10 w-full md:max-w-lg" />
          </div>
        </div>
        <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          <Skeleton className="h-[122px]" />
          <Skeleton className="h-[122px]" />
          <Skeleton className="h-[122px]" />
        </ul>
      </main>
    </>
  );
}
