"use client"

import React from "react"

import { useHallStateWithSeat } from "@/hooks/use-hall-state"
import { Input } from "@/components/ui/input"

const DisplayHallDimension = () => {
  const rows = useHallStateWithSeat((s) => s.rows)
  const cols = useHallStateWithSeat((s) => s.cols)
  const setRows = useHallStateWithSeat((s) => s.setRows)
  const setCows = useHallStateWithSeat((s) => s.setCols)

  return (
    <div className="flex w-full items-center justify-between gap-4">
      <Input
        className="!-mt-[0.05rem] !h-5"
        value={rows}
        onChange={(e) => setRows(e.target.valueAsNumber)}
        placeholder="Rows"
        type="number"
      />
      <Input
        className="!-mt-[0.05rem] !h-5"
        value={cols}
        onChange={(e) => setCows(e.target.valueAsNumber)}
        placeholder="Rows"
        type="number"
      />
    </div>
  )
}

export default DisplayHallDimension
