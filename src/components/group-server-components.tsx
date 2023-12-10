import { clerkClient } from "@clerk/nextjs";
import type { User } from "@clerk/nextjs/server";
import flatten from "lodash/flatten";
import isNil from "lodash/isNil";

import { getFriends } from "@/db/friends";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  CreateGroupDialog as CreateClientGroupDialog,
  GroupDialogContent,
} from "./group-client-components";

export async function CreateGroupDialog({
  userId,
  createGroupParam,
}: {
  userId: string;
  createGroupParam: string | undefined;
}) {
  let friendIds: string[] = [];
  let users: User[] = [];

  if (!isNil(createGroupParam)) {
    const friends = await getFriends(userId);
    friendIds = flatten(
      friends.map((friend) => [friend.fromUserId, friend.toUserId])
    );
    if (createGroupParam === "true")
      users = await clerkClient.users.getUserList({
        userId: friendIds,
        limit: 10,
      });
    else
      users = await clerkClient.users.getUserList({
        userId: friendIds,
        query: createGroupParam,
        limit: 10,
      });
  }

  users = users.filter((user) => user.id !== userId);
  const dialogUsers = users.map((user) => ({
    id: user.id,
    prfileImage: user.imageUrl,
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
  }));

  return (
    <CreateClientGroupDialog isDialogOpen={!isNil(createGroupParam)}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create new group</DialogTitle>
          <DialogDescription>
            Add your friends to a group and make your transactions/activities
            organized.
          </DialogDescription>
        </DialogHeader>
        <GroupDialogContent users={dialogUsers} />
      </DialogContent>
    </CreateClientGroupDialog>
  );
}
