// ============================================================================
// STATUS: Reference module — NOT currently imported by app/api/interview/route.ts
//
// The live API route implements equivalent logic inline (tested and fixed
// against two production bugs: session persistence via Vercel KV instead of
// in-memory storage, and file access patterns safe for Vercel serverless).
// Before wiring this file into the live route, it needs the same two fixes:
//   1. Any fs.readFileSync() file reads should become static imports
//      (e.g. `import curriculum from "@/public/curriculum.json"`) so
//      Vercel's build reliably bundles the file.
//   2. Any in-memory Map-based session storage should be replaced with
//      Vercel KV (see route.ts for the working pattern) so sessions
//      survive server restarts.
// Kept here as clean reference structure for future integration.
// ============================================================================

// ============================================================================
// Curriculum loading + lookup helpers.
//
// Reads the REAL public/curriculum.json shape:
//   { cohort: string, modules: [{ n, title, days: [start, end] }],
//     days: [{ day, title, type, tools, objectives }] }
//
// There is no "difficulty" field anywhere in the source data, so nothing
// here invents one. If a caller wants a rough proxy for difficulty, the
// module index (`n`) a day falls under is the closest honest signal
// (curriculum is sequenced, later modules build on earlier ones) — exposed
// via getModuleForDay(), left for the caller to use or ignore.
// ============================================================================

import fs from "fs";
import path from "path";
import type { RawCurriculumDay, RawCurriculumFile, RawCurriculumModule } from "./types";

let cache: RawCurriculumFile | null = null;

function loadCurriculumFile(): RawCurriculumFile {
  if (cache) return cache;
  const filePath = path.join(process.cwd(), "public", "curriculum.json");
  const raw = fs.readFileSync(filePath, "utf-8");
  cache = JSON.parse(raw) as RawCurriculumFile;
  return cache;
}

/** Full curriculum object, as-is from curriculum.json. */
export function getCurriculum(): RawCurriculumFile {
  return loadCurriculumFile();
}

/** Look up a single day's detail by day number. Returns null if not found. */
export function getCurriculumDay(dayNumber: number): RawCurriculumDay | null {
  const curriculum = loadCurriculumFile();
  return curriculum.days.find((d) => d.day === dayNumber) ?? null;
}

/** Look up several days at once, skipping any day numbers not found. */
export function getCurriculumDays(dayNumbers: number[]): RawCurriculumDay[] {
  const curriculum = loadCurriculumFile();
  const byDay = new Map(curriculum.days.map((d) => [d.day, d]));
  return dayNumbers
    .map((n) => byDay.get(n))
    .filter((d): d is RawCurriculumDay => d !== undefined);
}

/** Find which module a given day belongs to (by day range), or null. */
export function getModuleForDay(dayNumber: number): RawCurriculumModule | null {
  const curriculum = loadCurriculumFile();
  return (
    curriculum.modules.find(
      (m) => dayNumber >= m.days[0] && dayNumber <= m.days[1]
    ) ?? null
  );
}
