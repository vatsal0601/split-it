import { and, desc, eq, or } from "drizzle-orm";

import { db } from "./index";
import { friends } from "./schema";

export async function getFriends(userId: string) {
  return db
    .select({
      toUserId: friends.toUserId,
      fromUserId: friends.fromUserId,
    })
    .from(friends)
    .where(
      and(
        or(eq(friends.fromUserId, userId), eq(friends.toUserId, userId)),
        eq(friends.status, "accepted"),
        eq(friends.isDeleted, false)
      )
    )
    .orderBy(desc(friends.updatedAt));
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
    )
    .orderBy(desc(friends.updatedAt));
}

export async function getFirst5FriendRequests(userId: string) {
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
    )
    .limit(5)
    .orderBy(desc(friends.updatedAt));
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
    )
    .orderBy(desc(friends.updatedAt));
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
  // reverse the fromUserId and toUserId because the request is from the other user
  return db
    .update(friends)
    .set({ status: "accepted", updatedAt: new Date() })
    .where(
      and(
        eq(friends.fromUserId, toUserId),
        eq(friends.toUserId, fromUserId),
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
    .set({ isDeleted: true, updatedAt: new Date() })
    .where(
      or(
        and(
          eq(friends.fromUserId, fromUserId),
          eq(friends.toUserId, toUserId),
          eq(friends.status, "accepted")
        ),
        and(
          eq(friends.fromUserId, toUserId),
          eq(friends.toUserId, fromUserId),
          eq(friends.status, "accepted")
        )
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
    .set({ isDeleted: true, updatedAt: new Date() })
    .where(
      and(
        eq(friends.fromUserId, fromUserId),
        eq(friends.toUserId, toUserId),
        eq(friends.status, "pending")
      )
    );
}
