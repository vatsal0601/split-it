import { and, eq } from "drizzle-orm";

import { db } from "./index";
import { friends } from "./schema";

export async function getFriends(userId: string) {
  return db
    .select({
      userId: friends.toUserId,
    })
    .from(friends)
    .where(
      and(
        eq(friends.fromUserId, userId),
        eq(friends.status, "accepted"),
        eq(friends.isDeleted, false)
      )
    );
}

export async function getFriendRequests(userId: string) {
  return db
    .select({
      userId: friends.fromUserId,
    })
    .from(friends)
    .where(
      and(
        eq(friends.toUserId, userId),
        eq(friends.status, "pending"),
        eq(friends.isDeleted, false)
      )
    );
}

export async function getFriendRequestsSent(userId: string) {
  return db
    .select({
      userId: friends.toUserId,
    })
    .from(friends)
    .where(
      and(
        eq(friends.fromUserId, userId),
        eq(friends.status, "pending"),
        eq(friends.isDeleted, false)
      )
    );
}

export async function sendFriendRequest({
  fromUserId,
  toUserId,
}: {
  fromUserId: string;
  toUserId: string;
}) {
  return db.insert(friends).values({ fromUserId, toUserId });
}

export async function acceptFriendRequest({
  fromUserId,
  toUserId,
}: {
  fromUserId: string;
  toUserId: string;
}) {
  return db
    .update(friends)
    .set({ status: "accepted" })
    .where(
      and(
        eq(friends.fromUserId, fromUserId),
        eq(friends.toUserId, toUserId),
        eq(friends.status, "pending")
      )
    );
}

export async function deleteFriend({
  fromUserId,
  toUserId,
}: {
  fromUserId: string;
  toUserId: string;
}) {
  return db
    .update(friends)
    .set({ isDeleted: true })
    .where(
      and(
        eq(friends.fromUserId, fromUserId),
        eq(friends.toUserId, toUserId),
        eq(friends.status, "accepted")
      )
    );
}

export async function deleteFriendRequest({
  fromUserId,
  toUserId,
}: {
  fromUserId: string;
  toUserId: string;
}) {
  return db
    .update(friends)
    .set({ isDeleted: true })
    .where(
      and(
        eq(friends.fromUserId, fromUserId),
        eq(friends.toUserId, toUserId),
        eq(friends.status, "pending")
      )
    );
}
