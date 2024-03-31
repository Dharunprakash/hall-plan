import { GeneratePlan } from "@/lib/generate"

describe("isPossibleToMakeThemSit", () => {
  it("should return true when there are enough seats for all students", () => {
    console.log(new GeneratePlan([1, 2, 3, 4], 5, 5).isPossibleToMakeThemSit())
    expect(new GeneratePlan([1, 2, 3, 4], 5, 5).isPossibleToMakeThemSit()).toBe(
      true
    ) // True
    expect(new GeneratePlan([1, 2, 3, 4], 5, 6).isPossibleToMakeThemSit()).toBe(
      true
    ) // True
    expect(new GeneratePlan([1, 2, 3, 4], 6, 5).isPossibleToMakeThemSit()).toBe(
      true
    ) // True
    expect(new GeneratePlan([1, 2, 3, 4], 6, 6).isPossibleToMakeThemSit()).toBe(
      true
    ) // True
    expect(new GeneratePlan([1, 2, 3, 4], 7, 7).isPossibleToMakeThemSit()).toBe(
      true
    ) // True
    expect(new GeneratePlan([1, 2, 3, 4], 8, 8).isPossibleToMakeThemSit()).toBe(
      true
    ) // True
    expect(new GeneratePlan([1, 2, 3, 4], 9, 9).isPossibleToMakeThemSit()).toBe(
      true
    ) // True
    expect(
      new GeneratePlan([1, 2, 3, 4], 10, 10).isPossibleToMakeThemSit()
    ).toBe(true) // True
    expect(
      new GeneratePlan([1, 2, 3, 4], 11, 11).isPossibleToMakeThemSit()
    ).toBe(true) // True
    expect(
      new GeneratePlan([1, 2, 3, 4], 12, 12).isPossibleToMakeThemSit()
    ).toBe(true) // True
    expect(
      new GeneratePlan([1, 2, 3, 4], 13, 13).isPossibleToMakeThemSit()
    ).toBe(true) // True
    expect(
      new GeneratePlan([1, 2, 3, 4], 14, 14).isPossibleToMakeThemSit()
    ).toBe(true) // True
    expect(
      new GeneratePlan([1, 2, 3, 4], 15, 15).isPossibleToMakeThemSit()
    ).toBe(true) // True
  })

  it("should return false when there are not enough seats for all students", () => {
    expect(new GeneratePlan([1, 2, 3, 4], 5, 4).isPossibleToMakeThemSit()).toBe(
      false
    )
    expect(new GeneratePlan([1, 2, 3, 4], 4, 5).isPossibleToMakeThemSit()).toBe(
      false
    )
  })
})
