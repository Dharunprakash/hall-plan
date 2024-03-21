import { collegeRouter } from "./college"
import { departmentRouter } from "./department"
import { examRouter } from "./exam"
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
  exam: examRouter,
})
export type AppRouter = typeof appRouter
