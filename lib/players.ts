export const PLAYERS = ["Thomas", "Cody", "Neo", "Lynn"] as const

export type Player = (typeof PLAYERS)[number]

export function isPlayer(value: unknown): value is Player {
  return typeof value === "string" && (PLAYERS as readonly string[]).includes(value)
}
