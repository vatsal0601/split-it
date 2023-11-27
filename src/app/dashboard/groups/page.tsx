import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs";
import isNil from "lodash/isNil";

import { DashboardTabs } from "@/components/dashboard-tabs";

export default async function Groups() {
  const user = await currentUser();

  if (isNil(user)) {
    redirect("/sign-in");
  }

  return (
    <>
      <DashboardTabs activeTab="Groups" />
      <main className="container h-full">
        <h1>Groups 🚀</h1>
      </main>
    </>
  );
}
