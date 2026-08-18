import { db } from "@/lib/db"
import { isPlayer, PLAYERS, type Player } from "@/lib/players"

export type MatchInput = {
  winner: string
  loser: string
}

export type PlayerStanding = {
  player: Player
  wins: number
  losses: number
  played: number
  winRate: number
}

export function validateMatch(input: MatchInput): string | null {
  if (!isPlayer(input.winner) || !isPlayer(input.loser)) {
    return "Winner and loser must both be known players."
  }
  if (input.winner === input.loser) {
    return "Winner and loser must be different players."
  }
  return null
}

export function getRecentMatches() {
  return db.match.findMany({ orderBy: { createdAt: "desc" } })
}

export async function getStandings(): Promise<PlayerStanding[]> {
  const matches = await db.match.findMany({
    select: { winner: true, loser: true },
  })

  const standings = new Map<Player, PlayerStanding>(
    PLAYERS.map((player) => [
      player,
      { player, wins: 0, losses: 0, played: 0, winRate: 0 },
    ])
  )

  for (const match of matches) {
    const winner = standings.get(match.winner as Player)
    const loser = standings.get(match.loser as Player)
    if (winner) {
      winner.wins += 1
      winner.played += 1
    }
    if (loser) {
      loser.losses += 1
      loser.played += 1
    }
  }

  return Array.from(standings.values())
    .map((standing) => ({
      ...standing,
      winRate: standing.played === 0 ? 0 : standing.wins / standing.played,
    }))
    .sort((a, b) => b.wins - a.wins || b.winRate - a.winRate)
}
