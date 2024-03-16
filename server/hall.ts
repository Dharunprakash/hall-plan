import { z } from "zod"
import { HallSchema } from "@/schemas/hall"

import { db } from "@/lib/db"

import { publicProcedure, router } from "./trpc"

export const hallRouter = router({
  getAll: publicProcedure
    .input(z.string().nullish())
    .query(async ({ input: departmentId }) => {
      return await db.hall.findMany({
        where: {
          departmentId: departmentId ? { equals: departmentId } : undefined,
        },
        include: {
          seats: true,
        },
      })
    }),
  create: publicProcedure.input(HallSchema).mutation(async ({ input }) => {
    const hall = await db.hall.create({ data: { ...input } })
    const seats = await Promise.all(
      [...Array(input.rows)].map(async (_, i) => {
        return [...Array(input.cols)].map(async (_, j) => {
          return await db.seat.create({
            data: {
              hallId: hall.id,
              row: i + 1,
              col: j + 1,
              isBlocked: false,
            },
          })
        })
      })
    )
    return { ...hall, seats }
  }),
})
