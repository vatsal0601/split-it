import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs";
import isNil from "lodash/isNil";

import { DashboardTabs } from "@/components/dashboard-tabs";

export default async function Dashboard() {
  const user = await currentUser();

  if (isNil(user)) {
    redirect("/sign-in");
  }

  return (
    <>
      <DashboardTabs activeTab="Dashboard" />
      <main className="container h-full">
        <h1>Dashboard 🚀</h1>
      </main>
    </>
  );
}
