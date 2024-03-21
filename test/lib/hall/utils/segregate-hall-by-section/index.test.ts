import { segregateHallsBySection } from "@/lib/hall/utils"

import { hallPlans } from "./data/hall-plans"
import { halls } from "./data/input1-"
import { pairsHallsAndSections } from "./data/pairsHallsAndSection"

describe("segregateHallsBySection", () => {
  it("should segregate halls by section for a given year", () => {
    const year = 3
    const result = segregateHallsBySection(halls, year)
    expect(result.pairsHallsAndSections).toEqual(pairsHallsAndSections)
    expect(result.hallPlans).toEqual(hallPlans)
  })
})
