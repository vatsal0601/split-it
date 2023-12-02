import {
  boolean,
  decimal,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const friendStatus = pgEnum("friend_status", [
  "pending",
  "accepted",
  "rejected",
]);

export const transactionStatus = pgEnum("transaction_status", [
  "owe",
  "owed",
  "settled",
]);

export const activityStatus = pgEnum("activity_status", [
  "created",
  "updated",
  "deleted",
]);

export const friends = pgTable("friends", {
  id: uuid("id").defaultRandom().primaryKey(),
  fromUserId: varchar("from_user_id", { length: 256 }).notNull(),
  toUserId: varchar("to_user_id", { length: 256 }).notNull(),
  status: friendStatus("friend_status").default("pending").notNull(),
  isDeleted: boolean("is_deleted").default(false).notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

export const groups = pgTable("groups", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  createdBy: varchar("created_by", { length: 256 }).notNull(),
  isDeleted: boolean("is_deleted").default(false).notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

export const groupMembers = pgTable("group_members", {
  id: uuid("id").defaultRandom().primaryKey(),
  groupId: uuid("group_id").notNull(),
  userId: varchar("user_id", { length: 256 }).notNull(),
  isDeleted: boolean("is_deleted").default(false).notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

export const transactions = pgTable("transactions", {
  id: uuid("id").defaultRandom().primaryKey(),
  groupId: uuid("group_id"),
  title: text("title"),
  createdBy: varchar("created_by", { length: 256 }).notNull(),
  isDeleted: boolean("is_deleted").default(false).notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

export const activities = pgTable("activities", {
  id: uuid("id").defaultRandom().primaryKey(),
  transactionId: uuid("transaction_id").notNull(),
  createdBy: varchar("created_by", { length: 256 }).notNull(),
  createdFor: varchar("created_for", { length: 256 }).notNull(),
  amount: decimal("amount").notNull(),
  status: activityStatus("activity_status").default("created").notNull(),
  type: transactionStatus("transaction_status").notNull(),
  isDeleted: boolean("is_deleted").default(false).notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});
