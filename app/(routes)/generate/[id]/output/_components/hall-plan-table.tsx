import { HallWithSeatsWithStudentsAndDept } from "@/types/hall"
import { segregateHallsBySection } from "@/lib/hall/utils"
import { intToRoman } from "@/lib/utils"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

const HallPlanTable = ({
  year,
  semester,
  halls,
}: {
  year: number
  semester: number
  halls: HallWithSeatsWithStudentsAndDept[]
}) => {
  const { hallPlans } = segregateHallsBySection(halls, year)
  return (
    <ScrollArea className="whitespace-nowrap rounded-md max-sm:mx-2 max-sm:w-screen max-sm:border max-sm:px-2">
      <div className="table-responsive">
        <table className="table-bordered mx-auto table">
          <thead>
            <tr>
              <th
                rowSpan={2}
                className="max-w-[100px] whitespace-normal border px-4 py-2 text-center md:max-w-[200px] md:text-base"
              >
                Year / Semester
              </th>
              <th
                rowSpan={2}
                className="border px-4 py-2 text-center md:min-w-[140px]"
              >
                Section
              </th>
              <th
                colSpan={2}
                rowSpan={1}
                className="border px-4 py-2 text-center md:min-w-[160px]"
              >
                Roll No
              </th>
              <th
                rowSpan={2}
                className="max-w-[100px] whitespace-normal border px-4 py-2 text-center md:max-w-[200px] md:text-base"
              >
                Hall No. & Total Strength
              </th>

              <th
                rowSpan={2}
                className="max-w-[100px] whitespace-normal border px-4 py-2 text-center md:max-w-[200px] md:text-base"
              >
                Block / Floor
              </th>
            </tr>
            <tr>
              <th className="min-w-[70px] border px-4 py-2 md:min-w-[80px]">
                From
              </th>
              <th className="min-w-[70px] border px-4 py-2 md:min-w-[80px]">
                To
              </th>
            </tr>
          </thead>
          <tbody>
            {hallPlans.map(([section, hall], ind) => (
              <tr key={hall.id}>
                {ind == 0 && (
                  <td
                    className={`border px-4 py-2 text-center`}
                    rowSpan={hallPlans.length}
                  >
                    {intToRoman(year)} / {intToRoman(semester)}
                  </td>
                )}
                <td className="border px-4 py-2 text-center">{section}</td>
                <td className="border px-4 py-2 text-center">
                  {hall.startRollNo}
                </td>
                <td className="border px-4 py-2 text-center">
                  {hall.endRollNo}
                </td>
                <td className="border px-4 py-2 text-center">{hall.hallno}</td>
                {ind == 0 && (
                  <td
                    rowSpan={hallPlans.length}
                    className="border px-4 py-2 text-center"
                  >
                    {hall.department.code}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  )
}

export default HallPlanTable
