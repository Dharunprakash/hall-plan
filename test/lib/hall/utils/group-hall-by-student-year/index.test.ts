import { groupHallByStudentYear } from "@/lib/hall/utils"

import { grouped } from "./data/grouped"
import { halls } from "./data/halls"

describe("groupHallByStudentYear", () => {
  it("should group halls by student year, semester and dept", () => {
    expect(groupHallByStudentYear(halls)).toEqual(grouped)
  })
})
