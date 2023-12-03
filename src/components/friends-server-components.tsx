import { clerkClient } from "@clerk/nextjs";
import { type User as UserType } from "@clerk/nextjs/server";
import isNil from "lodash/isNil";
import size from "lodash/size";

import { cn } from "@/lib/utils";
import {
  CommandEmpty,
  CommandGroup,
  CommandList,
} from "@/components/ui/command";
import { typography } from "@/components/ui/typography";
import {
  AddFriendCommand as AddFriendClientCommand,
  AddFriendInput,
  CommandUser,
} from "./friends-client-components";

export async function AddFriendCommand({
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

  return (
    <AddFriendClientCommand isCommandOpen={!isNil(addFriendParam)}>
      <AddFriendInput initialValue={addFriendParam === "true" ? "" : ""} />
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
        ) : null}
      </CommandList>
    </AddFriendClientCommand>
  );
}
