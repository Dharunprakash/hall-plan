import { GeneratePlan } from "@/lib/generate"

describe("generateCombinations", () => {
  it("should return true when there are enough seats for all students", () => {
    expect(new GeneratePlan([1, 2, 3, 4], 5, 5).generateCombinations()).toEqual(
      [2, 1, 1, 2]
    ) // True
    expect(new GeneratePlan([1, 2, 3, 4], 5, 6).generateCombinations()).toEqual(
      [2, 1, 1, 2]
    ) // True
    expect(new GeneratePlan([1, 2, 3, 4], 6, 5).generateCombinations()).toEqual(
      [2, 1, 2, 1]
    ) // True
    expect(new GeneratePlan([1, 2, 3, 4], 6, 6).generateCombinations()).toEqual(
      [2, 1, 2, 1]
    ) // True
    expect(new GeneratePlan([1, 2, 3, 4], 7, 7).generateCombinations()).toEqual(
      [2, 1, 2, 1]
    ) // True
    expect(new GeneratePlan([1, 2, 3, 4], 8, 8).generateCombinations()).toEqual(
      [2, 1, 2, 1]
    ) // True
    expect(new GeneratePlan([1, 2, 3, 4], 9, 9).generateCombinations()).toEqual(
      [2, 1, 2, 1]
    ) // True
    expect(
      new GeneratePlan([1, 2, 3, 4], 10, 10).generateCombinations()
    ).toEqual([2, 1, 2, 1]) // True
    expect(
      new GeneratePlan([1, 2, 3, 4], 11, 11).generateCombinations()
    ).toEqual([2, 1, 2, 1]) // True
    expect(
      new GeneratePlan([1, 2, 3, 4], 12, 12).generateCombinations()
    ).toEqual([2, 1, 2, 1]) // True
    expect(
      new GeneratePlan([1, 2, 3, 4], 13, 13).generateCombinations()
    ).toEqual([2, 1, 2, 1]) // True
    expect(
      new GeneratePlan([1, 2, 3, 4], 14, 14).generateCombinations()
    ).toEqual([2, 1, 2, 1]) // True
    expect(
      new GeneratePlan([1, 2, 3, 4], 15, 15).generateCombinations()
    ).toEqual([2, 1, 2, 1]) // True
  })

  it("should return false when there are not enough seats for all students", () => {
    expect(new GeneratePlan([1, 2, 3, 4], 5, 4).generateCombinations()).toBe(
      undefined
    )
    expect(new GeneratePlan([1, 2, 3, 4], 4, 5).generateCombinations()).toBe(
      undefined
    )
    expect(new GeneratePlan([1, 2, 3, 4], 4, 4).generateCombinations()).toBe(
      undefined
    )
  })
})
