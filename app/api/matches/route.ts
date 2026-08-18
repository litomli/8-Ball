import { NextResponse } from "next/server"

import { db } from "@/lib/db"
import { getRecentMatches, validateMatch } from "@/lib/matches"

// No auth by design: anyone with the link may read and record matches.
export async function GET() {
  const matches = await getRecentMatches()
  return NextResponse.json(matches)
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as {
    winner?: unknown
    loser?: unknown
  } | null

  const winner = typeof body?.winner === "string" ? body.winner : ""
  const loser = typeof body?.loser === "string" ? body.loser : ""

  const error = validateMatch({ winner, loser })
  if (error) {
    return NextResponse.json({ error }, { status: 422 })
  }

  const match = await db.match.create({ data: { winner, loser } })
  return NextResponse.json(match, { status: 201 })
}
