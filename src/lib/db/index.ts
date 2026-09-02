import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const rawConnectionString =
  process.env.POSTGRES_URL || "postgresql://dummy:dummy@localhost:5432/dummy";

function isPlaceholderUrl(s: string): boolean {
  return (
    !s ||
    s.includes("[PROJECT-REF]") ||
    s.includes("[PASSWORD]") ||
    s.includes("[REGION]") ||
    s.includes("[REDACTED") ||
    s.includes("[SENSITIVE") ||
    s.includes("postgres.example") ||
    s.includes("example.supabase.co")
  );
}

const connectionString = isPlaceholderUrl(rawConnectionString)
  ? "postgresql://dummy:dummy@localhost:5432/dummy"
  : rawConnectionString;

let client: ReturnType<typeof postgres>;
try {
  client = postgres(connectionString, { prepare: false });
} catch {
  client = postgres("postgresql://dummy:dummy@localhost:5432/dummy", { prepare: false });
}

export const db = drizzle(client, { schema });

export async function closeDb(): Promise<void> {
  await client.end();
}
