import { clerkClient } from "@clerk/nextjs";
import type { User as UserType } from "@clerk/nextjs/server";
import isNil from "lodash/isNil";
import size from "lodash/size";
import { UserMinusIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  AddFriendCommand,
  AddFriendInput,
  CommandUser,
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

function User({ user }: { user: UserType }) {
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
          <button className="flex h-full items-center justify-center rounded-r-md border-l px-3 transition-colors hover:bg-destructive/90 hover:text-destructive-foreground">
            <UserMinusIcon className="h-6 w-6" />
          </button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <span>Remove friend</span>
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
  const users = await clerkClient.users.getUserList();
  let searchUsers: UserType[] = [];

  if (!isNil(searchParams["add-friend"]))
    searchUsers = await clerkClient.users.getUserList({
      query: searchParams["add-friend"],
    });
  else searchUsers = users;

  const isShowingRequests = searchParams["show-requests"] === "true";

  return (
    <>
      <DashboardTabs activeTab="Friends" />
      <main className="container h-full">
        <div className="mb-10 flex flex-col items-end justify-between gap-4 md:flex-row-reverse md:items-center">
          <div className="flex items-center gap-4">
            <FriendsDropdownMenu isShowingRequests={isShowingRequests} />
            <AddFriendCommand initialValue={!isNil(searchParams["add-friend"])}>
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
                  {searchUsers.map((user) => {
                    const firstName = user.firstName ?? "";
                    const lastName = user.lastName ?? "";
                    const userInitials = `${firstName[0] ?? ""}${
                      lastName[0] ?? ""
                    }`;

                    return (
                      <CommandUser
                        key={user.id}
                        firstName={firstName}
                        lastName={lastName}
                        username={user.username}
                        userInitials={userInitials}
                        prfileImage={user.imageUrl}
                      />
                    );
                  })}
                </CommandGroup>
              </CommandList>
            </AddFriendCommand>
          </div>
          <Input placeholder="Search friends" className="md:max-w-lg" />
        </div>
        <TooltipProvider>
          <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {users.map((user) => {
              return <User key={user.id} user={user} />;
            })}
          </ul>
        </TooltipProvider>
      </main>
    </>
  );
}
