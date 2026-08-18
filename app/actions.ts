"use server"

import { revalidatePath } from "next/cache"

import { db } from "@/lib/db"
import { validateMatch } from "@/lib/matches"

export type RecordMatchResult = { error?: string; success?: boolean }

// No auth by design: anyone with the link may record a match.
export async function recordMatch(
  winner: string,
  loser: string
): Promise<RecordMatchResult> {
  const error = validateMatch({ winner, loser })
  if (error) {
    return { error }
  }

  await db.match.create({ data: { winner, loser } })

  revalidatePath("/")
  revalidatePath("/leaderboard")

  return { success: true }
}
