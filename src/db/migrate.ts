import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

import "dotenv/config";

const sql = postgres(process.env.DRIZZLE_DATABASE_URL!, { max: 1 });
const db = drizzle(sql);

async function main() {
  console.log("Migrating...");
  await migrate(db, { migrationsFolder: "./src/db/migrations" });
  console.log("Done!");
}
main();
