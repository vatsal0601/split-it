import { redirect } from "next/navigation";
import { clerkClient, currentUser } from "@clerk/nextjs";
import type { User } from "@clerk/nextjs/server";
import flatten from "lodash/flatten";
import isEmpty from "lodash/isEmpty";
import isNil from "lodash/isNil";
import size from "lodash/size";

import { cn } from "@/lib/utils";
import {
  getFriendRequests,
  getFriendRequestsSent,
  getFriends,
} from "@/db/friends";
import { DashboardTabs } from "@/components/dashboard-tabs";
import { FriendsToggle } from "@/components/friends-client-components";
import {
  AddFriendCommand,
  UserFriend,
} from "@/components/friends-server-components";
import { SearchInput } from "@/components/search-input";
import { TooltipProvider } from "@/components/ui/tooltip";
import { typography } from "@/components/ui/typography";

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

  let users: User[] = [];
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
    friendIds = flatten(
      friends.map((friend) => [friend.fromUserId, friend.toUserId])
    );
  }

  if (size(friendIds) > 0) {
    users = await clerkClient.users.getUserList({
      userId: friendIds,
      query: searchParams["search"],
    });
  }

  users = users.filter((searchUser) => searchUser.id !== user.id);

  return (
    <>
      <DashboardTabs activeTab="Friends" />
      <main className="container min-h-full space-y-10 pb-32">
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
                  <UserFriend
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
          <div>
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
          </div>
        ) : !isEmpty(searchParams["search"]) ? (
          <div>
            <p
              className={cn(
                typography({ variant: "h3" }),
                "mb-2 mt-4 text-center"
              )}
            >
              No results found
            </p>
            <p className={cn(typography({ variant: "muted" }), "text-center")}>
              We couldn&apos;t find any users matching your search query.
            </p>
          </div>
        ) : (
          <div>
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
          </div>
        )}
      </main>
    </>
  );
}
