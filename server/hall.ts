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
  getAllByDeptCode: publicProcedure
    .input(z.array(z.string()))
    .query(async ({ input: departmentCode }) => {
      console.log(departmentCode)
      // return await db.hall.findMany({ include: { seats: true, department: true } });
      return await db.hall.findMany({
        where: {
          department: { code: { in: departmentCode } },
        },
        select: {
          id: true,
          hallno: true,
          department: {
            select: {
              code: true,
              name: true,
            },
          },
        },
        orderBy: [
          {
            department: {
              code: "asc",
            },
          },
          {
            hallno: "asc",
          },
        ],
      })
    }),

  getAllMultiple: publicProcedure
    .input(z.array(z.string()).nullish())
    .query(
      async ({ input: departmentCodes }): Promise<HallWithSeatsAndDept[]> => {
        if (!departmentCodes || departmentCodes.length === 0)
          return await db.hall.findMany({
            include: { seats: true, department: true },
          })
        return await db.hall.findMany({
          where: {
            department: { code: { in: departmentCodes } },
          },
          include: {
            seats: true,
            department: true,
          },
        })
      }
    ),
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
  edit: publicProcedure
    .input(
      z.object({
        id: z.string(),
        rows: z.number(),
        cols: z.number(),
        seats: z.array(
          z.object({
            isBlocked: z.boolean(),
            row: z.number(),
            col: z.number(),
          })
        ),
      })
    )
    .mutation(async ({ input }): Promise<HallWithSeatsAndDept> => {
      // check if seats are unchanged, then make no changes

      // check if rows and cols are unchanged, then update seats only if isBlocked is changed

      // check if rows are less than input.rows, then add rows

      // check if cols are less than input.cols, then add cols

      // check if rows are greater than input.rows, then remove rows

      // check if cols are greater than input.cols, then remove cols

      await db.seat.deleteMany({ where: { hallId: input.id } })
      const seats: Seat[] = await Promise.all(
        input.seats.map(async (seat) => {
          return await db.seat.create({
            data: {
              hallId: input.id,
              row: seat.row,
              col: seat.col,
              isBlocked: seat.isBlocked,
            },
          })
        })
      )
      const hall = await db.hall.update({
        where: { id: input.id },
        data: { rows: input.rows, cols: input.cols },
        include: { department: true },
      })
      return { ...hall, seats }
    }),
})
