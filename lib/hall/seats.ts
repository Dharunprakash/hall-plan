import { $Enums, Seat } from "@prisma/client"
import { HallWithSeats } from "@/types/hall"

// ========================
// Strategy Pattern
// ========================

/**
 * Interface for segregation strategies.
 */
interface SegregationStrategy {
  assignGroups(groups: number[], k: number): { groupCounts: number[]; groupAssignment: number[] }
}

/**
 * Maximal Segregation Strategy: Assigns the largest group to the first available group.
 */
class MaximalSegregationStrategy implements SegregationStrategy {
  assignGroups(groups: number[], k: number): { groupCounts: number[]; groupAssignment: number[] } {
    const sortedGroups = [...groups].sort((a, b) => b - a)
    const groupCounts = Array(k).fill(0)
    for (let i = 0; i < k; i++) {
      groupCounts[i] = sortedGroups[i]
    }
    const groupAssignment = groups.map((_, index) => index + 1)
    return { groupCounts, groupAssignment }
  }
}

/**
 * Random Segregation Strategy: Randomly assigns groups.
 */
class RandomSegregationStrategy implements SegregationStrategy {
  assignGroups(groups: number[], k: number): { groupCounts: number[]; groupAssignment: number[] } {
    const shuffledGroups = [...groups].sort(() => Math.random() - 0.5)
    const groupCounts = Array(k).fill(0)
    for (let i = 0; i < k; i++) {
      groupCounts[i] = shuffledGroups[i]
    }
    const groupAssignment = shuffledGroups.map((_, index) => index + 1)
    return { groupCounts, groupAssignment }
  }
}

/**
 * Minimal Segregation Strategy: Balances group assignments.
 */
class MinimalSegregationStrategy implements SegregationStrategy {
  assignGroups(groups: number[], k: number): { groupCounts: number[]; groupAssignment: number[] } {
    const sortedGroups = [...groups].sort((a, b) => a - b)
    const groupCounts = Array(k).fill(0)
    for (let i = 0; i < k; i++) {
      groupCounts[i] = sortedGroups[i]
    }
    const groupAssignment = sortedGroups.map((_, index) => index + 1)
    return { groupCounts, groupAssignment }
  }
}

// ========================
// Factory Pattern
// ========================

/**
 * Factory for creating segregation strategies.
 */
class SegregationStrategyFactory {
  static createStrategy(segregationType: "Maximal" | "Random" | "Minimal"): SegregationStrategy {
    switch (segregationType) {
      case "Maximal":
        return new MaximalSegregationStrategy()
      case "Random":
        return new RandomSegregationStrategy()
      case "Minimal":
        return new MinimalSegregationStrategy()
      default:
        throw new Error(`Unknown segregation type: ${segregationType}`)
    }
  }
}

// ========================
// Main Logic
// ========================

/**
 * Separates seats into k groups based on the arrangement type.
 */
export const separateSeatsIntoKGroups = (
  seats: Seat[],
  type: "STAGGERED" | "ALTERNATE",
  k: number
): number[] => {
  const totalSeats = seats.length
  const groups = Array(k).fill(0)

  for (let i = 0; i < totalSeats; i++) {
    if (seats[i].isBlocked) continue

    if (type === "STAGGERED") {
      const groupIndex = i % k
      groups[groupIndex]++
    } else {
      const groupIndex = seats[i].col % k
      groups[groupIndex]++
    }
  }

  return groups
}

/**
 * Separates seats into k groups for multiple halls using the specified strategy.
 */
export const separateSeatsIntoKGroupsForHalls = (
  halls: HallWithSeats[],
  type: $Enums.HallArrangementType,
  segregationType: "Maximal" | "Random" | "Minimal",
  k: number
): {
  groupCounts: number[]
  seatsTypeForHalls: number[][]
} => {
  if (type === "NORMAL") {
    const totalSeats = halls.reduce(
      (acc, hall) =>
        acc + hall.seats.reduce((ac, seat) => ac + (seat.isBlocked ? 0 : 1), 0),
      0
    )
    return {
      groupCounts: [totalSeats, ...Array(k - 1).fill(0)],
      seatsTypeForHalls: Array(halls.length).fill([1, ...Array(k - 1).fill(0)]),
    }
  }

  const groupCounts = Array(k).fill(0)
  const seatsTypeForHalls: number[][] = []

  // Create the appropriate strategy using the factory
  const strategy = SegregationStrategyFactory.createStrategy(segregationType)

  for (let hall of halls) {
    const groups = separateSeatsIntoKGroups(hall.seats, type, k)
    const { groupCounts: hallGroupCounts, groupAssignment } = strategy.assignGroups(groups, k)

    // Update the total group counts
    for (let i = 0; i < k; i++) {
      groupCounts[i] += hallGroupCounts[i]
    }

    // Record the group assignment for this hall
    seatsTypeForHalls.push(groupAssignment)
  }

  return {
    groupCounts,
    seatsTypeForHalls,
  }
}
