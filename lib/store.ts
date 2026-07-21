import "server-only";

import type { BikeRecord, PublicBikeRecord } from "@/lib/types";
import { daysSinceInBrussels } from "@/lib/days";

const RECORD_KEY = "broken-bike:current-record";
const DEFAULT_BROKEN_AT = "2026-07-14T22:00:00.000Z";

function redisConfig() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) return null;
  return { url, token };
}

async function redis(command: string[]) {
  const config = redisConfig();
  if (!config) return null;

  const response = await fetch(`${config.url}/${command.map(encodeURIComponent).join("/")}`, {
    headers: { Authorization: `Bearer ${config.token}` },
    cache: "no-store",
  });

  if (!response.ok) throw new Error("Could not reach the bike record store.");
  return response.json() as Promise<{ result: string | null }>;
}

function recordFromEnvironment(): BikeRecord | null {
  const configuredDate = process.env.INITIAL_BROKEN_AT;
  const brokenAt = configuredDate && !Number.isNaN(new Date(configuredDate).getTime()) ? configuredDate : DEFAULT_BROKEN_AT;
  return { brokenAt: new Date(brokenAt).toISOString(), note: "The current streak began." };
}

export async function getBikeRecord(): Promise<PublicBikeRecord | null> {
  const response = await redis(["get", RECORD_KEY]);
  const rawRecord = response?.result;
  const record = rawRecord ? (JSON.parse(rawRecord) as BikeRecord) : recordFromEnvironment();

  if (!record) return null;

  const daysBroken = daysSinceInBrussels(record.brokenAt);
  return { ...record, daysBroken };
}

export async function saveBikeRecord(note: string): Promise<BikeRecord> {
  if (!redisConfig()) throw new Error("Storage is not configured.");

  const record: BikeRecord = { brokenAt: new Date().toISOString(), note };
  await redis(["set", RECORD_KEY, JSON.stringify(record)]);
  return record;
}
