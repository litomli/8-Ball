"use client"

import { useState, useTransition } from "react"

import { recordMatch } from "@/app/actions"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { PLAYERS } from "@/lib/players"

export function MatchForm() {
  const [winner, setWinner] = useState<string>("")
  const [loser, setLoser] = useState<string>("")
  const [message, setMessage] = useState<{
    type: "error" | "success"
    text: string
  } | null>(null)
  const [isPending, startTransition] = useTransition()

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setMessage(null)

    if (!winner || !loser) {
      setMessage({ type: "error", text: "Pick both a winner and a loser." })
      return
    }
    if (winner === loser) {
      setMessage({
        type: "error",
        text: "Winner and loser must be different players.",
      })
      return
    }

    startTransition(async () => {
      const result = await recordMatch(winner, loser)
      if (result.error) {
        setMessage({ type: "error", text: result.error })
        return
      }
      setMessage({ type: "success", text: `Recorded: ${winner} beat ${loser}.` })
      setWinner("")
      setLoser("")
    })
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <label htmlFor="winner" className="text-sm font-medium">
            Winner
          </label>
          <Select value={winner} onValueChange={setWinner}>
            <SelectTrigger id="winner" aria-label="Winner">
              <SelectValue placeholder="Select winner" />
            </SelectTrigger>
            <SelectContent>
              {PLAYERS.map((player) => (
                <SelectItem key={player} value={player}>
                  {player}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <label htmlFor="loser" className="text-sm font-medium">
            Loser
          </label>
          <Select value={loser} onValueChange={setLoser}>
            <SelectTrigger id="loser" aria-label="Loser">
              <SelectValue placeholder="Select loser" />
            </SelectTrigger>
            <SelectContent>
              {PLAYERS.map((player) => (
                <SelectItem key={player} value={player}>
                  {player}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {message ? (
        <p
          role="status"
          className={
            message.type === "error"
              ? "text-sm text-destructive"
              : "text-sm text-muted-foreground"
          }
        >
          {message.text}
        </p>
      ) : null}

      <div>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving..." : "Record match"}
        </Button>
      </div>
    </form>
  )
}
