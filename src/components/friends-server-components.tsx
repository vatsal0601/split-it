import * as React from "react";
import { clerkClient } from "@clerk/nextjs";
import { type User as UserType } from "@clerk/nextjs/server";
import isNil from "lodash/isNil";
import size from "lodash/size";

import { cn } from "@/lib/utils";
import {
  AddFriendButton,
  DeleteConfirmationDialog,
} from "@/components/friends-client-components";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  CommandEmpty,
  CommandGroup,
  CommandList,
} from "@/components/ui/command";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent } from "@/components/ui/tooltip";
import { typography } from "@/components/ui/typography";
import {
  AddFriendCommand as AddFriendClientCommand,
  AddFriendInput,
  CommandUser,
} from "./friends-client-components";

async function AddFriendCommandInternal({
  userId,
  addFriendParam,
  friendIds,
  friendRequestSentIds,
}: {
  userId: string;
  addFriendParam: string | undefined;
  friendIds: string[];
  friendRequestSentIds: string[];
}) {
  let searchUsers: UserType[] = [];

  if (!isNil(addFriendParam)) {
    if (addFriendParam === "true")
      searchUsers = await clerkClient.users.getUserList({
        limit: 10,
      });
    else
      searchUsers = await clerkClient.users.getUserList({
        query: addFriendParam,
        limit: 10,
      });
  }

  // Remove current user from search results and to whom friend request has been sent
  searchUsers = searchUsers.filter((searchUser) => {
    if (friendIds.includes(searchUser.id)) return false;
    if (friendRequestSentIds.includes(searchUser.id)) return false;
    if (searchUser.id === userId) return false;
    return true;
  });

  if (size(searchUsers) > 0) {
    return (
      <CommandGroup>
        <p className={cn(typography({ variant: "muted" }), "mb-2")}>
          Click on the user or press enter to send them friend request
        </p>
        {searchUsers.map((searchUser) => {
          const firstName = searchUser.firstName ?? "";
          const lastName = searchUser.lastName ?? "";
          const userInitials = `${firstName[0] ?? ""}${lastName[0] ?? ""}`;

          return (
            <CommandUser
              key={searchUser.id}
              fromUserId={userId}
              toUserId={searchUser.id}
              firstName={firstName}
              lastName={lastName}
              username={searchUser.username}
              userInitials={userInitials}
              prfileImage={searchUser.imageUrl}
            />
          );
        })}
      </CommandGroup>
    );
  }

  return null;
}

export function AddFriendCommand({
  userId,
  addFriendParam,
  friendIds,
  friendRequestSentIds,
}: {
  userId: string;
  addFriendParam: string | undefined;
  friendIds: string[];
  friendRequestSentIds: string[];
}) {
  return (
    <AddFriendClientCommand isCommandOpen={!isNil(addFriendParam)}>
      <AddFriendInput initialValue={addFriendParam === "true" ? "" : ""} />
      <CommandList className="my-2 transition-[height]">
        <CommandEmpty>
          <p className="px-2">No results found</p>
        </CommandEmpty>
        <React.Suspense
          fallback={
            <div className="space-y-2">
              <Skeleton className="m-2 mt-5 h-14 w-full" />
              <Skeleton className="m-2 mt-5 h-14 w-full" />
              <Skeleton className="m-2 mt-5 h-14 w-full" />
            </div>
          }
        >
          <AddFriendCommandInternal
            userId={userId}
            addFriendParam={addFriendParam}
            friendIds={friendIds}
            friendRequestSentIds={friendRequestSentIds}
          />
        </React.Suspense>
      </CommandList>
    </AddFriendClientCommand>
  );
}

export function UserFriend({
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
    <li className="flex items-center justify-between gap-4 rounded-md border p-3">
      <div className="flex items-center gap-4">
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
