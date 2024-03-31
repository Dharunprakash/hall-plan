"use client"

import React from "react"
import Link from "next/link"
import { useParams, usePathname, useSearchParams } from "next/navigation"

import { cn } from "@/lib/utils"

const SideBar = ({ className }: { className?: string }) => {
  const pathname = usePathname()
  const params = useParams()
  const searchParams = useSearchParams()
  const tabs = [
    {
      name: "Hall-Plan",
      path: `/generate/${params.id}/output?planType=hall-plan`,
      query: "hall-plan",
      icon: "📋",
    },
    {
      name: "Seat-Plan",
      path: `/generate/${params.id}/output?planType=seat-plan`,
      query: "seat-plan",
      icon: "🪑",
    },
    {
      name: "Attendance",
      path: `/generate/${params.id}/output?planType=attendance`,
      query: "attendance",
      icon: "📝",
    },
    {
      name: "Vertical",
      path: `/generate/${params.id}/output?planType=vertical`,
      query: "vertical",
      icon: "🎓",
    },
  ]
  return (
    <nav className={cn("grid h-fit grid-rows-4 gap-x-1 px-1", className)}>
      {tabs.map((tab) => (
        <Link href={tab.path} key={tab.path} className="flex-1 text-center">
          <div
            className={cn(
              "flex items-center  gap-2 rounded-md p-2 transition-all hover:bg-gray-200",
              searchParams.get("planType") === tab.query && "bg-gray-200"
            )}
          >
            <span>{tab.icon}</span>
            <span>{tab.name}</span>
          </div>
        </Link>
      ))}
    </nav>
  )
}

export default SideBar
