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

export const friends = pgTable("friends", {
  id: uuid("id").defaultRandom().primaryKey(),
  fromUserId: varchar("from_user_id", { length: 256 }).notNull(),
  toUserId: varchar("to_user_id", { length: 256 }).notNull(),
  status: friendStatus("friend_status").default("pending").notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

export const transactions = pgTable("transactions", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title"),
  fromUserId: varchar("from_user_id", { length: 256 }).notNull(),
  toUserId: varchar("to_user_id", { length: 256 }).notNull(),
  amount: decimal("amount").notNull(),
  isSettled: boolean("is_settled").default(false).notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});
