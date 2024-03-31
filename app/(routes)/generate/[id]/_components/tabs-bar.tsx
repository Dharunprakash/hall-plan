"use client"

import React from "react"
import Link from "next/link"
import { useParams, usePathname } from "next/navigation"

import { cn } from "@/lib/utils"

const TabsBar = ({ className }: { className?: string }) => {
  const pathname = usePathname()
  const params = useParams()
  const routes = [
    {
      name: "Details",
      route: "/details",
      path: `/generate/${params.id}/details`,
    },
    {
      name: "Halls",
      route: "/halls",
      path: `/generate/${params.id}/halls`,
    },
    {
      name: "Students",
      route: "/students",
      path: `/generate/${params.id}/students`,
    },
    {
      name: "Plan",
      route: "/output",
      path: `/generate/${params.id}/output/hall-plan`,
    },
  ]
  return (
    <div
      className={cn(
        "bg-muted text-muted-foreground grid h-10 w-full grid-cols-4 items-center justify-center gap-x-1 rounded-md p-1",
        className
      )}
    >
      {routes.map((route) => (
        <Link
          key={route.path}
          href={route.path}
          className={cn(
            "ring-offset-background focus-visible:ring-ring data-[state=active]:bg-background data-[state=active]:text-foreground inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all hover:bg-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm",
            pathname.includes(route.route) && "bg-black text-white"
          )}
        >
          {route.name}
        </Link>
      ))}
    </div>
  )
}

export default TabsBar
