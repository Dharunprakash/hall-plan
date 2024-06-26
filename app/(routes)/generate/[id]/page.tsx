import React from "react"
import { redirect } from "next/navigation"

const page = ({
  params,
}: {
  params: {
    id: string
  }
}) => {
  redirect(`/generate/${params.id}/details`)
}

export default page

// import { HallWithSeatsWithStudentsAndDept } from "@/types/hall"
// import { db } from "@/lib/db"
// import { groupHallByStudentYear } from "@/lib/hall/utils"
// import { serverClient } from "@/app/_trpc/serverClient"

// import HallPlanTable from "./_components/hall-plan-table"

// const Page = async ({
//   params,
// }: {
//   params: {
//     id: string
//   }
// }) => {
//   const halls: HallWithSeatsWithStudentsAndDept[] = (await db.hall.findMany({
//     include: {
//       department: true,
//       seats: {
//         include: {
//           student: true,
//         },
//       },
//     },
//   }))!
//   const grouped = groupHallByStudentYear(halls)
//   return (
//     <div>
//       {grouped.map(([key, halls]) => {
//         const { year, semester, dept } = JSON.parse(key)
//         return (
//           <HallPlanTable
//             key={key}
//             year={Number(year)}
//             semester={Number(semester)}
//             halls={Array.from(halls)}
//           />
//         )
//       })}
//     </div>
//   )

//   // return (
//   //   <VerticalCount
//   //     examDetail={{
//   //       halls: [hall],
//   //       students: hall.seats
//   //         .map((seat) => seat.student)
//   //         .filter(Boolean) as Student[],
//   //     }}
//   //   />
//   // )
//   // return <AttendanceTable hall={hall} />
//   // return <HallArrangementTable hall={hall} />
//   const { id } = params
//   const examDetail = await serverClient.exam.get(id)
//   if (!examDetail) {
//     return <div>Exam not found</div>
//   }
//   return (
//     <div className="form-group container flex flex-col gap-2 max-sm:min-h-screen max-sm:!p-0">
//       {/* <div className="flex items-center justify-between"> */}
//       {/* <div>
//           <Link href="/">
//             <Button variant="outline">Go Back</Button>
//           </Link>
//         </div>
//         <div className="flex gap-6 max-md:flex-col">
//           <h1 className="text-lg font-bold md:text-2xl">
//             Total Hall Capacity:{" "}
//             {examDetail.halls
//               .map((hall) =>
//                 hall.seats.reduce((a, b) => a + Number(!b.isBlocked), 0)
//               )
//               .reduce((a, b) => a + b, 0)}
//           </h1>
//           <h1 className="text-lg font-bold md:text-2xl">
//             Total Students: {examDetail.students.length}
//           </h1>
//         </div>
//       </div> */}
//       {/* <Tabs defaultValue="plan"> */}
//       {/* <TabsList className="flex gap-2">
//           <TabsTrigger value="plan" className="w-full">
//             Hall Plan
//           </TabsTrigger>
//           <TabsTrigger value="arrangement" className="w-full">
//             Hall Arrangement
//           </TabsTrigger>
//           <TabsTrigger value="attendance" className="w-full">
//             Attendance
//           </TabsTrigger>
//           <TabsTrigger value="verticalcount" className="w-full">
//             Vertical Count
//           </TabsTrigger>
//         </TabsList>
//         <TabsContent value="plan">
//           <DisplayPlan name="hallplan" data={examDetail} />
//         </TabsContent>
//         <TabsContent value="arrangement">
//           <DisplayPlan name="seatarrangement" data={examDetail} />
//         </TabsContent>
//         <TabsContent value="attendance">
//           <DisplayPlan name="attendance" data={examDetail} />
//         </TabsContent>
//         <TabsContent value="verticalcount">
//           <DisplayPlan name="verticalcount" data={examDetail} />
//         </TabsContent>
//       </Tabs> */}
//     </div>
//   )
// }

// export default Page
