import { and, desc, eq, or } from "drizzle-orm";

import { db } from "./index";
import { groupMembers, groups } from "./schema";

export async function getGroups(userId: string) {
  return db
    .select({
      id: groupMembers.groupId,
      name: groups.name,
      createdAt: groups.createdAt,
    })
    .from(groupMembers)
    .innerJoin(groups, eq(groupMembers.groupId, groups.id))
    .where(
      and(
        eq(groupMembers.userId, userId),
        eq(groupMembers.isDeleted, false),
        eq(groups.isDeleted, false)
      )
    )
    .orderBy(desc(groupMembers.updatedAt));
}
