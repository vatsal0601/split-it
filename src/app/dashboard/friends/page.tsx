import { redirect } from "next/navigation";
import { clerkClient, currentUser } from "@clerk/nextjs";
import { type User as UserType } from "@clerk/nextjs/server";
import isNil from "lodash/isNil";
import size from "lodash/size";
import { UserMinusIcon, UserPlusIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  getFriendRequests,
  getFriendRequestsSent,
  getFriends,
} from "@/db/friends";
import {
  AddFriendCommand,
  AddFriendInput,
  CommandUser,
  DeleteConfirmationDialog,
  FriendsDropdownMenu,
} from "@/components/add-friend-components";
import { DashboardTabs } from "@/components/dashboard-tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  CommandEmpty,
  CommandGroup,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { typography } from "@/components/ui/typography";

function User({
  user,
  fromUserId,
  isShowingRequests,
  isShowingSentRequests,
}: {
  user: UserType;
  fromUserId: string;
  isShowingRequests: boolean;
  isShowingSentRequests: boolean;
}) {
  const firstName = user.firstName ?? "";
  const lastName = user.lastName ?? "";
  const userInitials = `${firstName[0] ?? ""}${lastName[0] ?? ""}`;

  return (
    <li className="flex items-center justify-between gap-4 rounded-md border">
      <div className="flex items-center gap-4 p-3">
        <Avatar>
          <AvatarImage src={user.imageUrl} alt={userInitials} />
          <AvatarFallback>{userInitials}</AvatarFallback>
        </Avatar>
        <div>
          <h4 className={cn(typography({ variant: "p" }), "font-medium")}>
            {user.firstName} {user.lastName}
          </h4>
          {!isNil(user.username) ? (
            <p className={typography({ variant: "muted" })}>@{user.username}</p>
          ) : null}
        </div>
      </div>
      <Tooltip>
        <TooltipTrigger asChild>
          {isShowingRequests ? (
            <button className="flex h-full items-center justify-center rounded-r-md border-l px-3 transition-colors hover:bg-primary/90 hover:text-primary-foreground">
              <UserPlusIcon className="h-6 w-6" />
            </button>
          ) : (
            <DeleteConfirmationDialog
              isShowingSentRequests={isShowingSentRequests}
              fromUserId={fromUserId}
              toUserId={user.id}
            >
              <button className="flex h-full items-center justify-center rounded-r-md border-l px-3 transition-colors hover:bg-destructive/90 hover:text-destructive-foreground">
                <UserMinusIcon className="h-6 w-6" />
              </button>
            </DeleteConfirmationDialog>
          )}
        </TooltipTrigger>
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
  searchParams: { "add-friend": string; "show-requests": string };
}) {
  const user = await currentUser();

  if (isNil(user)) {
    redirect("/sign-in");
  }

  let users: UserType[] = [];
  let friendIds:
    | Awaited<ReturnType<typeof getFriends>>
    | Awaited<ReturnType<typeof getFriendRequests>> = [];
  let searchUsers: UserType[] = [];
  const friendRequestSent = await getFriendRequestsSent(user.id);
  const friendRequestSentIds = friendRequestSent.map((friend) => friend.userId);
  const isShowingRequests = searchParams["show-requests"] === "received";
  const isShowingSentRequests = searchParams["show-requests"] === "sent";

  if (isShowingRequests) {
    friendIds = await getFriendRequests(user.id);
  } else if (isShowingSentRequests) {
    friendIds = friendRequestSent;
  } else {
    friendIds = await getFriends(user.id);
  }

  if (size(friendIds) > 0) {
    users = await clerkClient.users.getUserList({
      userId: friendIds.map((friend) => friend.userId),
    });
  }

  if (!isNil(searchParams["add-friend"])) {
    if (searchParams["add-friend"] === "true")
      searchUsers = await clerkClient.users.getUserList({
        limit: 10,
      });
    else
      searchUsers = await clerkClient.users.getUserList({
        query: searchParams["add-friend"],
        limit: 10,
      });
  }

  // Remove current user from search results and to whom friend request has been sent
  searchUsers = searchUsers.filter((searchUser) => {
    if (friendRequestSentIds.includes(searchUser.id)) return false;
    if (searchUser.id === user.id) return false;
    return true;
  });

  return (
    <>
      <DashboardTabs activeTab="Friends" />
      <main className="container h-full">
        <div className="mb-10 flex flex-col items-end justify-between gap-4 md:flex-row-reverse md:items-center">
          <div className="flex items-center gap-4">
            <FriendsDropdownMenu
              isShowingRequests={isShowingRequests}
              isShowingSentRequests={isShowingSentRequests}
            />
            <AddFriendCommand
              isCommandOpen={!isNil(searchParams["add-friend"])}
            >
              <AddFriendInput initialValue={searchParams["add-friend"] ?? ""} />
              <CommandList className="my-2 transition-[height]">
                <CommandEmpty>No results found</CommandEmpty>
                <CommandGroup>
                  {size(searchUsers) > 0 ? (
                    <p className={cn(typography({ variant: "muted" }), "mb-2")}>
                      Click on the user or press enter to send them friend
                      request
                    </p>
                  ) : null}
                  {searchUsers.map((searchUser) => {
                    const firstName = searchUser.firstName ?? "";
                    const lastName = searchUser.lastName ?? "";
                    const userInitials = `${firstName[0] ?? ""}${
                      lastName[0] ?? ""
                    }`;

                    return (
                      <CommandUser
                        key={searchUser.id}
                        fromUserId={user.id}
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
              </CommandList>
            </AddFriendCommand>
          </div>
          <Input placeholder="Search friends" className="md:max-w-lg" />
        </div>

        {size(users) > 0 ? (
          <TooltipProvider>
            <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {users.map((user) => {
                return (
                  <User
                    key={user.id}
                    fromUserId={user.id}
                    user={user}
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
