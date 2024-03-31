"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { routes } from "@/lib/constants"
import { cn } from "@/lib/utils"

const Routes = () => {
  const pathname = usePathname()
  return (
    <>
      {routes.map((route, index) => (
        <Link
          href={route.path}
          key={index}
          className={cn(
            "rounded-2xl p-1 px-2 transition hover:bg-slate-200",
            pathname.includes(route.path) && "bg-slate-100"
          )}
        >
          {route.name}
        </Link>
      ))}
    </>
  )
}

export default Routes
