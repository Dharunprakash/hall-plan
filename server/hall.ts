import { z } from "zod"

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
})
