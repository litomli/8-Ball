import { MatchForm } from "@/components/match-form"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { getRecentMatches } from "@/lib/matches"

export const dynamic = "force-dynamic"

export default async function HomePage() {
  const matches = await getRecentMatches()

  return (
    <div className="grid gap-8">
      <Card>
        <CardHeader>
          <CardTitle>Record Match</CardTitle>
          <CardDescription>
            Log a head-to-head result. No login needed.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <MatchForm />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Match History</CardTitle>
          <CardDescription>Most recent matches first.</CardDescription>
        </CardHeader>
        <CardContent>
          {matches.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No matches recorded yet.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Winner</TableHead>
                  <TableHead>Loser</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {matches.map((match) => (
                  <TableRow key={match.id}>
                    <TableCell className="font-medium">{match.winner}</TableCell>
                    <TableCell>{match.loser}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {match.createdAt.toLocaleString("en-US", {
                        dateStyle: "medium",
                        timeStyle: "short",
                        timeZone: "UTC",
                      })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
