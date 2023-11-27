import Link from "next/link";
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs";
import isNil from "lodash/isNil";
import { MoveRightIcon } from "lucide-react";

import { DashboardTabs } from "@/components/dashboard-tabs";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function Dashboard() {
  const user = await currentUser();

  if (isNil(user)) {
    redirect("/sign-in");
  }

  return (
    <>
      <DashboardTabs activeTab="Dashboard" />
      <main className="container h-full">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Card className="flex flex-col lg:col-span-2">
            <CardHeader>
              <CardTitle>Recent activity</CardTitle>
              <CardDescription>
                This is where you&apos;ll see recent activity from your friends.
              </CardDescription>
            </CardHeader>
            <CardContent className="grow">
              <p className="text-muted-foreground">
                Lorem ipsum, dolor sit amet consectetur adipisicing elit. Sed
                atque accusamus fugit ullam amet laudantium dignissimos dicta
                maxime libero! Eos asperiores temporibus voluptates vel numquam
                magnam repudiandae explicabo eligendi qui?
              </p>
            </CardContent>

            <Button
              variant="secondary"
              className="w-full rounded-t-none"
              asChild
            >
              <Link href="/dashboard/activity">
                <span className="mr-2">View all activity</span>
                <MoveRightIcon className="h-4 w-4 lg:h-5 lg:w-5" />
              </Link>
            </Button>
          </Card>
          <Card className="flex flex-col lg:row-span-2">
            <CardHeader>
              <CardTitle>Your friend requests</CardTitle>
              <CardDescription>
                This is where you&apos;ll see recent activity from your friends.
              </CardDescription>
            </CardHeader>
            <CardContent className="grow">
              <p className="text-sm text-muted-foreground">
                This is where you&apos;ll see recent friend requests.
              </p>
            </CardContent>
            <Button
              variant="secondary"
              className="w-full rounded-t-none"
              asChild
            >
              <Link href="/dashboard/friends?show-requests=true">
                <span className="mr-2">View all friend requests</span>
                <MoveRightIcon className="h-4 w-4 lg:h-5 lg:w-5" />
              </Link>
            </Button>
          </Card>
          <Card className="flex flex-col lg:col-span-2">
            <CardHeader>
              <CardTitle>Your groups</CardTitle>
              <CardDescription>
                This is where you&apos;ll see groups you&apos;re a part of.
              </CardDescription>
            </CardHeader>
            <CardContent className="grow">
              <p className="text-sm text-muted-foreground">
                This is where you&apos;ll see recent activity from your friends.
              </p>
            </CardContent>
            <Button
              variant="secondary"
              className="w-full rounded-t-none"
              asChild
            >
              <Link href="/dashboard/friends?show-requests=true">
                <span className="mr-2">View all groups</span>
                <MoveRightIcon className="h-4 w-4 lg:h-5 lg:w-5" />
              </Link>
            </Button>
          </Card>
        </div>
      </main>
    </>
  );
}
