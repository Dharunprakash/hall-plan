"use client"

import { useCallback, useState } from "react"
import toast from "react-hot-toast"

import { HallWithDeptAndBasicSeats, HallWithSeatsAndDept } from "@/types/hall"
import { BasicSeat } from "@/types/seat"
import {
  getCapacity,
  mapArrayOfPairToMatrix,
  mapMatrixToArrayOfPair,
  transformHall,
  updateSeatMatrixDimensions,
} from "@/lib/hall/utils"
import { cn } from "@/lib/utils"
import { trpc } from "@/app/_trpc/client"

import DisplaySeats from "./display-seats"
import EditHallDimension from "./edit-hall-dimension"
import HallMetaData from "./hall-meta-data"

const HallCard = ({
  hall: initialHall,
  className,
}: {
  hall: HallWithSeatsAndDept
  className?: string
}) => {
  console.log(initialHall)
  const utils = trpc.useUtils()
  const editHall = trpc.hall.edit.useMutation({
    onSuccess: (data) => {
      toast.remove()
      utils.hall.getAll.cancel()
      utils.hall.getAll.setData(initialHall.departmentId, (prev) => {
        return prev?.map((hall) => {
          if (hall.id === data.id) {
            return data
          }
          return hall
        })
      })
      toast.success("Hall updated")
      setIsEditing(false)
    },
    onError: (err) => {
      toast.remove()
      toast.error(err.message)
    },
  })
  const [hallState, setHallState] = useState<HallWithDeptAndBasicSeats>(() =>
    transformHall(initialHall)
  )
  const [isEditing, setIsEditing] = useState(false)
  const toggleEditing = useCallback(() => {
    setIsEditing((prev) => !prev)
  }, [])

  const cancelEditing = useCallback(() => {
    console.log("hi")
    setHallState(transformHall(editHall.data ?? initialHall))
    setIsEditing(false)
  }, [editHall.data, initialHall])

  const setRows = useCallback((value: number) => {
    if (value <= 0) return
    setHallState((prev) => ({
      ...prev,
      rows: value,
      seats: updateSeatMatrixDimensions(
        prev.seats,
        value || prev.rows,
        prev.cols
      ),
    }))
  }, [])

  const setCols = useCallback((value: number) => {
    if (value <= 0) return
    setHallState((prev) => ({
      ...prev,
      cols: value,
      seats: updateSeatMatrixDimensions(
        prev.seats,
        prev.rows,
        value || prev.cols
      ),
    }))
  }, [])
  const toggleBlockSeat = useCallback(
    (row: number, col: number) => {
      if (hallState.rows <= 0 || hallState.cols <= 0) return

      setHallState((prev) => {
        const newSeats = prev.seats.map((r, i) =>
          r.map((s, j) => {
            if (i === row && j === col) {
              return {
                ...s,
                isBlocked: !s.isBlocked,
              }
            }
            return s
          })
        )
        return {
          ...prev,
          seats: newSeats,
        }
      })
    },
    [hallState.cols, hallState.rows]
  )

  const handleSubmit = useCallback(async () => {
    if (hallState.rows <= 0 || hallState.cols <= 0) return
    console.log(hallState)
    // check if data is unchanged
    const initialSeats = mapArrayOfPairToMatrix<BasicSeat>(
      initialHall.seats,
      initialHall.rows,
      initialHall.cols
    )
    if (
      hallState.rows === initialHall.rows &&
      hallState.cols === initialHall.cols &&
      hallState.seats.every((row, i) =>
        row.every((seat, j) => seat.isBlocked === initialSeats[i][j].isBlocked)
      )
    ) {
      setIsEditing(false)
      return
    }
    toast.loading("Updating...")
    try {
      editHall.mutateAsync({
        id: hallState.id,
        rows: hallState.rows,
        cols: hallState.cols,
        seats: mapMatrixToArrayOfPair(hallState.seats),
      })
    } catch (error) {}
  }, [
    editHall,
    hallState,
    initialHall.cols,
    initialHall.rows,
    initialHall.seats,
  ])

  return (
    <div
      className={cn(
        "relative my-2 rounded-lg border border-slate-100 !bg-slate-100 p-3",
        className
      )}
    >
      <HallMetaData
        cancelEditing={cancelEditing}
        departmentCode={hallState.department.code}
        hallno={hallState.hallno}
        handleSubmit={handleSubmit}
        isEditing={isEditing}
        toggleEditing={toggleEditing}
      />
      <div className="grid w-full grid-cols-2">
        <div>
          <EditHallDimension
            dimension={hallState.rows}
            isEditing={isEditing}
            name="Rows"
            setDimension={setRows}
          />
          <EditHallDimension
            dimension={hallState.cols}
            isEditing={isEditing}
            name="Cols"
            setDimension={setCols}
          />
        </div>
        <div className="text-center">
          <p>Type: {hallState.type}</p>
          <p>TotalSeats: {getCapacity(hallState.seats)}</p>
        </div>
      </div>
      <DisplaySeats
        isEditing={isEditing}
        seats={hallState.seats}
        toggleBlockSeat={toggleBlockSeat}
      />
    </div>
  )
}

export default HallCard
