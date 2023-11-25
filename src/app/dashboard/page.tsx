import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs";
import isNil from "lodash/isNil";

export default async function Dashboard() {
  const user = await currentUser();

  if (isNil(user)) {
    redirect("/sign-in");
  }

  return (
    <div>
      <h1>Dashboard 🚀</h1>
    </div>
  );
}
