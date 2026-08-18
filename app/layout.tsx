import type { Metadata } from "next"
import { Inter } from "next/font/google"

import { SiteNav } from "@/components/site-nav"

import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "8-Ball H2H",
  description: "Record 8-ball pool match results and track the leaderboard.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SiteNav />
        <main className="container py-10">{children}</main>
      </body>
    </html>
  )
}
