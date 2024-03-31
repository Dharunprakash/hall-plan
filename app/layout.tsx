import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { auth } from "@/auth"
import { SessionProvider } from "next-auth/react"

import TRPCProvider from "./_trpc/Provider"
import "./globals.css"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"

import { ToastProvider } from "@/components/provider/toaster-provider"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: "Exam Hall plan generator",
  description: "Generate exam hall plans for your school or institution",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  // await clearAllExamIds()
  return (
    <SessionProvider session={session}>
      <TRPCProvider>
        <html lang="en">
          <body className={inter.className}>
            <ToastProvider />
            <ReactQueryDevtools />
            <main className="h-full w-full">{children}</main>
          </body>
        </html>
      </TRPCProvider>
    </SessionProvider>
  )
}
