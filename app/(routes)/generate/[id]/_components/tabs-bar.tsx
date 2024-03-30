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
    <div className="flex w-full justify-evenly gap-3 rounded-md bg-gray-600 p-[0.2rem] pb-[0.25rem]">
      {routes.map((route) => (
        <Link
          key={route.path}
          href={route.path}
          className={cn(
            " w-full rounded-md py-[0.6rem] text-center text-white transition-all hover:bg-gray-700",
            pathname.includes(route.path) && "bg-purple-900"
          )}
        >
          {route.name}
        </Link>
      ))}
    </div>
  )
}

export default TabsBar
