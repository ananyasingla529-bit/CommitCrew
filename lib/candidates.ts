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
// Candidate loading + transform into Structure 1 (Candidate).
//
// public/candidates.json's REAL shape (confirmed by inspection) is:
//
//   {
//     "candidates": [
//       {
//         "member": { "id", "name", "jobRole", "yearsExperience", "education", "status" },
//         "missions": [
//           { "day", "title", "passed": true,  "attempts": N }   // completed
//           { "day", "title", "passed": false, "attempts": N }   // failed
//           { "day", "title", "skipped": true }                 // skipped
//         ],
//         "signals": { "commitDays", "missionsCompleted", "missionsFirstTry" }
//       },
//       ...
//     ]
//   }
//
// There is NO flat `completedDays` / `skippedDays` / `failedDays` array and
// NO `dayDetails` map in the raw file — those are Structure 1 fields that
// Person 3 designed. This file builds them explicitly from `missions[]`
// (cross-referenced with curriculum.json for the day detail), rather than
// assuming they already exist.
//
// Explicit field mapping (raw -> Structure 1):
//   member.id                          -> candidateId
//   member.name                        -> name
//   missions[].passed === true         -> pushed into completedDays
//   missions[].skipped === true        -> pushed into skippedDays
//   missions[].passed === false        -> pushed into failedDays
//   curriculum.json day (via day #)    -> dayDetails["<day>"]
//   member.jobRole/yearsExperience/
//     education/status, signals        -> extra (pass-through, see types.ts)
// ============================================================================

import fs from "fs";
import path from "path";
import type {
  Candidate,
  CandidateDayDetail,
  RawCandidateEntry,
  RawCandidatesFile,
} from "./types";
import { getCurriculumDay } from "./curriculum";

let cache: RawCandidatesFile | null = null;

function loadCandidatesFile(): RawCandidatesFile {
  if (cache) return cache;
  const filePath = path.join(process.cwd(), "public", "candidates.json");
  const raw = fs.readFileSync(filePath, "utf-8");
  cache = JSON.parse(raw) as RawCandidatesFile;
  return cache;
}

/**
 * Transform one raw candidate entry (member + missions + signals) into the
 * Structure 1 Candidate shape. Pure function — no I/O — so it's easy to
 * unit test against the sample entries you already reviewed.
 */
export function transformCandidate(raw: RawCandidateEntry): Candidate {
  const completedDays: number[] = [];
  const skippedDays: number[] = [];
  const failedDays: number[] = [];
  const dayDetails: Record<string, CandidateDayDetail> = {};

  for (const mission of raw.missions) {
    if (mission.skipped === true) {
      skippedDays.push(mission.day);
    } else if (mission.passed === true) {
      completedDays.push(mission.day);
    } else if (mission.passed === false) {
      failedDays.push(mission.day);
    }
    // Note: a mission always falls into exactly one of the three buckets
    // above under the real data — skipped missions never carry `passed`.

    const curriculumDay = getCurriculumDay(mission.day);
    if (curriculumDay) {
      dayDetails[String(mission.day)] = {
        dayNumber: curriculumDay.day,
        title: curriculumDay.title,
        type: curriculumDay.type,
        tools: curriculumDay.tools,
        objectives: curriculumDay.objectives,
      };
    } else {
      // Curriculum day not found (shouldn't happen with current data, but
      // don't silently drop the mission — fall back to what we know from
      // the mission entry itself).
      dayDetails[String(mission.day)] = {
        dayNumber: mission.day,
        title: mission.title,
        type: "UNKNOWN",
        tools: [],
        objectives: [],
      };
    }
  }

  return {
    candidateId: raw.member.id,
    name: raw.member.name,
    completedDays,
    skippedDays,
    failedDays,
    dayDetails,
    extra: {
      jobRole: raw.member.jobRole,
      yearsExperience: raw.member.yearsExperience,
      education: raw.member.education,
      status: raw.member.status,
      signals: raw.signals,
    },
  };
}

/** Get every candidate, transformed into Structure 1. */
export function getAllCandidates(): Candidate[] {
  const file = loadCandidatesFile();
  return file.candidates.map(transformCandidate);
}

/** Get a single candidate by id, transformed into Structure 1. Null if not found. */
export function getCandidate(candidateId: string): Candidate | null {
  const file = loadCandidatesFile();
  const raw = file.candidates.find((c) => c.member.id === candidateId);
  return raw ? transformCandidate(raw) : null;
}
