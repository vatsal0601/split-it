import * as React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { clerkClient, currentUser } from "@clerk/nextjs";
import type { User } from "@clerk/nextjs/server";
import isNil from "lodash/isNil";
import size from "lodash/size";
import { MoveRightIcon } from "lucide-react";

import { getFirst5FriendRequests } from "@/db/friends";
import { DashboardTabs } from "@/components/dashboard-tabs";
import { UserFriend } from "@/components/friends-server-components";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TooltipProvider } from "@/components/ui/tooltip";

async function FriendRequestsCard({ user }: { user: User }) {
  let users: User[] = [];
  const friends = await getFirst5FriendRequests(user.id);
  const friendIds = friends.map((friend) => friend.userId);

  if (size(friendIds) > 0) {
    users = await clerkClient.users.getUserList({
      userId: friendIds,
    });
  }

  return (
    <Card className="flex flex-col lg:row-span-2">
      <CardHeader>
        <CardTitle>Your friend requests</CardTitle>
        <CardDescription>
          Recent friend requests sent by your friends.
        </CardDescription>
      </CardHeader>
      <CardContent className="grow">
        {size(users) > 0 ? (
          <TooltipProvider>
            <ul className="space-y-4">
              {users.map((currentUser) => {
                return (
                  <UserFriend
                    key={currentUser.id}
                    fromUserId={user.id}
                    currentUser={currentUser}
                    isShowingRequests={true}
                    isShowingSentRequests={false}
                  />
                );
              })}
            </ul>
          </TooltipProvider>
        ) : (
          <CardDescription className="italic">
            You don&apos;t have any friend new requests.
          </CardDescription>
        )}
      </CardContent>
      <Button variant="secondary" className="w-full rounded-t-none" asChild>
        <Link href="/dashboard/friends?show-requests=received">
          <span className="mr-2">View all friend requests</span>
          <MoveRightIcon className="size-4 lg:size-5" />
        </Link>
      </Button>
    </Card>
  );
}

export default async function Dashboard() {
  const user = await currentUser();

  if (isNil(user)) {
    redirect("/sign-in");
  }

  return (
    <>
      <DashboardTabs activeTab="Dashboard" />
      <main className="container min-h-full pb-32">
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
                <MoveRightIcon className="size-4 lg:size-5" />
              </Link>
            </Button>
          </Card>
          <React.Suspense
            fallback={
              <Skeleton className="min-h-[256px] rounded-lg shadow-sm lg:row-span-2" />
            }
          >
            <FriendRequestsCard user={user} />
          </React.Suspense>
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
              <Link href="/dashboard/friends?show-requests=received">
                <span className="mr-2">View all groups</span>
                <MoveRightIcon className="size-4 lg:size-5" />
              </Link>
            </Button>
          </Card>
        </div>
      </main>
    </>
  );
}
