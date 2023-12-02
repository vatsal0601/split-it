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
import {
  AddFriendButton,
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
        <TooltipTrigger asChild>
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
  let friendIds: string[] = [];
  let searchUsers: UserType[] = [];
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
    users = await clerkClient.users.getUserList({ userId: friendIds });
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
    if (friendIds.includes(searchUser.id)) return false;
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
                <CommandEmpty>
                  <p className="px-2">
                    {size(searchUsers) > 0
                      ? "No results found"
                      : "You've either added all our users to your friend list or have sent friend request to them"}
                  </p>
                </CommandEmpty>
                {size(searchUsers) > 0 ? (
                  <CommandGroup>
                    <p className={cn(typography({ variant: "muted" }), "mb-2")}>
                      Click on the user or press enter to send them friend
                      request
                    </p>
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
                ) : null}
              </CommandList>
            </AddFriendCommand>
          </div>
          <Input placeholder="Search friends" className="md:max-w-lg" />
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
