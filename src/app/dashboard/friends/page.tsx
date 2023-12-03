import * as React from "react";
import { redirect } from "next/navigation";
import { clerkClient, currentUser } from "@clerk/nextjs";
import { type User as UserType } from "@clerk/nextjs/server";
import isNil from "lodash/isNil";
import size from "lodash/size";

import { cn } from "@/lib/utils";
import {
  getFriendRequests,
  getFriendRequestsSent,
  getFriends,
} from "@/db/friends";
import { DashboardTabs } from "@/components/dashboard-tabs";
import {
  AddFriendButton,
  DeleteConfirmationDialog,
  FriendsToggle,
} from "@/components/friends-client-components";
import { AddFriendCommand } from "@/components/friends-server-components";
import { SearchInput } from "@/components/search-input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { typography } from "@/components/ui/typography";

function User({
  currentUser,
  fromUserId,
  isShowingRequests,
  isShowingSentRequests,
}: {
  currentUser: UserType;
  fromUserId: string;
  isShowingRequests: boolean;
  isShowingSentRequests: boolean;
}) {
  const firstName = currentUser.firstName ?? "";
  const lastName = currentUser.lastName ?? "";
  const userInitials = `${firstName[0] ?? ""}${lastName[0] ?? ""}`;

  return (
    <li className="flex items-center justify-between gap-4 rounded-md border">
      <div className="flex items-center gap-4 p-3">
        <Avatar>
          <AvatarImage src={currentUser.imageUrl} alt={userInitials} />
          <AvatarFallback>{userInitials}</AvatarFallback>
        </Avatar>
        <div>
          <h4 className={cn(typography({ variant: "p" }), "font-medium")}>
            {currentUser.firstName} {currentUser.lastName}
          </h4>
          {!isNil(currentUser.username) ? (
            <p className={typography({ variant: "muted" })}>
              @{currentUser.username}
            </p>
          ) : null}
        </div>
      </div>
      <Tooltip>
        {isShowingRequests ? (
          <AddFriendButton
            username={currentUser.username}
            fromUserId={fromUserId}
            toUserId={currentUser.id}
          />
        ) : (
          <DeleteConfirmationDialog
            isShowingSentRequests={isShowingSentRequests}
            fromUserId={fromUserId}
            toUserId={currentUser.id}
          />
        )}
        <TooltipContent side="bottom">
          <span>
            {isShowingRequests
              ? "Add friend"
              : isShowingSentRequests
                ? "Delete sent request"
                : "Delete friend"}
          </span>
        </TooltipContent>
      </Tooltip>
    </li>
  );
}

export default async function Friends({
  searchParams,
}: {
  searchParams: {
    "add-friend": string | undefined;
    "show-requests": string | undefined;
    search: string | undefined;
  };
}) {
  const user = await currentUser();

  if (isNil(user)) {
    redirect("/sign-in");
  }

  let users: UserType[] = [];
  let friendIds: string[] = [];
  const friendRequestSent = await getFriendRequestsSent(user.id);
  const friendRequestSentIds = friendRequestSent.map((friend) => friend.userId);
  const isShowingRequests = searchParams["show-requests"] === "received";
  const isShowingSentRequests = searchParams["show-requests"] === "sent";

  if (isShowingRequests) {
    const friends = await getFriendRequests(user.id);
    friendIds = friends.map((friend) => friend.userId);
  } else if (isShowingSentRequests) {
    friendIds = friendRequestSentIds;
  } else {
    const friends = await getFriends(user.id);
    friendIds = friends.map((friend) => friend.userId);
  }

  if (size(friendIds) > 0) {
    users = await clerkClient.users.getUserList({
      userId: friendIds,
      query: searchParams["search"],
    });
  }

  return (
    <>
      <DashboardTabs activeTab="Friends" />
      <main className="container h-full space-y-10">
        <div className="space-y-5">
          <div className="flex flex-col items-end justify-between gap-4 md:flex-row-reverse md:items-center">
            <AddFriendCommand
              userId={user.id}
              addFriendParam={searchParams["add-friend"]}
              friendIds={friendIds}
              friendRequestSentIds={friendRequestSentIds}
            />
            <SearchInput
              initialValue={searchParams["search"] ?? ""}
              placeholder="Search friends"
            />
          </div>
          <FriendsToggle
            isShowingRequests={isShowingRequests}
            isShowingSentRequests={isShowingSentRequests}
          />
        </div>

        {size(users) > 0 ? (
          <TooltipProvider>
            <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {users.map((currentUser) => {
                return (
                  <User
                    key={currentUser.id}
                    fromUserId={user.id}
                    currentUser={currentUser}
                    isShowingRequests={isShowingRequests}
                    isShowingSentRequests={isShowingSentRequests}
                  />
                );
              })}
            </ul>
          </TooltipProvider>
        ) : isShowingRequests || isShowingSentRequests ? (
          <>
            <p
              className={cn(
                typography({ variant: "h3" }),
                "mb-2 mt-4 text-center"
              )}
            >
              You are all caught up!
            </p>
            <p className={cn(typography({ variant: "muted" }), "text-center")}>
              If you have {isShowingSentRequests ? "sent" : ""} any{" "}
              {isShowingRequests ? "pending" : ""} friend requests, they will
              show up here.
            </p>
          </>
        ) : (
          <>
            <p
              className={cn(
                typography({ variant: "h3" }),
                "mb-2 mt-4 text-center"
              )}
            >
              You don&apos;t have any friends yet :&#40;
            </p>
            <p className={cn(typography({ variant: "muted" }), "text-center")}>
              Click on the add friend button to add some friends
            </p>
          </>
        )}
      </main>
    </>
  );
}
