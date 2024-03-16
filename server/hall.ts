import { HallSchema } from "@/schemas/hall"
import { Seat } from "@prisma/client"
import { z } from "zod"

import { HallWithSeatsAndDept } from "@/types/hall"
import { db } from "@/lib/db"

import { publicProcedure, router } from "./trpc"

export const hallRouter = router({
  getAll: publicProcedure
    .input(z.string().nullish())
    .query(async ({ input: departmentId }): Promise<HallWithSeatsAndDept[]> => {
      return await db.hall.findMany({
        where: {
          departmentId: departmentId ? { equals: departmentId } : undefined,
        },
        include: {
          seats: true,
          department: true,
        },
      })
    }),
  create: publicProcedure
    .input(HallSchema)
    .mutation(async ({ input }): Promise<HallWithSeatsAndDept> => {
      const hall = await db.hall.create({
        data: { ...input },
        include: { department: true },
      })
      // create input.rows * input.cols seats
      const seats: Seat[] = await Promise.all(
        Array.from({ length: input.rows * input.cols }).map(async (_, i) => {
          return await db.seat.create({
            data: {
              hallId: hall.id,
              row: Math.floor(i / input.cols),
              col: i % input.cols,
            },
          })
        })
      )
      return { ...hall, seats: seats }
    }),
})
