"use client"

import React from "react"

import { useHallStateWithSeat } from "@/hooks/use-hall-state"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

const DisplayHallDimension = ({ className }: { className?: string }) => {
  const rows = useHallStateWithSeat((s) => s.rows)
  const cols = useHallStateWithSeat((s) => s.cols)
  const setRows = useHallStateWithSeat((s) => s.setRows)
  const setCows = useHallStateWithSeat((s) => s.setCols)
  const isEditing = useHallStateWithSeat((s) => s.isEditing)
  return (
    <div className={cn(className)}>
      <div className="flex items-center gap-1">
        <p>Rows:</p>
        {isEditing ? (
          <Input
            className="!-mt-[0.05rem] !h-5"
            value={rows}
            onChange={(e) => setRows(e.target.valueAsNumber)}
            placeholder="Rows"
            type="number"
          />
        ) : (
          <span>{rows}</span>
        )}
      </div>
      <div className="flex items-center gap-1">
        <p>Cols:</p>
        {isEditing ? (
          <Input
            className="!-mt-[0.05rem] !h-5"
            value={cols}
            onChange={(e) => setCows(e.target.valueAsNumber)}
            placeholder="Cols"
            type="number"
          />
        ) : (
          <span>{cols}</span>
        )}
      </div>
    </div>
  )
}

export default DisplayHallDimension
