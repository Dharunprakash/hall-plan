"use client"

import React from "react"
import Link from "next/link"
import { useParams, usePathname } from "next/navigation"

import { cn } from "@/lib/utils"

const SideBar = ({ className }: { className?: string }) => {
  const pathname = usePathname()
  const params = useParams()
  const tabs = [
    {
      name: "Hall-Plan",
      path: `/generate/${params.id}/output/hall-plan`,
      icon: "📋",
    },
    {
      name: "Arrangement",
      path: `/generate/${params.id}/output/hall-arrangement`,
      icon: "🪑",
    },
    {
      name: "Attendance",
      path: `/generate/${params.id}/output/attendance`,
      icon: "📝",
    },
    {
      name: "Vertical",
      path: `/generate/${params.id}/output/vertical`,
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
              pathname.includes(tab.path) && "bg-gray-200"
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
