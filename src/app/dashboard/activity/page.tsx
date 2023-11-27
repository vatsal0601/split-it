import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs";
import isNil from "lodash/isNil";

import { DashboardTabs } from "@/components/dashboard-tabs";

export default async function Activity() {
  const user = await currentUser();

  if (isNil(user)) {
    redirect("/sign-in");
  }

  return (
    <>
      <DashboardTabs activeTab="Activity" />
      <main className="container h-full">
        <h1>Activity 🚀</h1>
      </main>
    </>
  );
}
