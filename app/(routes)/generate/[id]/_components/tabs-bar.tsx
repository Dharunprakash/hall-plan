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
      path: `/generate/${params.id}/details`,
    },
    {
      name: "Halls",
      path: `/generate/${params.id}/halls`,
    },
    {
      name: "Students",
      path: `/generate/${params.id}/students`,
    },
    // {
    //   name: 'Plan',
    //   path: 'generate/output',
    // },
  ]
  return (
    <div className="flex w-full justify-evenly">
      {routes.map((route) => (
        <Link
          key={route.path}
          href={route.path}
          className={cn(
            "border-1 w-full border-gray-400 bg-gray-900 py-2 text-center text-white transition-all hover:bg-gray-950",
            pathname.includes(route.path) && "border-gray-100 bg-black"
          )}
        >
          {route.name}
        </Link>
      ))}
    </div>
  )
}

export default TabsBar
