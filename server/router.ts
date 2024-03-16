import { collegeRouter } from "./college"
import { departmentRouter } from "./department"
import { generateRouter } from "./generate"
import { hallRouter } from "./hall"
import { studentRouter } from "./student"
import { publicProcedure, router } from "./trpc"

export const appRouter = router({
  test: publicProcedure.query(() => {
    return { message: "Hello World" }
  }),
  student: studentRouter,
  college: collegeRouter,
  department: departmentRouter,
  hall: hallRouter,
  generate: generateRouter,
})
export type AppRouter = typeof appRouter
