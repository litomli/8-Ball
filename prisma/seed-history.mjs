// One-off backfill of historical win/loss totals. Only per-player totals were
// known, so the opponent in each row is synthesized to satisfy those totals.
import { PrismaClient } from "@prisma/client"

const TOTALS = {
  Cody: { wins: 7, losses: 10 },
  Neo: { wins: 2, losses: 4 },
  Lynn: { wins: 9, losses: 6 },
  Thomas: { wins: 8, losses: 6 },
}

function buildMatches(totals) {
  const wins = Object.fromEntries(
    Object.entries(totals).map(([p, t]) => [p, t.wins])
  )
  const losses = Object.fromEntries(
    Object.entries(totals).map(([p, t]) => [p, t.losses])
  )
  const matches = []

  const remaining = (m) => Object.values(m).reduce((a, b) => a + b, 0)
  while (remaining(wins) > 0) {
    const winner = Object.keys(wins)
      .filter((p) => wins[p] > 0)
      .sort((a, b) => wins[b] - wins[a])[0]
    const loser = Object.keys(losses)
      .filter((p) => p !== winner && losses[p] > 0)
      .sort((a, b) => losses[b] - losses[a])[0]
    if (!loser) throw new Error("totals are not realizable as pairwise matches")
    wins[winner] -= 1
    losses[loser] -= 1
    matches.push({ winner, loser })
  }
  return matches
}

const db = new PrismaClient()

try {
  const existing = await db.match.count()
  if (existing > 0) {
    console.log(
      `${existing} match(es) already recorded; refusing to seed because that ` +
        `would double every total. Delete them first if you really want to reseed.`
    )
    process.exitCode = 1
  } else {
    const matches = buildMatches(TOTALS)

    // Backdate so the seeded history sorts before anything recorded from now on.
    const start = Date.now() - matches.length * 60_000
    await db.match.createMany({
      data: matches.map((match, index) => ({
        ...match,
        createdAt: new Date(start + index * 60_000),
      })),
    })

    console.log(`inserted ${matches.length} matches`)
  }
} finally {
  await db.$disconnect()
}
